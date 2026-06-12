import AiPolishToggle from "./AiPolishToggle";

export default function Header({ aiPolishing, setAiPolishing }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e3] dark:border-[#2a2438]">
      <p className="text-[15px] font-medium">Ask anything about your document</p>
      <AiPolishToggle aiPolishing={aiPolishing} setAiPolishing={setAiPolishing} />
    </header>
  );
}