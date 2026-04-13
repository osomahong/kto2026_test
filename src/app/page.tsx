"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import GizmoCursor from "@/components/GizmoCursor";

const ParticleMesh = dynamic(() => import("@/components/ParticleMesh"), {
  ssr: false,
});

export default function IntroPage() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [meshAnim, setMeshAnim] = useState<"idle" | "suck-in" | "expand-out">("expand-out");

  const handleStart = useCallback(() => {
    if (transitioning) return;
    sessionStorage.removeItem("quizResult");
    setTransitioning(true);
    setMeshAnim("suck-in");
  }, [transitioning]);

  const handleMeshAnimDone = useCallback((phase: "suck-in" | "expand-out") => {
    if (phase === "suck-in") {
      router.push("/quiz");
    } else if (phase === "expand-out") {
      setMeshAnim("idle");
    }
  }, [router]);

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-black text-white font-[Pretendard,sans-serif]"
      style={{ cursor: "crosshair", position: "fixed", inset: 0 }}
    >
      {/* Transition overlay */}
      <div
        className="fixed inset-0 z-[200] bg-black pointer-events-none transition-opacity duration-700"
        style={{ opacity: transitioning ? 1 : 0 }}
      />

      {/* Scanline */}
      <div
        className="fixed top-0 left-0 w-full h-[2px] z-50"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,255,65,0.3), transparent)",
          animation: "scan 4s linear infinite",
        }}
      />

      <GizmoCursor />

      {/* Viewport frame */}
      <div className="fixed inset-5 border border-white/15 z-10 pointer-events-none">
        <div className="absolute -top-px -left-px w-5 h-5 border-l border-t border-[#00ff41]" />
        <div className="absolute -bottom-px -right-px w-5 h-5 border-r border-b border-[#00ff41]" />
      </div>

      {/* Header row — mobile only */}
      <div className="relative z-[30] px-7 pt-7 pb-2 md:hidden">
        <img src="/kto-logo.png" alt="한국관광공사" className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity" />
      </div>
      {/* Logo — desktop fixed */}
      <div className="hidden md:block fixed top-9 left-9 z-[11]">
        <img src="/kto-logo.png" alt="한국관광공사" className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
      </div>
      <div className="fixed bottom-9 right-9 z-[11] hidden md:flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/30">POWERED BY</span>
        <a href="https://osoma.kr/?utm_source=kto_test&utm_medium=typetest&utm_campaign=2026_data_ai&utm_content=powered_by&utm_term=logo" target="_blank" rel="noopener noreferrer" className="pointer-events-auto" style={{ cursor: "pointer" }}><img src="/osoma-logo.svg" alt="오픈소스마케팅" className="h-4 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" /></a>
      </div>

      <ParticleMesh animationState={meshAnim} onAnimationComplete={handleMeshAnimDone} />

      {/* Hero content */}
      <main
        className="relative z-20 flex items-start pt-16 md:items-center md:pt-0 h-screen px-8 md:px-[10%] transition-all duration-700"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(-30px)" : "translateY(0)",
        }}
      >
        <section className="max-w-[600px] md:scale-105 md:origin-left">
          {/* Kicker */}
          <div className="font-mono text-[#00ff41] text-xs mb-4 flex items-center gap-2.5 text-glow">
            <span className="w-[30px] h-px bg-[#00ff41] inline-block" />
            DATA AI Programs
          </div>

          {/* Title */}
          <h1 className="text-[1.5rem] shorth:text-xl md:text-[4.5rem] font-extrabold leading-[1.1] tracking-[-0.04em] mb-6 shorth:mb-4">
            <span className="text-glow">우리 기업에 맞는</span>
            <br />
            <span className="inline-block bg-[rgba(0,255,65,0.45)] px-3 py-1 -mx-3 whitespace-nowrap">DATA·AI 지원사업</span>
            <br />
            <span className="text-glow">유형 확인하기</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 shorth:mb-6 max-w-[460px] break-keep text-glow">
            우리 회사의 데이터·AI 역량을 진단하고
            <br />
            필요한 지원 유형을 확인합니다.
          </p>

          {/* Action */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleStart}
              disabled={transitioning}
              className="group bg-[#00ff41] text-black px-10 md:px-12 py-5 shorth:py-4 md:py-[22px] font-mono uppercase text-base font-bold tracking-[1px] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:shadow-none disabled:hover:translate-y-0 pointer-events-auto"
              style={{ cursor: "pointer" }}
            >
              <span className="relative">진단 프로세스 시작하기</span>
            </button>
          </div>
        </section>
      </main>

      {/* Right side: data sidebar + decorative elements (desktop only) */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 flex-col gap-[50px] z-[25] pointer-events-none hidden lg:flex">
        <div className="border-l-2 border-white/15 pl-6">
          <div className="font-mono text-xs text-white/40 mb-3 tracking-[2px]">
            TOTAL_SUPPORT
          </div>
          <div className="font-mono text-3xl text-white">
            27<span className="text-lg text-white/50 ml-1">개사</span>
          </div>
          <div className="grid grid-cols-[repeat(10,8px)] gap-1.5 mt-3">
            {[1, 1, 1, 0, 1, 1, 0, 1, 1, 1].map((active, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${active ? "bg-[#00ff41]" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
        <div className="border-l-2 border-white/15 pl-6">
          <div className="font-mono text-xs text-white/40 mb-3 tracking-[2px]">
            AI_SUBSCRIPTION
          </div>
          <div className="font-mono text-3xl text-white">
            100<span className="text-lg text-white/50 ml-1">만원</span>
          </div>
          <div className="grid grid-cols-[repeat(10,8px)] gap-1.5 mt-3">
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((active, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${active ? "bg-[#00ff41]" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
        <div className="border-l-2 border-[#00ff41] pl-6 deadline-glow">
          <div className="font-mono text-xs text-[#00ff41] mb-3 tracking-[2px]">
            DEADLINE
          </div>
          <div className="font-mono text-3xl text-white deadline-glow-text">
            5/21<span className="text-lg text-white/70 ml-1">(목)</span>
          </div>
        </div>
      </div>

      {/* Decorative grid overlay (desktop only) */}
      <div className="fixed inset-0 z-[2] pointer-events-none hidden lg:block" style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      {/* Floating domain markers (desktop only) — slow glow pulse */}
      <div className="fixed z-[12] pointer-events-none hidden xl:block">
        <div className="fixed top-[15%] right-[12%] flex items-center gap-2 marker-pulse-1">
          <div className="w-2 h-2 border border-white/60 rotate-45" />
          <span className="font-mono text-[9px] text-white">GA4_EVENT_STREAM</span>
        </div>
        <div className="fixed top-[22%] right-[28%] flex items-center gap-2 marker-pulse-2">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <span className="font-mono text-[9px] text-white">GTM_CONTAINER</span>
        </div>
        <div className="fixed top-[18%] left-[52%] flex items-center gap-2 marker-pulse-3">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="font-mono text-[9px] text-white">LOOKER_STUDIO</span>
        </div>

        <div className="fixed top-[38%] right-[15%] flex items-center gap-2 marker-pulse-4">
          <div className="w-2 h-2 border border-white/50 rotate-45" />
          <span className="font-mono text-[9px] text-white">BIGQUERY_SYNC</span>
        </div>
        <div className="fixed top-[45%] right-[35%] flex items-center gap-2 marker-pulse-5">
          <div className="w-[20px] h-px bg-white/40" />
          <span className="font-mono text-[9px] text-white">KPI_DASHBOARD</span>
          <div className="w-[20px] h-px bg-white/40" />
        </div>

        <div className="fixed top-[55%] right-[18%] flex items-center gap-2 marker-pulse-6">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <span className="font-mono text-[9px] text-white">AB_TEST_ENGINE</span>
        </div>
        <div className="fixed top-[62%] right-[30%] flex items-center gap-2 marker-pulse-7">
          <div className="w-2 h-2 border border-white/50 rotate-45" />
          <span className="font-mono text-[9px] text-white">ROAS_OPTIMIZER</span>
        </div>
        <div className="fixed top-[58%] left-[48%] flex items-center gap-2 marker-pulse-8">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="font-mono text-[9px] text-white">GROWTH_HACKING</span>
        </div>

        <div className="fixed bottom-[28%] right-[22%] flex items-center gap-2 marker-pulse-9">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <span className="font-mono text-[9px] text-white">AI_AGENT_v2</span>
        </div>
        <div className="fixed bottom-[20%] left-[55%] flex items-center gap-2 marker-pulse-10">
          <div className="w-[20px] h-px bg-white/40" />
          <span className="font-mono text-[9px] text-white">LTV_PREDICTOR</span>
          <div className="w-[20px] h-px bg-white/40" />
        </div>
        <div className="fixed bottom-[35%] right-[10%] flex items-center gap-2 marker-pulse-11">
          <div className="w-2 h-2 border border-white/50 rotate-45" />
          <span className="font-mono text-[9px] text-white">CAMPAIGN_BUDGET</span>
        </div>
        <div className="fixed bottom-[15%] right-[35%] flex items-center gap-2 marker-pulse-12">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="font-mono text-[9px] text-white">DATA_PIPELINE</span>
        </div>
      </div>

      {/* Circular orbit ring (desktop only) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none hidden lg:block">
        <svg width="700" height="700" viewBox="0 0 700 700" className="opacity-100">
          <circle cx="350" cy="350" r="280" fill="none" stroke="rgba(0,255,65,0.12)" strokeWidth="1" strokeDasharray="8 12" >
            <animateTransform attributeName="transform" type="rotate" from="0 350 350" to="360 350 350" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="350" r="340" fill="none" stroke="rgba(0,255,65,0.06)" strokeWidth="1" strokeDasharray="4 20" >
            <animateTransform attributeName="transform" type="rotate" from="360 350 350" to="0 350 350" dur="90s" repeatCount="indefinite" />
          </circle>
          {/* Orbiting dot */}
          <circle r="3" fill="rgba(0,255,65,0.5)">
            <animateMotion dur="60s" repeatCount="indefinite" path="M350,70 A280,280 0 1,1 349.9,70" />
          </circle>
        </svg>
      </div>



      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}
