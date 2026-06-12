import { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function InputBar({ disabled, onSend }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex items-center gap-3 px-6 py-4 border-t border-[#e5e5e3] dark:border-[#2a2438]">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={
          disabled ? "Upload a document to get started..." : "Ask a question about your PDF..."
        }
        className="flex-1 text-[13px] px-4 py-2.5 rounded-lg bg-[#fafaf9] dark:bg-[#1c1c28] border border-[#e5e5e3] dark:border-[#3a2a4a] outline-none focus:border-accent dark:focus:border-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-9 h-9 rounded-lg bg-accent dark:bg-accent-dark flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        <ArrowUp size={16} />
      </button>
    </div>
  );
}