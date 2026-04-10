"use client";

export default function QuizProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 -mx-5 px-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">
          {current + 1} / {total}
        </span>
        <span className="text-xs text-gray-400">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3f78e0] to-[#45c4a0] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
