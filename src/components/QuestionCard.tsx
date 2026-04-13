"use client";

import { QuizNode, dimensionLabels } from "@/data/questions";
import AreaIcon from "@/components/svg/AreaIcons";
import OXQuestion from "@/components/OXQuestion";
import MultipleChoice from "@/components/MultipleChoice";

export default function QuestionCard({
  node,
  selected,
  onSelect,
  animKey,
}: {
  node: QuizNode;
  selected: number | null;
  onSelect: (value: number) => void;
  animKey: string;
}) {
  return (
    <div key={animKey} className="animate-slide-in">
      {/* Area icon + label */}
      <div className="flex items-center gap-2 mb-4">
        <AreaIcon dimension={node.dimension} />
        <span className="text-sm font-medium text-[#00cc33]">
          {dimensionLabels[node.dimension]}
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-[18px] font-semibold text-gray-900 leading-relaxed mb-8">
        {node.text}
      </h2>

      {/* Answer input */}
      {node.type === "ox" && (
        <OXQuestion node={node} selected={selected} onSelect={onSelect} />
      )}
      {node.type === "multiple" && (
        <MultipleChoice node={node} selected={selected} onSelect={onSelect} />
      )}
    </div>
  );
}
