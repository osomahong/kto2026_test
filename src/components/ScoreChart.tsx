"use client";

import { useState, useEffect } from "react";
import { DimensionScore } from "@/lib/types";

export default function ScoreChart({
  scores,
  dark = false,
}: {
  scores: DimensionScore[];
  dark?: boolean;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {scores.map((score, i) => {
        const pct = Math.round(score.raw * 100);
        const barColor =
          pct >= 60 ? "#00ff41" : pct >= 30 ? "#00ff41" : dark ? "#00ff41" : "#dde7f7";
        const barOpacity = pct >= 60 ? 1 : pct >= 30 ? 0.6 : 0.3;

        return (
          <div
            key={score.dimension}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-sm font-medium ${dark ? "text-white" : "text-gray-700"}`}
              >
                {score.label}
              </span>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: "#00ff41", opacity: barOpacity }}
              >
                {pct}%
              </span>
            </div>
            <div
              className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}
            >
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: barColor,
                  opacity: barOpacity,
                  width: animated ? `${pct}%` : "0%",
                  transition: `width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s`,
                }}
              />
            </div>
            <p
              className={`text-xs mt-1 ${dark ? "text-white/70" : "text-gray-400"}`}
            >
              {score.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}
