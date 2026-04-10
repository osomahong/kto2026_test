"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { allNodes, startNodeId, getNextNodeId, dimensionLabels } from "@/data/questions";
import { calculateResult } from "@/lib/scoring";
import GizmoCursor from "@/components/GizmoCursor";
import ScrollLogs from "@/components/ScrollLogs";
import AgentTerminal from "@/components/AgentTerminal";

const ParticleMesh = dynamic(() => import("@/components/ParticleMesh"), {
  ssr: false,
});

const TOTAL_QUESTIONS = 10;

export default function QuizPage() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([startNodeId]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"quiz" | "analyzing">("quiz");
  const [slideKey, setSlideKey] = useState(0);
  const [selecting, setSelecting] = useState<number | null>(null);

  const currentNodeId = history[history.length - 1];
  const currentNode = allNodes[currentNodeId];
  const selected = currentNode ? (answers[currentNode.id] ?? null) : null;
  const questionNumber = history.length;

  const result = phase === "analyzing" ? calculateResult(answers) : null;

  const handleSelect = useCallback(
    (value: number) => {
      if (!currentNode || selecting !== null) return;
      setSelecting(value);

      const newAnswers = { ...answers, [currentNode.id]: value };
      setAnswers(newAnswers);

      const nextId = getNextNodeId(currentNode, value);

      setTimeout(() => {
        setSelecting(null);
        if (nextId && allNodes[nextId]) {
          setSlideKey((k) => k + 1);
          setHistory((h) => [...h, nextId]);
        } else {
          setPhase("analyzing");
        }
      }, 500);
    },
    [currentNode, answers, selecting]
  );

  const handleBack = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setSlideKey((k) => k + 1);
    setAnswers((prev) => {
      const validIds = new Set(newHistory);
      const next: Record<string, number> = {};
      for (const [id, val] of Object.entries(prev)) {
        if (validIds.has(id)) next[id] = val;
      }
      return next;
    });
  };

  const handleRestart = () => {
    sessionStorage.removeItem("quizResult");
    router.replace("/");
  };

  const handleAnalysisComplete = useCallback(() => {
    if (!result) return;
    sessionStorage.setItem("quizResult", JSON.stringify(result));
    router.push("/result");
  }, [result, router]);

  if (phase === "analyzing" && result) {
    return (
      <AgentTerminal
        resultType={result.recommendedType}
        onComplete={handleAnalysisComplete}
      />
    );
  }

  if (!currentNode) return null;

  const progressPct = (questionNumber / TOTAL_QUESTIONS) * 100;
  const isOX = currentNode.type === "ox";

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-black text-white font-[Pretendard,sans-serif]"
      style={{ cursor: "crosshair", position: "fixed", inset: 0 }}
    >
      <GizmoCursor />
      <ParticleMesh />

      {/* Viewport frame */}
      <div className="fixed inset-5 border border-white/15 z-10 pointer-events-none">
        <div className="absolute -top-px -left-px w-5 h-5 border-l border-t border-[#4f8ef7]" />
        <div className="absolute -bottom-px -right-px w-5 h-5 border-r border-b border-[#4f8ef7]" />
      </div>

      {/* Logo — click to go home */}
      <button onClick={handleRestart} className="fixed top-7 left-7 md:top-9 md:left-9 z-[30]" style={{ cursor: "pointer" }}>
        <img src="/kto-logo.png" alt="한국관광공사" className="h-12 md:h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
      </button>
      <div className="fixed bottom-9 right-9 z-[11] hidden md:flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/30">POWERED BY</span>
        <a href="https://osoma.kr/?utm_source=kto_test&utm_medium=typetest&utm_campaign=2026_data_ai&utm_content=powered_by&utm_term=logo" target="_blank" rel="noopener noreferrer" className="pointer-events-auto" style={{ cursor: "pointer" }}><img src="/osoma-logo.svg" alt="오픈소스마케팅" className="h-4 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" /></a>
      </div>

      {/* Navigation: mobile back only */}
      {history.length > 1 && (
        <div className="fixed top-7 right-7 z-30 md:hidden">
          <button
            onClick={handleBack}
            className="bg-white text-black font-mono text-[11px] uppercase tracking-[1.5px] px-4 py-2 active:bg-white/85 transition-colors"
            style={{ cursor: "pointer" }}
          >
            ← BACK
          </button>
        </div>
      )}

      {/* Main question layout */}
      <main className="relative z-20 flex flex-col justify-center items-center h-full px-6 md:px-20 text-center">
        {/* Step indicator */}
        <div className="font-mono text-[#4f8ef7] text-sm tracking-[4px] mb-5">
          QUESTION {String(questionNumber).padStart(2, "0")}
        </div>

        {/* Progress bar */}
        <div className="w-[240px] h-[2px] bg-white/15 mb-5 relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#4f8ef7] transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%`, boxShadow: "0 0 10px #4f8ef7" }}
          />
        </div>

        {/* Section label */}
        <div className="font-mono text-[10px] text-white/30 uppercase tracking-[2px] mb-8">
          {dimensionLabels[currentNode.dimension]}
        </div>

        {/* Question text */}
        <h1
          key={`text-${slideKey}`}
          className="text-xl md:text-[2.5rem] font-bold leading-[1.3] mb-10 md:mb-14 max-w-[800px] break-keep animate-fade-in"
        >
          {currentNode.text}
        </h1>

        {/* Options */}
        <div
          key={`opts-${slideKey}`}
          className={`w-full max-w-[900px] animate-fade-in ${
            isOX
              ? "grid grid-cols-2 gap-4 md:gap-5"
              : "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5"
          }`}
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          {currentNode.options.map((opt, idx) => {
            const isSelected = selecting === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt.value)}
                disabled={selecting !== null}
                className={`
                  text-left p-5 md:p-[30px] border transition-all duration-300 relative group backdrop-blur-md
                  ${
                    isSelected
                      ? "border-[#4f8ef7] bg-[rgba(79,142,247,0.15)] -translate-y-1"
                      : "border-white/20 bg-white/[0.08] hover:border-[#4f8ef7] hover:bg-[rgba(79,142,247,0.12)] hover:-translate-y-1"
                  }
                `}
                style={{ cursor: "pointer" }}
              >
                <span className="font-mono text-[#4f8ef7] text-base font-bold block mb-2 tracking-[1px]">
                  {isOX
                    ? idx === 0 ? "YES" : "NO"
                    : `${String.fromCharCode(65 + idx)}.`}
                </span>
                <div className="text-sm md:text-[1.1rem] leading-relaxed text-white/90">
                  {opt.label}
                </div>
                {/* Selection flash */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-[#4f8ef7] animate-fade-in" style={{ boxShadow: "0 0 20px rgba(79,142,247,0.2)" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6 mt-10">
          {history.length > 1 && (
            <button
              onClick={handleBack}
              className="font-mono text-sm uppercase tracking-[2px] text-white border border-white/30 px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all"
              style={{ cursor: "pointer" }}
            >
              ← PREVIOUS
            </button>
          )}
        </div>
      </main>

      {/* Data sidebar (desktop only) */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-[30px] z-[25] pointer-events-none hidden lg:flex">
        <div className="border-l border-white/15 pl-4">
          <div className="font-mono text-[10px] text-white/40 mb-2">SECTION</div>
          <div className="font-mono text-lg text-white">
            {String(currentNode.section).padStart(2, "0")} / 04
          </div>
        </div>
        <div className="border-l border-white/15 pl-4">
          <div className="font-mono text-[10px] text-white/40 mb-2">PROGRESS</div>
          <div className="font-mono text-lg text-white">{Math.round(progressPct)}%</div>
          <div className="grid grid-cols-[repeat(10,6px)] gap-1 mt-2.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 ${i < questionNumber ? "bg-[#4f8ef7]" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
        <div className="border-l border-white/15 pl-4">
          <div className="font-mono text-[10px] text-white/40 mb-2">TYPE</div>
          <div className="font-mono text-lg text-white">
            {currentNode.type === "ox" ? "BINARY" : "SELECT"}
          </div>
        </div>
      </div>

      <ScrollLogs />
    </div>
  );
}
