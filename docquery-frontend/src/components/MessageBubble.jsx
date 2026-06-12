import { Sparkles } from "lucide-react";
import Chip from "./Chip";

export default function MessageBubble({ message, onChipClick }) {
  const { role, text, pageRefs, followUps } = message;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-accent dark:bg-accent-dark text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-[13px]">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-[85%]">
      <div className="flex items-center gap-1.5 text-[11px] text-[#8a8a85] dark:text-[#9d8fc7]">
        <Sparkles size={13} className="text-accent dark:text-accent-dark" />
        DocQuery AI
      </div>
      <div className="bg-[#fafaf9] dark:bg-[#1c1c28] border border-[#e5e5e3] dark:border-[#2a2438] rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] leading-relaxed">
        {text}
      </div>
      {pageRefs?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {pageRefs.map((ref) => (
            <Chip key={ref} variant="pageRef" onClick={() => onChipClick?.(ref)}>
              {ref}
            </Chip>
          ))}
        </div>
      )}
      {followUps?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {followUps.map((q) => (
            <Chip key={q} onClick={() => onChipClick?.(q)}>
              {q}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}