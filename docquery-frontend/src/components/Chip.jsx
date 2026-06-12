export default function Chip({ children, onClick, variant = "default" }) {
  const variants = {
    default:
      "border border-[#e5e5e3] dark:border-[#2a2438] text-[#1a1a1a] dark:text-[#cfc8e8] hover:bg-[#f5f5f3] dark:hover:bg-[#1a1626]",
    pageRef:
      "bg-[#EEEDFE] dark:bg-[#1f1a35] text-accent dark:text-accent-dark font-medium",
  };

  return (
    <button
      onClick={onClick}
      className={`text-[12px] px-3 py-1.5 rounded-full transition-colors ${variants[variant]}`}
    >
      {children}
    </button>
  );
}