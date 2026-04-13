"use client";

import { QuizNode } from "@/data/questions";

export default function OXQuestion({
  node,
  selected,
  onSelect,
}: {
  node: QuizNode;
  selected: number | null;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="flex gap-3">
      {node.options.map((opt) => {
        const isSelected = selected === opt.value;
        const isEmpathy = opt.label === "공감한다";
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`
              flex-1 min-h-14 rounded-xl font-medium text-[15px]
              transition-all duration-200
              ${
                isSelected
                  ? isEmpathy
                    ? "bg-[#00cc33] text-white shadow-lg shadow-green-400/30"
                    : "bg-[#45c4a0] text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-700 border border-gray-200 active:scale-[0.97]"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
