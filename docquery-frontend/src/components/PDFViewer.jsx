import { Document, Page } from "react-pdf";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PDFViewer({ file, pageNumber, setPageNumber, numPages, setNumPages, onClose }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-white dark:bg-[#0a0a0f]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#e5e5e3] dark:border-[#2a2438]">
        <span className="text-[13px] font-medium">Document preview</span>
        <div className="flex items-center gap-3">
          {numPages && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-[#f5f5f3] dark:hover:bg-[#1a1626] disabled:opacity-30"
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[12px] text-[#8a8a85] dark:text-[#9d8fc7]">
                Page {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                className="p-1 rounded hover:bg-[#f5f5f3] dark:hover:bg-[#1a1626] disabled:opacity-30"
                disabled={pageNumber >= numPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f5f5f3] dark:hover:bg-[#1a1626]"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex justify-center items-start p-6">
        {file ? (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<p className="text-[12px] text-[#8a8a85] mt-10">Loading PDF...</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={Math.min(900, window.innerWidth - 380)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <p className="text-[12px] text-[#8a8a85] mt-10">No PDF loaded</p>
        )}
      </div>
    </div>
  );
}