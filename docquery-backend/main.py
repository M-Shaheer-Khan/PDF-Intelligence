import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import process_pdf_bytes, delete_document
from retriever import retrieve_chunks
from answer import generate_answer

app = FastAPI(title="DocQuery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    doc_id: str
    question: str
    ai_polishing: bool = False


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    doc_id = str(uuid.uuid4())
    file_bytes = await file.read()

    result = process_pdf_bytes(file_bytes, doc_id)

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
    return {"status": "deleted"}


@app.get("/")
async def root():
    return {"status": "DocQuery API running"}