import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ||  "http://localhost:8000";

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { doc_id, filename, total_pages, total_chunks }
};

export const queryDocument = async (docId, question, aiPolishing) => {
  const res = await axios.post(`${API_BASE}/query`, {
    doc_id: docId,
    question,
    ai_polishing: aiPolishing,
  });
  return res.data; // { answer, page_refs, follow_ups, web_grounded }
};