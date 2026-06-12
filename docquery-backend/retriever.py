import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="./chroma_db")

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)


def retrieve_chunks(doc_id: str, query: str, top_k: int = 5):
    """
    Returns a list of {text, page} dicts for the top-k most relevant chunks.
    """
    collection = client.get_collection(name=doc_id, embedding_function=embedding_fn)

    results = collection.query(
        query_texts=[query],
        n_results=top_k,
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    chunks = []
    for doc_text, meta in zip(documents, metadatas):
        chunks.append({"text": doc_text, "page": meta["page"]})

    return chunks