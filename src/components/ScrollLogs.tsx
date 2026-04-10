"use client";

import { useState, useEffect, useRef } from "react";

const programSteps = [
  "[INIT] 한국관광공사 데이터·AI 지원사업 로딩 중...",
  "[STEP_01] 대상 기업 모집 및 선발 절차 운영",
  "[STEP_02] 유형1: 데이터·AI 환경 구축 (12개사)",
  "[STEP_03] 유형2: AI 기반 그로스해킹 컨설팅 (15개사)",
  "[STEP_04] 기업별 AI 활용 컨설팅 및 솔루션 구독 지원",
  "[DETAIL] 데이터 마케팅 실행 예산 기업당 1,000만원 지원",
  "[DETAIL] AI 솔루션 구독비 기업당 100만원 지원",
  "[DETAIL] 전담 컨설턴트 1:1 매칭 (5개월)",
  "[GOAL] 유형1 목표: 데이터 정합성 90% 이상 달성",
  "[GOAL] 유형2 목표: 전년 대비 주요 지표 50% 이상 개선",
  "[SYS] 기업 진단 모듈 활성화...",
  "[SYS] AI 매칭 엔진 대기 중...",
];

export default function ScrollLogs() {
  const [lines, setLines] = useState<string[]>([
    programSteps[0],
    programSteps[1],
    programSteps[2],
    programSteps[3],
  ]);
  const indexRef = useRef(4);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextLine = programSteps[indexRef.current % programSteps.length];
      indexRef.current++;
      setLines((prev) => {
        const next = [...prev, nextLine];
        return next.length > 5 ? next.slice(-5) : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 md:bottom-10 md:left-10 font-mono text-[10px] max-h-[120px] overflow-hidden z-30">
      {lines.map((line, i) => {
        const isLatest = i === lines.length - 1;
        const isSys = line.startsWith("[SYS]") || line.startsWith("[INIT]");
        const isGoal = line.startsWith("[GOAL]");
        return (
          <div
            key={`${indexRef.current}-${i}`}
            className={`leading-relaxed ${
              isLatest
                ? "text-white/80"
                : isSys
                  ? "text-[#4f8ef7]/70"
                  : isGoal
                    ? "text-white/60"
                    : "text-white/55"
            }`}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}
