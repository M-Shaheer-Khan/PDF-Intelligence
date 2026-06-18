import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(query: str, chunks: list, ai_polishing: bool = False):
    context = "\n\n".join(
        f"[Page {c['page']}]: {c['text']}" for c in chunks
    )
    pages_used = sorted(set(c["page"] for c in chunks))

    if ai_polishing:
        prompt = f"""You are DocQuery, an AI assistant that answers questions about a PDF document.

Context extracted from the document (with page numbers):
{context}

User question: {query}

Instructions:
- Answer the question using the context above as the primary source.
- If the context is insufficient or the question goes beyond it, you may use your own general knowledge to fill gaps.
- Polish the answer: make it clear, well-structured, and professional.
- Then generate exactly 3 relevant follow-up questions the user might ask next.
- Indicate whether you used outside knowledge beyond the provided context.
- Do not fabricate information. If unsure, state that the answer is based on limited context.
- Only add related page numbers in the "page_refs" field. Do not add page numbers that are not directly relevant to the answer.


Respond ONLY in this JSON format, no markdown, no extra text:
{{
  "answer": "...",
  "follow_ups": ["...", "...", "..."],
  "web_grounded": true or false
}}
"""
    else:
        prompt = f"""You are DocQuery, an AI assistant that answers questions about a PDF document.

Context extracted from the document (with page numbers):
{context}

User question: {query}

Instructions:
- Answer the question using ONLY the context above.
- Do not use outside knowledge.
- Keep the answer concise and factual.
- Then generate exactly 3 relevant follow-up questions the user might ask next.
- Only add related page numbers in the "page_refs" field. Do not add page numbers that are not directly relevant to the answer.

Respond ONLY in this JSON format, no markdown, no extra text:
{{
  "answer": "...",
  "follow_ups": ["...", "...", "..."],
  "web_grounded": false
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {"answer": raw, "follow_ups": [], "web_grounded": False}

    page_refs = [f"Page {p}" for p in pages_used]

    return {
        "answer": parsed.get("answer", ""),
        "page_refs": page_refs,
        "follow_ups": parsed.get("follow_ups", []),
        "web_grounded": parsed.get("web_grounded", False),
    }