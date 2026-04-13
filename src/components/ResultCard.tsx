"use client";

import { QuizResult } from "@/lib/types";

const type1Content = {
  title: "AI를 제대로 활용하려면,\n좋은 데이터를 쌓는 것이 먼저입니다",
  subtitle: "유형1: Starter — 데이터·AI 환경 구축 및 활용",
  summary:
    "AI가 똑똑해지려면 양질의 데이터가 필요합니다.\n지금 잘 기록해두는 데이터 하나하나가\n6개월 후 AI 성과의 밑거름이 됩니다.",
  color: "#00cc33",
  bgColor: "#d0ffd6",
  items: [
    "GA4, GTM, BigQuery, Looker Studio 등 분석 환경을 구축해 드립니다",
    "우리 기업에 맞는 고객 행동 데이터 수집 체계를 함께 설계합니다",
    "핵심 KPI를 한눈에 볼 수 있는 맞춤 대시보드를 만들어 드립니다",
    "자연어로 데이터를 조회할 수 있는 AI 에이전트 환경을 구축합니다",
  ],
  goal: "데이터 정합성 90% 이상 달성",
  meetings: "컨설팅 4회 이상 (대면 1회 + 비대면 2회 + 킥오프)",
};

const type2Content = {
  title: "데이터 기반이 잘 갖춰져 있습니다.\n이제 본격적으로 성장할 차례입니다",
  subtitle: "유형2: Growth — AI 기반 그로스해킹 컨설팅",
  summary:
    "이미 축적하신 데이터와 분석 역량을 바탕으로,\nAI와 함께 빠른 성장을 만들어갈 준비가 되셨습니다.",
  color: "#45c4a0",
  bgColor: "#e6f7f2",
  items: [
    "가설 수립부터 실험, 검증까지 3회 반복하는 그로스해킹 컨설팅을 받습니다",
    "A/B 테스트 기반의 캠페인을 3회 함께 기획하고 운영합니다",
    "AI를 활용한 크리에이티브 생성과 캠페인 최적화를 경험합니다",
  ],
  goal: "전년 대비 주요 지표 50% 이상 개선",
  meetings: "컨설팅 9회 이상 (대면 3회 + 비대면 6회)",
};

export default function ResultContent({ result }: { result: QuizResult }) {
  const content = result.recommendedType === 1 ? type1Content : type2Content;

  return (
    <div className="space-y-6">
      {/* Type badge + title */}
      <div
        className="rounded-2xl p-6 text-center animate-fade-in-up"
        style={{ backgroundColor: content.bgColor }}
      >
        <div
          className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold mb-4"
          style={{ backgroundColor: content.color }}
        >
          AI 추천
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-snug whitespace-pre-line mb-2">
          {content.title}
        </h2>
        <p className="text-xs text-gray-500 mb-3">{content.subtitle}</p>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {content.summary}
        </p>
      </div>

      {/* Reasons */}
      <div
        className="bg-white rounded-xl p-5 shadow-sm animate-fade-in-up"
        style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
      >
        <h3 className="text-sm font-bold text-gray-900 mb-3">추천 이유</h3>
        <ul className="space-y-2">
          {result.reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed"
            >
              <span
                className="shrink-0 mt-0.5"
                style={{ color: content.color }}
              >
                &#x2022;
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Support details */}
      <div
        className="bg-white rounded-xl p-5 shadow-sm animate-fade-in-up"
        style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
      >
        <h3 className="text-sm font-bold text-gray-900 mb-3">지원 내용</h3>
        <ul className="space-y-2.5">
          {content.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed"
            >
              <svg
                viewBox="0 0 16 16"
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: content.color }}
              >
                <circle
                  cx="8"
                  cy="8"
                  r="8"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M5 8 L7 10 L11 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-500">
          <div>
            <span className="font-medium text-gray-700">목표</span>{" "}
            {content.goal}
          </div>
          <div>
            <span className="font-medium text-gray-700">컨설팅</span>{" "}
            {content.meetings}
          </div>
        </div>
      </div>
    </div>
  );
}
