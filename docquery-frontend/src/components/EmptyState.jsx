import { Sparkles } from "lucide-react";
import Chip from "./Chip";

const suggestions = [
  "Summarize key findings",
  "List all authors",
  "What's the methodology?",
];

export default function EmptyState({ onSuggestionClick }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 px-6">
      <div className="w-14 h-14 rounded-xl bg-[#EEEDFE] dark:bg-[#1f1a35] flex items-center justify-center mb-2">
        <Sparkles size={24} className="text-accent dark:text-accent-dark" />
      </div>
      <h2 className="text-[18px] font-medium">No document uploaded yet</h2>
      <p className="text-[14px] text-[#8a8a85] dark:text-[#6b6485] text-center max-w-sm">
        Upload a PDF in the sidebar to start asking questions about its contents.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {suggestions.map((s) => (
          <Chip key={s} onClick={() => onSuggestionClick(s)}>
            {s}
          </Chip>
        ))}
      </div>
    </div>
  );
}