import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import ProcessingState from "./components/ProcessingState";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";

export default function App() {
  const [aiPolishing, setAiPolishing] = useState(false);
  const [document, setDocument] = useState(null); // null | {name, pages, status: 'processing'|'ready'}
  const [messages, setMessages] = useState([]);

  const handleFileSelect = (file) => {
    setDocument({ name: file.name, pages: 42, status: "processing" });
    // simulate: after processing finishes, set status to 'ready'
  };

  const handleDocumentReady = () => {
    setDocument((d) => (d ? { ...d, status: "ready" } : d));
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    // TODO: call backend /query endpoint, then push AI response
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  return (
    <div className={aiPolishing ? "dark" : ""}>
      <div className="flex h-screen w-full bg-white dark:bg-[#0a0a0f] text-[#1a1a1a] dark:text-[#f0eefc]">
        <Sidebar
          document={document}
          onFileSelect={handleFileSelect}
          onDocumentReady={handleDocumentReady}
        />
        <div className="flex flex-col flex-1">
          <Header aiPolishing={aiPolishing} setAiPolishing={setAiPolishing} />

          <div className="flex-1 overflow-y-auto relative">
            {!document && (
              <EmptyState onSuggestionClick={handleSuggestionClick} />
            )}
            {document?.status === "processing" && (
              <ProcessingState onComplete={handleDocumentReady} />
            )}
            {document?.status === "ready" && (
              <ChatWindow messages={messages} />
            )}
          </div>

          <InputBar
            disabled={!document || document.status !== "ready"}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}