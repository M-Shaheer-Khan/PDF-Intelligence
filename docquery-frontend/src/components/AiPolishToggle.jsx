import { Sparkles } from "lucide-react";

export default function AiPolishToggle({ aiPolishing, setAiPolishing }) {
  return (
    <button
      onClick={() => setAiPolishing(!aiPolishing)}
      className={`flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full border transition-colors
        ${
          aiPolishing
            ? "bg-[#1f1a35] border-[#3a2a4a] text-accent-dark"
            : "bg-[#EEEDFE] border-[#d8d6cf] text-accent hover:bg-[#e3e1fb]"
        }`}
    >
      <Sparkles size={14} />
      {aiPolishing ? "AI polishing on" : "Enable AI polishing"}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          aiPolishing ? "bg-accent-dark" : "bg-accent"
        }`}
      />
    </button>
  );
}