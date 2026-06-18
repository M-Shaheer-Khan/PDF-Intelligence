import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import process_pdf_bytes, delete_document
from retriever import retrieve_chunks
from answer import generate_answer
from database import save_document, save_chat, get_chats_for_document, get_all_documents

app = FastAPI(title="DocQuery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pdf-intelligence-phi.vercel.app/",  # replace with your actual URL
    ],
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

    save_document(
        doc_id=doc_id,
        filename=file.filename,
        total_pages=result["total_pages"],
        total_chunks=result["total_chunks"],
    )

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

    save_chat(
        doc_id=req.doc_id,
        question=req.question,
        answer=result["answer"],
        page_refs=result["page_refs"],
        follow_ups=result["follow_ups"],
        ai_polishing=req.ai_polishing,
        web_grounded=result["web_grounded"],
    )

    return result


@app.get("/history/{doc_id}")
async def get_history(doc_id: str):
    chats = get_chats_for_document(doc_id)
    return {"chats": chats}


@app.get("/documents")
async def list_documents():
    docs = get_all_documents()
    return {"documents": docs}


@app.delete("/document/{doc_id}")
async def remove_document(doc_id: str):
    delete_document(doc_id)
    return {"status": "deleted"}


@app.get("/")
async def root():
    return {"status": "DocQuery API running"}