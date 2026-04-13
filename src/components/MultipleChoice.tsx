"use client";

import { QuizNode } from "@/data/questions";

const stageLabels = ["1", "2", "3", "4"];

export default function MultipleChoice({
  node,
  selected,
  onSelect,
}: {
  node: QuizNode;
  selected: number | null;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {node.options.map((opt, idx) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={idx}
            onClick={() => onSelect(opt.value)}
            className={`
              w-full min-h-14 px-4 py-3 rounded-xl text-left text-[15px] leading-snug
              transition-all duration-200 flex items-center gap-3
              ${
                isSelected
                  ? "bg-[#00cc33] text-white shadow-lg shadow-green-400/30"
                  : "bg-white text-gray-700 border border-gray-200 active:scale-[0.98]"
              }
            `}
          >
            <span
              className={`
                shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold
                ${isSelected ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"}
              `}
            >
              {stageLabels[idx] ?? idx + 1}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
