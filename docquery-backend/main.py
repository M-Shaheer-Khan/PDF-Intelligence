import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import process_pdf, delete_document
from retriever import retrieve_chunks
from answer import generate_answer

app = FastAPI(title="DocQuery API")

# Allow the React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class QueryRequest(BaseModel):
    doc_id: str
    question: str
    ai_polishing: bool = False


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    result = process_pdf(file_path, doc_id)

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "total_pages": result["total_pages"],
        "total_chunks": result["total_chunks"],
    }


@app.post("/query")
async def query_document(req: QueryRequest):
    chunks = retrieve_chunks(req.doc_id, req.question, top_k=5)

    if not chunks:
        raise HTTPException(status_code=404, detail="Document not found or empty")

    result = generate_answer(req.question, chunks, ai_polishing=req.ai_polishing)
    return result


@app.delete("/document/{doc_id}")
async def remove_document(doc_id: str):
    delete_document(doc_id)
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")
    if os.path.exists(file_path):
        os.remove(file_path)
    return {"status": "deleted"}


@app.get("/")
async def root():
    return {"status": "DocQuery API running"}