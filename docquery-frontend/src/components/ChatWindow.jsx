import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, onChipClick, loadingAnswer }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingAnswer]);

  return (
    <div className="h-full overflow-y-auto px-6 py-6 flex flex-col gap-5">
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} onChipClick={onChipClick} />
      ))}

      {loadingAnswer && (
        <div className="flex flex-col gap-2 max-w-[85%]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8a8a85] dark:text-[#9d8fc7]">
            <Sparkles size={13} className="text-accent dark:text-accent-dark animate-pulse" />
            DocQuery AI
          </div>
          <div className="bg-[#fafaf9] dark:bg-[#1c1c28] border border-[#e5e5e3] dark:border-[#2a2438] rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a85] dark:bg-[#9d8fc7] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a85] dark:bg-[#9d8fc7] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a85] dark:bg-[#9d8fc7] animate-bounce" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}