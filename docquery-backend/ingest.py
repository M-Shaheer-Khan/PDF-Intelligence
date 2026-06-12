import fitz  # PyMuPDF
import chromadb
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter
import uuid

# Persistent vector store
client = chromadb.PersistentClient(path="./chroma_db")

# Local, free embedding function (no API key needed)
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
)


def process_pdf(file_path: str, doc_id: str):
    """
    Extracts text page-by-page, chunks it, and stores chunks in ChromaDB
    with page number metadata. Returns total page count.
    """
    doc = fitz.open(file_path)
    total_pages = doc.page_count

    # Get or create a collection for this document
    collection = client.get_or_create_collection(
        name=doc_id,
        embedding_function=embedding_fn,
    )

    chunks = []
    metadatas = []
    ids = []

    for page_num in range(total_pages):
        page = doc[page_num]
        text = page.get_text()
        if not text.strip():
            continue

        page_chunks = splitter.split_text(text)
        for chunk in page_chunks:
            chunks.append(chunk)
            metadatas.append({"page": page_num + 1})  # 1-indexed pages
            ids.append(str(uuid.uuid4()))

    if chunks:
        collection.add(
            documents=chunks,
            metadatas=metadatas,
            ids=ids,
        )

    doc.close()
    return {"total_pages": total_pages, "total_chunks": len(chunks)}


def delete_document(doc_id: str):
    try:
        client.delete_collection(name=doc_id)
    except Exception:
        pass