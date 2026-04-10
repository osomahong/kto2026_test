"use client";

import { Dimension } from "@/lib/types";

const icons: Record<Dimension, React.ReactNode> = {
  dataCollection: (
    <svg viewBox="0 0 40 40" className="w-10 h-10" role="img" aria-label="데이터 수집">
      <rect x="4" y="18" width="8" height="18" rx="2" fill="#a5c4f7" />
      <rect x="16" y="10" width="8" height="26" rx="2" fill="#3f78e0" />
      <rect x="28" y="14" width="8" height="22" rx="2" fill="#a5c4f7" />
      <circle cx="32" cy="8" r="4" fill="#45c4a0" />
      <path d="M30 8 L32 10 L35 6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  analyticsTools: (
    <svg viewBox="0 0 40 40" className="w-10 h-10" role="img" aria-label="분석 도구">
      <rect x="4" y="4" width="32" height="24" rx="4" fill="#e0ecff" stroke="#3f78e0" strokeWidth="1.5" />
      <line x1="10" y1="22" x2="14" y2="16" stroke="#3f78e0" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="20" y2="20" stroke="#3f78e0" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="20" x2="26" y2="12" stroke="#45c4a0" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="12" x2="30" y2="14" stroke="#45c4a0" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="32" width="12" height="3" rx="1.5" fill="#a5c4f7" />
    </svg>
  ),
  campaignExperience: (
    <svg viewBox="0 0 40 40" className="w-10 h-10" role="img" aria-label="마케팅 캠페인">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#e0ecff" strokeWidth="3" />
      <circle cx="20" cy="20" r="9" fill="none" stroke="#a5c4f7" strokeWidth="3" />
      <circle cx="20" cy="20" r="4" fill="#3f78e0" />
      <path d="M30 8 L34 4" stroke="#45c4a0" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 4 L36 8" stroke="#45c4a0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 4 L38 6" stroke="#45c4a0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  aiAdoption: (
    <svg viewBox="0 0 40 40" className="w-10 h-10" role="img" aria-label="AI 활용">
      <circle cx="20" cy="10" r="5" fill="#3f78e0" />
      <circle cx="8" cy="30" r="5" fill="#a5c4f7" />
      <circle cx="32" cy="30" r="5" fill="#a5c4f7" />
      <line x1="20" y1="15" x2="10" y2="26" stroke="#3f78e0" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="20" y1="15" x2="30" y2="26" stroke="#3f78e0" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="13" y1="30" x2="27" y2="30" stroke="#a5c4f7" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="20" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">AI</text>
    </svg>
  ),
};

export default function AreaIcon({ dimension }: { dimension: Dimension }) {
  return icons[dimension] ?? null;
}
