"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { QuizResult } from "@/lib/types";
import ScoreChart from "@/components/ScoreChart";

const ParticleMesh = dynamic(() => import("@/components/ParticleMesh"), {
  ssr: false,
});

const type1 = {
  badge: "Starter — AI READY",
  title: "AI를 제대로 활용하려면,\n좋은 데이터를 쌓는 것이 먼저입니다",
  desc: "성공적인 AI 도입은 인프라부터 시작됩니다. 기업의 현재 데이터 상태를 정밀 진단하여, 전략적으로 수집 하여 AX시대에 성과를 낼 수 있는 최적의 환경을 제공합니다.",
  items: [
    { tag: "01_INFRA", title: "분석 환경 구축", desc: "GA4, GTM, BigQuery, Looker Studio를 연동한 클라우드 기반 통합 분석 환경을 구축합니다." },
    { tag: "02_SCHEMA", title: "데이터 수집 설계", desc: "비즈니스 목표에 기반하여 고객의 모든 터치포인트를 기록할 수 있는 데이터 스키마를 설계합니다." },
    { tag: "03_VIZ", title: "커스텀 대시보드", desc: "의사결정에 필요한 핵심 지표(KPI)를 실시간으로 확인할 수 있는 맞춤형 대시보드를 제공합니다." },
    { tag: "04_AGENT", title: "AI 인터페이스", desc: "SQL을 몰라도 자연어로 데이터를 조회하고 시각화할 수 있는 AI 에이전트 환경을 제공합니다." },
  ],
  timeline: [
    { month: "1개월차", title: "현황 진단", desc: "기업 인터뷰, 데이터 수집 현황 검토, KPI 설정, AI 활용 수준 진단" },
    { month: "2~3개월차", title: "분석 환경 구축", desc: "맞춤형 애널리틱스 설계·구축, 이벤트 데이터 수집 설계 및 개발" },
    { month: "4개월차", title: "대시보드 구축", desc: "KPI 맞춤 시각화 대시보드 제작, 데이터 해석 내재화 교육" },
    { month: "5개월차", title: "최종 결산", desc: "결과 리뷰, 성과 분석 보고서 제작, AI 에이전트 환경 최종 셋업" },
  ],
  selectionTips: [
    { title: "데이터 담당자 확보", desc: "사내에 데이터/마케팅 담당 임직원이 있어야 합니다. 채용 예정인 경우 지원이 불가합니다." },
    { title: "개발 지원 가능 여부", desc: "이벤트 태깅 등 기술적 구현을 위해 내부 또는 외주 개발 지원이 가능해야 합니다." },
    { title: "서비스 운영 안정성", desc: "사업 기간 중 서비스 중단이나 전체 리뉴얼 계획이 없어야 합니다." },
    { title: "참여 의지 표현", desc: "면접에서 데이터 환경 구축에 대한 구체적인 목표와 활용 계획을 명확히 제시하면 유리합니다." },
    { title: "현재 데이터 현황 정리", desc: "현재 사용 중인 분석 도구, 수집 중인 데이터, 해결하고 싶은 과제를 미리 정리해 두면 좋습니다." },
  ],
};

const type2 = {
  badge: "Growth — AI ACCELERATE",
  title: "데이터 기반이 잘 갖춰져 있습니다.\n이제 본격적으로 성장할 차례입니다",
  desc: "축적된 데이터와 분석 역량을 바탕으로, AI 기반 그로스해킹을 통해 빠른 성장을 실현할 수 있는 단계입니다.",
  items: [
    { tag: "01_GROWTH", title: "그로스해킹 컨설팅", desc: "가설 수립부터 실험, 검증까지 3회 반복하는 데이터 기반 성장 전략을 함께 실행합니다." },
    { tag: "02_ABTEST", title: "A/B 테스트 운영", desc: "3회의 캠페인을 A/B 테스트 기반으로 기획하고 운영하며, 성과를 체계적으로 분석합니다." },
    { tag: "03_AX", title: "Agentic AI 기반 AX 지원", desc: "조직의 업무 프로세스를 확인하여 Agentic AI를 활용한 AX를 지원합니다." },
  ],
  timeline: [
    { month: "1개월차", title: "현황 파악 및 목표 설정", desc: "심층 인터뷰, 데이터 환경 진단, 핵심 KPI 설정, 성장 가설 수립" },
    { month: "2개월차", title: "1차 캠페인", desc: "첫 번째 가설 기반 A/B 테스트 설계 및 캠페인 실행 (광고비 지원)" },
    { month: "3개월차", title: "2차 캠페인", desc: "1차 결과 분석 → 개선안 도출 → 두 번째 실험 설계 및 실행" },
    { month: "4개월차", title: "3차 캠페인", desc: "누적 인사이트 기반 최적화 캠페인 실행, 성과 극대화" },
    { month: "5개월차", title: "최종 결산", desc: "전체 성과 분석, 플레이북 문서화, 자체 운영 역량 이관" },
  ],
  selectionTips: [
    { title: "기존 데이터 환경 어필", desc: "GA4, GTM 등 현재 운영 중인 분석 환경과 활용 사례를 구체적으로 제시하면 강점이 됩니다." },
    { title: "성장 목표 구체화", desc: "개선하고 싶은 KPI(전환율, ROAS 등)와 구체적인 목표 수치를 면접에서 명확히 제시합니다." },
    { title: "캠페인 실행 이력", desc: "과거 디지털 마케팅 캠페인 집행 경험과 성과를 정리해 두면 유리합니다." },
    { title: "전담 인력 배치", desc: "대표 또는 팀 리더급과 실무 담당자가 함께 참여할 수 있어야 합니다." },
    { title: "A/B 테스트 의지", desc: "가설 기반 실험에 대한 이해와 적극적인 참여 의지를 보여주는 것이 중요합니다." },
  ],
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [meshAnim, setMeshAnim] = useState<"idle" | "suck-in" | "expand-out">("expand-out");
  const [restarting, setRestarting] = useState(false);
  const [showStickyCtaVisible, setShowStickyCtaVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    const name = sessionStorage.getItem("companyName") || "";
    if (stored) {
      setResult(JSON.parse(stored));
      setCompanyName(name);
    } else {
      router.replace("/");
    }
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
          <img src="/kto-logo.png" alt="한국관광공사" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
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
        <img src="/kto-logo.png" alt="한국관광공사" className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" />
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
            className="border border-[#00ff41] bg-[#00ff41]/10 px-6 py-4 md:px-12 md:py-6 mb-6 md:mb-8 backdrop-blur-sm self-start"
            style={{ boxShadow: "0 0 30px rgba(0,255,65,0.15), inset 0 0 30px rgba(0,255,65,0.05)" }}
          >
            <div className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[3px] mb-2 md:mb-3">YOUR RECOMMENDED</div>
            <div className="flex items-baseline gap-1.5 md:gap-2 whitespace-nowrap">
              <span
                className="text-3xl md:text-6xl font-black text-[#00ff41]"
                style={{ textShadow: "0 0 30px rgba(0,255,65,0.5), 0 0 60px rgba(0,255,65,0.2)" }}
              >
                유형{result.recommendedType}
              </span>
              <span className="text-3xl md:text-6xl font-black text-white">
                에 지원하세요
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-[3.2rem] font-extrabold leading-[1.2] tracking-[-0.02em] mb-6 md:mb-8 whitespace-pre-line break-keep text-glow">
            {content.title}
          </h1>

          {/* Description */}
          <p className="text-sm md:text-lg text-white/80 leading-[1.7] mb-8 md:mb-10 max-w-[500px] break-keep text-glow">
            {content.desc}
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

        {/* Right: checklist */}
        <section className="bg-white/[0.02] border border-white/15 p-6 md:p-10 flex flex-col gap-6 lg:max-h-[80vh] lg:overflow-y-auto backdrop-blur-sm">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 md:gap-5 pb-5 border-b border-white/5 last:border-b-0 last:pb-0 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "backwards" }}
            >
              {/* Check icon */}
              <div className="w-6 h-6 min-w-[24px] border border-[#00ff41] flex items-center justify-center text-[#00ff41] font-mono text-sm mt-1">
                ✓
              </div>
              {/* Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[#00ff41]/70 tracking-[1px]">
                    {item.tag}
                  </span>
                  <span className="text-base md:text-lg font-bold text-white">
                    {item.title}
                  </span>
                </div>
                <p className="text-sm md:text-[15px] text-white/80 leading-relaxed break-keep">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Score chart */}
          <div className="pt-5 border-t border-white/10">
            <div className="text-base font-bold text-white mb-4">
              역량 진단 결과
            </div>
            <ScoreChart scores={result.dimensionScores} dark />
          </div>

          {/* Timeline: 사업 기간 동안 받을 수 있는 지원 */}
          <div className="pt-6 border-t border-white/10">
            <div className="text-base font-bold text-white mb-5">
              지원 일정
            </div>
            <div className="font-mono text-xs text-white/70 mb-4">
              5개월간 아래와 같은 단계로 지원이 진행됩니다
            </div>
            <div className="space-y-0">
              {content.timeline.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Vertical line */}
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 border border-[#00ff41] bg-[#00ff41]/20 rounded-full shrink-0 mt-1" />
                    {i < content.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-[#00ff41] tracking-[1px]">
                        {step.month}
                      </span>
                      <span className="text-sm font-bold text-white">{step.title}</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed break-keep">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Tips: 선정되기 위한 팁 */}
          <div className="pt-6 border-t border-white/10">
            <div className="text-base font-bold text-white mb-5">
              선정 준비
            </div>
            <div className="font-mono text-xs text-white/70 mb-4">
              지원사업 선정을 위해 아래 사항을 미리 준비하면 좋습니다
            </div>
            <div className="space-y-4">
              {content.selectionTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 min-w-[20px] border border-white/40 flex items-center justify-center text-white/70 font-mono text-[10px] mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{tip.title}</div>
                    <p className="text-sm text-white/90 leading-relaxed break-keep">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
