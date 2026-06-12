import { useEffect, useState } from "react";
import { LayoutGrid, Check } from "lucide-react";

const steps = [
  "Extract text & structure",
  "Chunk into segments",
  "Generate embeddings",
  "Build vector index",
];

export default function ProcessingState({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  const completedSteps = Math.floor((progress / 100) * steps.length);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 px-6">
      <div className="w-14 h-14 rounded-xl bg-[#EEEDFE] dark:bg-[#1f1a35] flex items-center justify-center mb-2">
        <LayoutGrid size={24} className="text-accent dark:text-accent-dark" />
      </div>
      <h2 className="text-[18px] font-medium">
        Embedding document... {progress}%
      </h2>
      <p className="text-[14px] text-[#8a8a85] dark:text-[#6b6485]">
        Chunking, vectorizing, and indexing your PDF
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-2">
        <div className="h-1 w-full bg-[#e5e5e3] dark:bg-[#2a2438] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent dark:bg-accent-dark rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[12px] text-[#8a8a85] dark:text-[#6b6485]">
          <span>Parsing pages...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2 mt-4">
        {steps.map((step, i) => {
          const done = i < completedSteps;
          return (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                  done
                    ? "bg-accent dark:bg-accent-dark border-accent dark:border-accent-dark"
                    : "border-[#d8d6cf] dark:border-[#3a2a4a]"
                }`}
              >
                {done && <Check size={11} className="text-white" />}
              </span>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  done
                    ? "text-accent dark:text-accent-dark"
                    : "text-[#8a8a85] dark:text-[#6b6485]"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}