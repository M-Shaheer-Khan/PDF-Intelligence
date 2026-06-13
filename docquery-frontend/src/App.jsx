import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import ProcessingState from "./components/ProcessingState";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import PDFViewer from "./components/PDFViewer";
import { uploadPDF, queryDocument } from "./api";

export default function App() {
  const [aiPolishing, setAiPolishing] = useState(false);
  const [document, setDocument] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleFileSelect = async (file) => {
    setPdfFile(file);
    setPageNumber(1);
    setPreviewOpen(false);
    setDocument({ name: file.name, pages: "...", status: "processing" });
    try {
      const data = await uploadPDF(file);
      setDocument({
        name: data.filename,
        pages: data.total_pages,
        docId: data.doc_id,
        status: "processing",
      });
    } catch (err) {
      console.error(err);
      setDocument(null);
      setPdfFile(null);
      alert("Upload failed. Check backend is running.");
    }
  };

  const handleDocumentReady = () => {
    setDocument((d) => (d ? { ...d, status: "ready" } : d));
  };

  const handleSend = async (text) => {
    if (!text.trim() || !document?.docId) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setLoadingAnswer(true);
    try {
      const data = await queryDocument(document.docId, text, aiPolishing);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.answer,
          pageRefs: data.page_refs,
          followUps: data.follow_ups,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handlePageRefClick = (pageNum) => {
    if (pageNum && pageNum >= 1) {
      setPageNumber(pageNum);
      setPreviewOpen(true);
    }
  };

  return (
    <div className={aiPolishing ? "dark" : ""}>
      <div className="flex h-screen w-full bg-white dark:bg-[#0a0a0f] text-[#1a1a1a] dark:text-[#f0eefc]">
        <Sidebar document={document} onFileSelect={handleFileSelect} />

        <div className="flex flex-col flex-1 relative">
          <Header aiPolishing={aiPolishing} setAiPolishing={setAiPolishing} />

          <div className="flex-1 overflow-y-auto relative">
            {!document && <EmptyState onSuggestionClick={handleSend} />}
            {document?.status === "processing" && (
              <ProcessingState onComplete={handleDocumentReady} />
            )}
            {document?.status === "ready" && (
              <ChatWindow
                messages={messages}
                onChipClick={handleSend}
                onPageRefClick={handlePageRefClick}
                loadingAnswer={loadingAnswer}
              />
            )}
          </div>

          <InputBar
            disabled={!document || document.status !== "ready" || loadingAnswer}
            onSend={handleSend}
          />

          {previewOpen && (
            <PDFViewer
              file={pdfFile}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              numPages={numPages}
              setNumPages={setNumPages}
              onClose={() => setPreviewOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}