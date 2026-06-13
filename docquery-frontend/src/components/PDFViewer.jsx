import { Document, Page } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PDFViewer({ file, pageNumber, setPageNumber, numPages, setNumPages }) {
  return (
    <div className="w-[340px] flex flex-col border-l border-[#e5e5e3] dark:border-[#2a2438] bg-[#fafaf9] dark:bg-[#14141c]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e3] dark:border-[#2a2438]">
        <span className="text-[13px] font-medium">Document preview</span>
        {numPages && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-[#f0f0ee] dark:hover:bg-[#1a1626] disabled:opacity-30"
              disabled={pageNumber <= 1}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] text-[#8a8a85] dark:text-[#9d8fc7]">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              className="p-1 rounded hover:bg-[#f0f0ee] dark:hover:bg-[#1a1626] disabled:opacity-30"
              disabled={pageNumber >= numPages}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto flex justify-center p-4">
        {file ? (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<p className="text-[12px] text-[#8a8a85] mt-10">Loading PDF...</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={280}
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