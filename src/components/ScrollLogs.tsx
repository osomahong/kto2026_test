"use client";

import { useState, useEffect, useRef } from "react";

const programSteps = [
  "[INIT] 2026 관광기업 데이터·AI 활용 지원 사업 로딩 중...",
  "[STEP_01] 대상 기업 모집 및 선발 절차 운영",
  "[STEP_02] 유형 1: AI 기반 데이터 분석 환경 구축 및 활용",
  "[STEP_03] 유형 2: AI 기반 데이터 마케팅 컨설팅(그로스 해킹)",
  "[STEP_04] 기업별 데이터·AI 활용 컨설팅 지원",
  "[GOAL] 유형 1 방향: 데이터 정합성 확보",
  "[GOAL] 유형 2 방향: 주요 지표 개선",
  "[SYS] 유형 확인 모듈 활성화...",
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
                  ? "text-[#00ff41]/70"
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
