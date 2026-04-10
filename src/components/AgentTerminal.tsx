"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ScrollLogs from "@/components/ScrollLogs";

const ParticleMesh = dynamic(() => import("@/components/ParticleMesh"), {
  ssr: false,
});

interface TerminalLine {
  text: string;
  type: "command" | "progress" | "result";
  highlight?: boolean;
}

export default function AgentTerminal({
  resultType,
  onComplete,
}: {
  resultType: 1 | 2;
  onComplete: () => void;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);

  const lines: TerminalLine[] = [
    { text: "> 응답 데이터 수집 완료 (10/10)", type: "command" },
    { text: "> 데이터 수집 환경 분석 중... ████████░░ 완료", type: "progress" },
    { text: "> 분석 도구 활용도 평가 중... ████████░░ 완료", type: "progress" },
    { text: "> 마케팅 캠페인 역량 분석 중... ████████░░ 완료", type: "progress" },
    { text: "> AI 활용 준비도 진단 중... ████████░░ 완료", type: "progress" },
    { text: "> ", type: "command" },
    { text: "> 종합 점수 산출 중...", type: "command" },
    {
      text: `> 최적 유형 매칭: [유형${resultType} ${resultType === 1 ? "Starter" : "Growth"}] ✓`,
      type: "result",
      highlight: true,
    },
  ];

  useEffect(() => {
    if (visibleLines >= lines.length) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }

    const currentLine = lines[visibleLines];
    if (!currentLine) return;

    if (typingIndex < currentLine.text.length) {
      const speed = currentLine.type === "result" ? 30 : 15;
      const timer = setTimeout(() => setTypingIndex((i) => i + 1), speed);
      return () => clearTimeout(timer);
    }

    const delay = currentLine.text.trim() === ">" ? 200 : 400;
    const timer = setTimeout(() => {
      setVisibleLines((l) => l + 1);
      setTypingIndex(0);
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleLines, typingIndex, lines.length, onComplete]);

  const progressPct = ((visibleLines + 1) / lines.length) * 100;

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white font-[Pretendard,sans-serif] overflow-hidden"
      style={{ cursor: "crosshair" }}
    >
      <ParticleMesh />

      {/* Viewport frame */}
      <div className="fixed inset-5 border border-white/15 z-10 pointer-events-none">
        <div className="absolute -top-px -left-px w-5 h-5 border-l border-t border-[#4f8ef7]" />
        <div className="absolute -bottom-px -right-px w-5 h-5 border-r border-b border-[#4f8ef7]" />
      </div>

      {/* Logo */}
      <div className="fixed top-7 left-7 md:top-9 md:left-9 z-[60]">
        <img src="/kto-logo.png" alt="한국관광공사" className="h-12 md:h-14 w-auto opacity-90" />
      </div>

      {/* System label */}
      <div className="fixed bottom-9 right-9 z-[11] hidden md:flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/30">POWERED BY</span>
        <a href="https://osoma.kr/?utm_source=kto_test&utm_medium=typetest&utm_campaign=2026_data_ai&utm_content=powered_by&utm_term=logo" target="_blank" rel="noopener noreferrer" className="pointer-events-auto" style={{ cursor: "pointer" }}><img src="/osoma-logo.svg" alt="오픈소스마케팅" className="h-4 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" /></a>
      </div>

      {/* Centered content — no window chrome */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 md:px-20">
        {/* Step label */}
        <div className="font-mono text-[#4f8ef7] text-sm tracking-[4px] mb-5">
          ANALYZING
        </div>

        {/* Progress bar */}
        <div className="w-[200px] h-[2px] bg-white/15 mb-10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#4f8ef7]"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 10px #4f8ef7",
              transition: "width 0.4s ease-out",
            }}
          />
        </div>

        {/* Terminal lines — raw, no window frame */}
        <div className="w-full max-w-[700px] font-mono text-sm md:text-base leading-loose">
          {lines.slice(0, visibleLines + 1).map((line, i) => {
            const isCurrentLine = i === visibleLines;
            const displayText = isCurrentLine
              ? line.text.slice(0, typingIndex)
              : line.text;

            return (
              <div
                key={i}
                className={`
                  ${line.highlight ? "text-[#4f8ef7] font-bold text-lg md:text-xl" : ""}
                  ${!line.highlight && !isCurrentLine ? "text-white font-semibold" : ""}
                  ${!line.highlight && isCurrentLine && line.type === "command" ? "text-white/80" : ""}
                  ${!line.highlight && isCurrentLine && line.type === "progress" ? "text-white/45" : ""}
                  ${i > 0 ? "mt-2" : ""}
                `}
              >
                {displayText}
                {isCurrentLine && typingIndex < line.text.length && (
                  <span className="animate-blink text-[#4f8ef7]">▌</span>
                )}
              </div>
            );
          })}

          {visibleLines >= lines.length && (
            <div className="mt-6 text-white/30 text-xs animate-fade-in font-mono tracking-[1px]">
              결과 페이지로 이동합니다...
            </div>
          )}
        </div>
      </div>

      <ScrollLogs />
    </div>
  );
}
