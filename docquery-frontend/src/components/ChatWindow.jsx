import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, onChipClick }) {
  return (
    <div className="h-full overflow-y-auto px-6 py-6 flex flex-col gap-5">
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} onChipClick={onChipClick} />
      ))}
    </div>
  );
}