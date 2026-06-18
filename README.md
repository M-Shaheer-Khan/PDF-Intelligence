# DocQuery — AI-Powered PDF Intelligence

A full-stack RAG application that lets users upload PDFs and ask natural language questions, with answers grounded in the document and cited by page number. An optional "AI Polishing" mode lets the assistant supplement answers with general knowledge, flagged as web-grounded.

## Features

- Upload a PDF and ask questions about its content in natural language
- Answers cite the exact page(s) they were drawn from
- Click a page citation to jump to that page in an in-app PDF viewer
- Auto-generated follow-up question suggestions
- "AI Polishing" toggle — lets the model use outside knowledge, with a distinct UI theme when active
- Chat and document history persisted to a database

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, react-pdf, Axios
**Backend:** FastAPI, PyMuPDF, LangChain, Sentence-Transformers, ChromaDB
**LLM:** Groq (Llama 3.3 70B)
**Database:** Supabase (PostgreSQL)
**Deployment:** Vercel (frontend), Render (backend)

## How It Works

1. PDF is parsed page-by-page with PyMuPDF
2. Text is chunked (LangChain) and embedded locally (`all-MiniLM-L6-v2`)
3. Chunks + page metadata are stored in ChromaDB
4. User question → similarity search retrieves top relevant chunks
5. Chunks + question sent to Llama 3.3 70B → returns answer, page refs, follow-ups
6. Q&A exchange saved to Supabase

## Running Locally

```bash
# Backend
cd docquery-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `docquery-backend/.env`:
```
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

```bash
python -m uvicorn main:app --reload
```

```bash
# Frontend
cd docquery-frontend
npm install
```

Create `docquery-frontend/.env.local`:
```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

## Future Improvements

- OCR support for scanned PDFs
- Multi-document querying
- User authentication
- Streaming responses
- Highlight exact retrieved passages on the PDF page