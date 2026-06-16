import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)


def save_document(doc_id: str, filename: str, total_pages: int, total_chunks: int):
    try:
        supabase.table("documents").insert({
            "doc_id": doc_id,
            "filename": filename,
            "total_pages": total_pages,
            "total_chunks": total_chunks,
        }).execute()
    except Exception as e:
        print(f"DB error saving document: {e}")


def save_chat(
    doc_id: str,
    question: str,
    answer: str,
    page_refs: list,
    follow_ups: list,
    ai_polishing: bool,
    web_grounded: bool,
):
    try:
        supabase.table("chats").insert({
            "doc_id": doc_id,
            "question": question,
            "answer": answer,
            "page_refs": page_refs,
            "follow_ups": follow_ups,
            "ai_polishing": ai_polishing,
            "web_grounded": web_grounded,
        }).execute()
    except Exception as e:
        print(f"DB error saving chat: {e}")


def get_chats_for_document(doc_id: str):
    try:
        res = supabase.table("chats") \
            .select("*") \
            .eq("doc_id", doc_id) \
            .order("created_at") \
            .execute()
        return res.data
    except Exception as e:
        print(f"DB error fetching chats: {e}")
        return []


def get_all_documents():
    try:
        res = supabase.table("documents") \
            .select("*") \
            .order("uploaded_at", desc=True) \
            .execute()
        return res.data
    except Exception as e:
        print(f"DB error fetching documents: {e}")
        return []