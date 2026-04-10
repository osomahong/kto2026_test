import { Dimension } from "@/lib/types";

export interface QuizNode {
  id: string;
  section: number;
  sectionLabel: string;
  type: "ox" | "multiple";
  dimension: Dimension;
  text: string;
  options: {
    label: string;
    value: number;
    nextId?: string;
  }[];
  defaultNextId?: string;
  isRoot?: boolean;
}

// ═══════════════════════════════════════════
// Section 1: 데이터 수집 환경 (3문항)
// ═══════════════════════════════════════════

const s1_root: QuizNode = {
  id: "s1_root",
  section: 1,
  sectionLabel: "데이터 수집 환경",
  type: "multiple",
  dimension: "dataCollection",
  text: "우리 기업은 고객의 행동 데이터를 어느 정도까지 수집하고 있습니까?",
  isRoot: true,
  options: [
    { label: "아직 별도 수집 체계가 없습니다", value: 0, nextId: "s1_low1" },
    { label: "기본적인 방문자 수 정도만 파악하고 있습니다", value: 1, nextId: "s1_low1" },
    { label: "유입 경로와 주요 전환 이벤트를 추적하고 있습니다", value: 2, nextId: "s1_high1" },
    { label: "맞춤 이벤트와 세그먼트별로 체계적으로 수집하고 있습니다", value: 3, nextId: "s1_high1" },
  ],
};

const s1_low1: QuizNode = {
  id: "s1_low1",
  section: 1,
  sectionLabel: "데이터 수집 환경",
  type: "ox",
  dimension: "dataCollection",
  text: "고객이 우리 서비스에서 어떤 행동을 하는지, 데이터로 확인하기 어려운 상황입니까?",
  defaultNextId: "s1_low2",
  options: [
    { label: "네, 그런 편입니다", value: 0 },
    { label: "아닙니다, 어느 정도 확인할 수 있습니다", value: 2 },
  ],
};

const s1_low2: QuizNode = {
  id: "s1_low2",
  section: 1,
  sectionLabel: "데이터 수집 환경",
  type: "ox",
  dimension: "dataCollection",
  text: "어떤 데이터를 수집해야 하는지, 기준을 정하는 것부터 도움이 필요하십니까?",
  defaultNextId: "s2_root",
  options: [
    { label: "네, 기준부터 잡고 싶습니다", value: 0 },
    { label: "아닙니다, 기준은 어느 정도 있습니다", value: 2 },
  ],
};

const s1_high1: QuizNode = {
  id: "s1_high1",
  section: 1,
  sectionLabel: "데이터 수집 환경",
  type: "ox",
  dimension: "dataCollection",
  text: "수집 중인 데이터가 정확한지 검증하거나, 품질을 관리하는 체계가 아직 부족하다고 느끼십니까?",
  defaultNextId: "s1_high2",
  options: [
    { label: "네, 아직 체계적이지 않습니다", value: 0 },
    { label: "아닙니다, 검증 체계가 있습니다", value: 3 },
  ],
};

const s1_high2: QuizNode = {
  id: "s1_high2",
  section: 1,
  sectionLabel: "데이터 수집 환경",
  type: "ox",
  dimension: "dataCollection",
  text: "수집된 데이터를 실시간으로 모니터링하면서 이상치를 바로 감지할 수 있는 환경이 갖춰져 있습니까?",
  defaultNextId: "s2_root",
  options: [
    { label: "아직 그 단계까지는 아닙니다", value: 0 },
    { label: "네, 실시간 모니터링이 가능합니다", value: 2 },
  ],
};

// ═══════════════════════════════════════════
// Section 2: 분석 도구 활용 (2문항)
// ═══════════════════════════════════════════

const s2_root: QuizNode = {
  id: "s2_root",
  section: 2,
  sectionLabel: "분석 도구 활용",
  type: "multiple",
  dimension: "analyticsTools",
  text: "현재 우리 기업의 데이터 분석과 리포팅은 어떤 수준입니까?",
  isRoot: true,
  options: [
    { label: "별도 분석 도구를 사용하고 있지 않습니다", value: 0, nextId: "s2_low1" },
    { label: "광고 플랫폼의 기본 리포트를 참고하는 정도입니다", value: 1, nextId: "s2_low1" },
    { label: "GA4 등 분석 도구로 정기적으로 리포트를 작성합니다", value: 2, nextId: "s2_high1" },
    { label: "맞춤 대시보드로 KPI를 상시 모니터링하고 있습니다", value: 3, nextId: "s2_high1" },
  ],
};

const s2_low1: QuizNode = {
  id: "s2_low1",
  section: 2,
  sectionLabel: "분석 도구 활용",
  type: "ox",
  dimension: "analyticsTools",
  text: "데이터가 쌓이고는 있지만, 이를 한눈에 보거나 의미 있게 해석할 방법이 없어서 아쉬운 적이 있으십니까?",
  defaultNextId: "s3_root",
  options: [
    { label: "네, 활용을 못 하고 있습니다", value: 0 },
    { label: "아닙니다, 나름 활용하고 있습니다", value: 3 },
  ],
};

const s2_high1: QuizNode = {
  id: "s2_high1",
  section: 2,
  sectionLabel: "분석 도구 활용",
  type: "ox",
  dimension: "analyticsTools",
  text: "분석 리포트에서 인사이트를 발견해도, 그것을 실제 마케팅 전략으로 연결하는 데 어려움을 느끼십니까?",
  defaultNextId: "s3_root",
  options: [
    { label: "네, 연결이 쉽지 않습니다", value: 0 },
    { label: "아닙니다, 전략에 잘 반영하고 있습니다", value: 3 },
  ],
};

// ═══════════════════════════════════════════
// Section 3: 마케팅 캠페인 (3문항)
// ═══════════════════════════════════════════

const s3_root: QuizNode = {
  id: "s3_root",
  section: 3,
  sectionLabel: "마케팅 캠페인",
  type: "multiple",
  dimension: "campaignExperience",
  text: "우리 기업의 디지털 마케팅 캠페인 운영은 어떤 단계에 있습니까?",
  isRoot: true,
  options: [
    { label: "아직 캠페인을 집행해 본 경험이 없습니다", value: 0, nextId: "s3_low1" },
    { label: "필요할 때 비정기적으로 광고를 집행하고 있습니다", value: 1, nextId: "s3_low1" },
    { label: "월 단위로 정기적인 캠페인을 운영하고 있습니다", value: 2, nextId: "s3_high1" },
    { label: "A/B 테스트를 활용해 반복적으로 실험하고 최적화합니다", value: 3, nextId: "s3_high1" },
  ],
};

const s3_low1: QuizNode = {
  id: "s3_low1",
  section: 3,
  sectionLabel: "마케팅 캠페인",
  type: "ox",
  dimension: "campaignExperience",
  text: "광고비를 쓴 후, 그 비용이 실제 매출에 얼마나 기여했는지 파악하기 어려우십니까?",
  defaultNextId: "s3_low2",
  options: [
    { label: "네, 추적이 어렵습니다", value: 0 },
    { label: "아닙니다, 어느 정도 파악하고 있습니다", value: 2 },
  ],
};

const s3_low2: QuizNode = {
  id: "s3_low2",
  section: 3,
  sectionLabel: "마케팅 캠페인",
  type: "ox",
  dimension: "campaignExperience",
  text: "구매나 문의 같은 전환을 추적할 수 있는 환경 자체가 아직 준비되지 않은 상태입니까?",
  defaultNextId: "s4_root",
  options: [
    { label: "네, 환경부터 만들어야 합니다", value: 0 },
    { label: "아닙니다, 기본적인 추적은 가능합니다", value: 2 },
  ],
};

const s3_high1: QuizNode = {
  id: "s3_high1",
  section: 3,
  sectionLabel: "마케팅 캠페인",
  type: "multiple",
  dimension: "campaignExperience",
  text: "캠페인 성과를 측정할 때, 주로 어디까지 확인하고 계십니까?",
  defaultNextId: "s3_high2",
  options: [
    { label: "노출 수나 클릭 수를 중심으로 확인합니다", value: 0 },
    { label: "구매·문의 등 전환 건수까지 추적합니다", value: 1 },
    { label: "ROAS, CPA 같은 효율 지표를 분석합니다", value: 2 },
    { label: "고객 생애가치(LTV)까지 고려해서 최적화합니다", value: 3 },
  ],
};

const s3_high2: QuizNode = {
  id: "s3_high2",
  section: 3,
  sectionLabel: "마케팅 캠페인",
  type: "ox",
  dimension: "campaignExperience",
  text: "가설을 세우고 A/B 테스트로 검증하면서, 캠페인을 체계적으로 개선해 본 경험이 있으십니까?",
  defaultNextId: "s4_root",
  options: [
    { label: "아직 그런 경험은 부족합니다", value: 0 },
    { label: "네, 반복적으로 개선하고 있습니다", value: 3 },
  ],
};

// ═══════════════════════════════════════════
// Section 4: AI 활용 (2문항)
// ═══════════════════════════════════════════

const s4_root: QuizNode = {
  id: "s4_root",
  section: 4,
  sectionLabel: "AI 활용",
  type: "ox",
  dimension: "aiAdoption",
  text: "AI를 마케팅이나 데이터 분석에 활용하고 싶지만, 기반 데이터가 정리되어 있지 않아 어디서부터 시작할지 막막하십니까?",
  isRoot: true,
  defaultNextId: "s4_follow",
  options: [
    { label: "네, 시작이 막막합니다", value: 0 },
    { label: "아닙니다, 어느 정도 준비가 되어 있습니다", value: 2 },
  ],
};

const s4_follow: QuizNode = {
  id: "s4_follow",
  section: 4,
  sectionLabel: "AI 활용",
  type: "multiple",
  dimension: "aiAdoption",
  text: "현재 마케팅이나 분석 업무에서 AI를 어느 정도 활용하고 계십니까?",
  options: [
    { label: "아직 활용하고 있지 않습니다", value: 0 },
    { label: "카피나 이미지 같은 콘텐츠 생성에 활용합니다", value: 0.5 },
    { label: "분석이나 타겟팅 등 실무에 활용하고 있습니다", value: 1.5 },
    { label: "캠페인 자동화와 최적화에 AI를 통합했습니다", value: 2 },
  ],
};

// ═══════════════════════════════════════════
// All nodes in a map for lookup
// ═══════════════════════════════════════════

export const allNodes: Record<string, QuizNode> = {
  s1_root,
  s1_low1,
  s1_low2,
  s1_high1,
  s1_high2,
  s2_root,
  s2_low1,
  s2_high1,
  s3_root,
  s3_low1,
  s3_low2,
  s3_high1,
  s3_high2,
  s4_root,
  s4_follow,
};

export const startNodeId = "s1_root";

export function getNextNodeId(
  node: QuizNode,
  selectedValue: number
): string | null {
  const selectedOption = node.options.find((o) => o.value === selectedValue);
  if (selectedOption?.nextId) return selectedOption.nextId;
  if (node.defaultNextId) return node.defaultNextId;
  return null;
}

export const dimensionLabels: Record<string, string> = {
  dataCollection: "데이터 수집 환경",
  analyticsTools: "분석 도구 활용",
  campaignExperience: "마케팅 캠페인",
  aiAdoption: "AI 활용 수준",
};
