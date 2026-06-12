import { Upload, FileText } from "lucide-react";

export default function Sidebar({ document, onFileSelect, onDocumentReady }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <aside className="w-[280px] flex flex-col gap-4 p-4 bg-[#fafaf9] dark:bg-[#14141c] border-r border-[#e5e5e3] dark:border-[#2a2438]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-1 pt-1">
        <span className="w-2 h-2 rounded-full bg-accent dark:bg-accent-dark" />
        <span className="text-[15px] font-medium">DocQuery</span>
      </div>

      {/* Upload section */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a8a85] dark:text-[#6b6485] px-1">
          Upload
        </p>

        <label className="flex flex-col items-center gap-2 border border-dashed border-[#d8d6cf] dark:border-[#3a2a4a] rounded-xl py-6 px-3 cursor-pointer hover:border-accent dark:hover:border-accent-dark transition-colors">
          <input type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
          <div className="w-9 h-9 rounded-lg bg-[#EEEDFE] dark:bg-[#1f1a35] flex items-center justify-center">
            <Upload size={18} className="text-accent dark:text-accent-dark" />
          </div>
          <p className="text-[13px] font-medium text-center">
            Drop a PDF here or click to browse
          </p>
          <span className="text-[11px] text-[#8a8a85] dark:text-[#6b6485]">
            Max 50MB · PDF only
          </span>
        </label>

        <button className="text-[13px] font-medium text-accent dark:text-accent-dark border border-[#e5e5e3] dark:border-[#2a2438] rounded-lg py-2 hover:bg-[#f5f5f3] dark:hover:bg-[#1a1a24] transition-colors">
          Load demo document
        </button>
      </div>

      {/* Active document */}
      {document && (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a8a85] dark:text-[#6b6485] px-1">
            Active document
          </p>
          <div className="flex items-center gap-3 bg-white dark:bg-[#1a1626] border border-[#e5e5e3] dark:border-[#2a2438] rounded-lg p-3">
            <div className="w-9 h-9 rounded-lg bg-accent dark:bg-accent-dark flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{document.name}</p>
              <span className="text-[12px] text-[#8a8a85] dark:text-[#6b6485]">
                {document.pages} pages
              </span>
            </div>
            {document.status === "ready" ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e3f5e8] text-[#2f9e5b] dark:bg-[#173a26] dark:text-[#5fd98a]">
                Ready
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fdf0dc] text-[#b9740a] dark:bg-[#3a2a0e] dark:text-[#f0b04a]">
                Processing
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[#e5e5e3] dark:border-[#2a2438]">
        <p className="text-[11px] text-[#8a8a85] dark:text-[#6b6485]">
          Model: Claude Sonnet · RAG + web grounding
        </p>
      </div>
    </aside>
  );
}