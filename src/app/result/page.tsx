"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { QuizResult } from "@/lib/types";

const ParticleMesh = dynamic(() => import("@/components/ParticleMesh"), {
  ssr: false,
});

const type1 = {
  number: 1,
  name: "AI 기반 데이터 분석 환경 구축 및 활용",
  highlights: [
    "AI 기반 데이터 분석 환경 구축",
    "시각화 대시보드 제공",
    "AI 활용 역량 내재화 지원",
  ],
};

const type2 = {
  number: 2,
  name: "AI 기반 데이터 마케팅 컨설팅(그로스 해킹)",
  highlights: [
    "데이터 기반 마케팅 컨설팅",
    "마케팅 캠페인 실행 및 광고비 지원",
    "AI 활용 역량 내재화 지원",
  ],
};

const APPLICATION_DEADLINE = "2026년 5월 20일(수) 18:00";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [meshAnim, setMeshAnim] = useState<"idle" | "suck-in" | "expand-out">("expand-out");
  const [restarting, setRestarting] = useState(false);
  const [showStickyCtaVisible, setShowStickyCtaVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    const name = sessionStorage.getItem("companyName") || "";
    if (!stored) {
      router.replace("/");
      return;
    }
    const parsed: QuizResult = JSON.parse(stored);
    setResult(parsed);
    setCompanyName(name);

    if (pushedRef.current) return;
    pushedRef.current = true;

    const typeName = parsed.recommendedType === 1 ? type1.name : type2.name;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "type_recommended",
      recommended_type: parsed.recommendedType,
      recommended_type_name: typeName,
    });
  }, [router]);

  const handleRestart = () => {
    if (restarting) return;
    setRestarting(true);
    sessionStorage.removeItem("quizResult");
    setMeshAnim("suck-in");
  };

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCtaVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [result]);

  const handleMeshAnimDone = useCallback((phase: "suck-in" | "expand-out") => {
    if (phase === "suck-in") {
      router.replace("/");
    } else if (phase === "expand-out") {
      setMeshAnim("idle");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="font-mono text-[#00ff41] text-sm">Loading results...</div>
      </div>
    );
  }

  const content = result.recommendedType === 1 ? type1 : type2;

  return (
    <div
      className="relative w-full min-h-[100dvh] bg-black text-white font-[Pretendard,sans-serif] overflow-x-hidden"
      style={{ cursor: "crosshair" }}
    >
      <ParticleMesh animationState={meshAnim} onAnimationComplete={handleMeshAnimDone} />

      {/* Viewport frame */}
      <div className="fixed inset-5 border border-white/15 z-[22] pointer-events-none">
        <div className="absolute -top-px -left-px w-5 h-5 border-l border-t border-[#00ff41]" />
        <div className="absolute -bottom-px -right-px w-5 h-5 border-r border-b border-[#00ff41]" />
      </div>
      {/* Top/bottom fade masks */}
      <div className="fixed top-0 left-0 right-0 h-[60px] z-[21] pointer-events-none" style={{ background: "linear-gradient(to bottom, black 40%, transparent)" }} />
      <div className="fixed bottom-0 left-0 right-0 h-[60px] z-[21] pointer-events-none" style={{ background: "linear-gradient(to top, black 40%, transparent)" }} />

      {/* Header row — mobile only (flow-based, prevents overlap) */}
      <div className="relative z-[30] flex justify-between items-center px-7 pt-7 pb-4 lg:hidden">
        <button onClick={handleRestart} style={{ cursor: "pointer" }}>
          <img src="/kto-logo-white.svg" alt="한국관광공사" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
        </button>
        <button
          onClick={handleRestart}
          className="bg-white text-black font-mono text-[11px] uppercase tracking-[1.5px] px-4 py-2 hover:bg-white/85 transition-colors"
          style={{ cursor: "pointer" }}
        >
          다시 진단하기
        </button>
      </div>
      {/* Logo — desktop fixed */}
      <button onClick={handleRestart} className="hidden lg:block fixed top-9 left-9 z-[30]" style={{ cursor: "pointer" }}>
        <img src="/kto-logo-white.svg" alt="한국관광공사" className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
      </button>
      <div className="fixed bottom-9 right-9 z-[11] hidden md:flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/30">POWERED BY</span>
        <a href="https://osoma.kr/?utm_source=kto_test&utm_medium=typetest&utm_campaign=2026_data_ai&utm_content=powered_by&utm_term=logo" target="_blank" rel="noopener noreferrer" className="pointer-events-auto" style={{ cursor: "pointer" }}><img src="/osoma-logo.svg" alt="오픈소스마케팅" className="h-4 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" /></a>
      </div>
      {/* Main content — 2 column on desktop, stacked on mobile */}
      <main className="relative z-20 grid grid-cols-1 lg:grid-cols-2 lg:min-h-[100dvh] gap-8 lg:gap-[60px] px-6 pt-4 pb-20 shorth:pb-12 md:px-16 lg:px-20 lg:py-20 lg:items-center">

        {/* Left: result headline */}
        <section className="flex flex-col justify-center">
          {/* Type recommendation card */}
          <div
            className="border border-[#00ff41] bg-[#00ff41]/10 px-6 py-5 md:px-12 md:py-7 mb-6 md:mb-8 backdrop-blur-sm self-start max-w-full"
            style={{ boxShadow: "0 0 30px rgba(0,255,65,0.15), inset 0 0 30px rgba(0,255,65,0.05)" }}
          >
            <div className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[3px] mb-3 md:mb-4">RECOMMENDED TYPE</div>
            <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
              <span
                className="text-3xl md:text-5xl font-black text-[#00ff41]"
                style={{ textShadow: "0 0 30px rgba(0,255,65,0.5), 0 0 60px rgba(0,255,65,0.2)" }}
              >
                유형 {content.number}
              </span>
              <span className="text-2xl md:text-4xl font-black text-white/80">-</span>
            </div>
            <div className="text-xl md:text-[2.2rem] font-black text-white leading-[1.3] break-keep">
              {content.name}을 추천합니다.
            </div>
          </div>

          {/* Highlights */}
          <ul className="mb-5 md:mb-6 max-w-[500px] space-y-2 md:space-y-2.5">
            {content.highlights.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm md:text-lg text-white/85 leading-[1.6] break-keep"
              >
                <span className="text-[#00ff41] mt-[0.1em] shrink-0" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs md:text-sm text-white/50 leading-[1.6] mb-8 md:mb-10 max-w-[500px] break-keep">
            자세한 지원 내용과 선정 절차는 공고문에서 확인해 주세요.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex items-stretch gap-4">
            <a
              href="https://touraz.visitkorea.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00ff41] text-black px-10 md:px-12 py-5 text-base md:text-lg font-bold uppercase tracking-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,65,0.4)]"
              style={{ cursor: "pointer" }}
            >
              지원 공고 바로가기
            </a>
            <button
              onClick={handleRestart}
              className="hidden lg:block bg-white text-black px-10 md:px-12 py-5 text-base md:text-lg font-bold uppercase tracking-[1px] transition-all duration-300 hover:-translate-y-1 hover:bg-white/85"
              style={{ cursor: "pointer" }}
            >
              다시 진단하기
            </button>
          </div>

        </section>

        {/* Right: application schedule */}
        <section className="bg-white/[0.02] border border-white/15 p-8 md:p-12 flex flex-col justify-center gap-6 backdrop-blur-sm">
          <div>
            <div className="font-mono text-[10px] md:text-xs text-[#00ff41] tracking-[3px] mb-4">
              APPLICATION SCHEDULE
            </div>
            <div className="text-lg md:text-xl font-bold text-white mb-6">
              접수 일정
            </div>
            <div className="flex items-baseline gap-4 pb-5 border-b border-white/10">
              <span className="font-mono text-xs text-white/50 tracking-[1px] min-w-[64px]">
                접수 마감
              </span>
              <span className="text-xl md:text-2xl font-black text-white">
                {APPLICATION_DEADLINE}
              </span>
            </div>
            <p className="text-xs md:text-sm text-white/50 leading-[1.6] mt-5 break-keep">
              자세한 일정은 공고문을 참고해 주세요.
            </p>
          </div>
        </section>
      </main>

      {/* Sticky bottom CTA — mobile only, visible when main CTA scrolls out */}
      {showStickyCtaVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-[30] p-4 lg:hidden animate-fade-in">
          <a
            href="https://touraz.visitkorea.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#00ff41] text-black text-center py-4 text-base font-bold uppercase tracking-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
            style={{ cursor: "pointer" }}
          >
            지원 공고 바로가기
          </a>
        </div>
      )}

    </div>
  );
}
