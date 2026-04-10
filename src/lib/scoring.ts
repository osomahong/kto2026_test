import { allNodes, dimensionLabels } from "@/data/questions";
import { Dimension, DimensionScore, QuizResult } from "@/lib/types";

const dimensionWeights: Record<Dimension, number> = {
  dataCollection: 0.30,
  analyticsTools: 0.30,
  campaignExperience: 0.25,
  aiAdoption: 0.15,
};

function getComment(dimension: Dimension, ratio: number): string {
  if (ratio < 0.3) {
    const comments: Record<Dimension, string> = {
      dataCollection: "데이터 수집 체계를 처음부터 함께 만들어 갑니다",
      analyticsTools: "분석 환경을 도입하면 큰 변화를 만들 수 있습니다",
      campaignExperience: "캠페인 운영의 첫걸음을 함께 시작합니다",
      aiAdoption: "AI 도입을 위한 기반부터 차근차근 준비합니다",
    };
    return comments[dimension];
  }
  if (ratio < 0.6) {
    const comments: Record<Dimension, string> = {
      dataCollection: "기본 수집은 되어 있으니, 한 단계 더 고도화할 수 있습니다",
      analyticsTools: "분석 도구를 쓰고 계시니, 체계를 잡으면 더 좋아집니다",
      campaignExperience: "캠페인 경험이 있으시니, 체계적으로 발전시킬 수 있습니다",
      aiAdoption: "AI를 일부 활용 중이시니, 범위를 넓혀볼 수 있습니다",
    };
    return comments[dimension];
  }
  const comments: Record<Dimension, string> = {
    dataCollection: "체계적인 데이터 수집 환경을 잘 갖추고 계십니다",
    analyticsTools: "분석 도구를 효과적으로 활용하고 계십니다",
    campaignExperience: "캠페인 운영 역량이 뛰어나십니다",
    aiAdoption: "AI를 실무에 적극적으로 활용하고 계십니다",
  };
  return comments[dimension];
}

export function calculateResult(answers: Record<string, number>): QuizResult {
  const dimensions: Dimension[] = [
    "dataCollection",
    "analyticsTools",
    "campaignExperience",
    "aiAdoption",
  ];

  // Calculate per-dimension scores from answered nodes only
  const dimensionScores: DimensionScore[] = dimensions.map((dim) => {
    // Find all nodes in this dimension that were actually answered
    const answeredNodes = Object.entries(allNodes)
      .filter(([id, node]) => node.dimension === dim && answers[id] !== undefined);

    if (answeredNodes.length === 0) {
      return {
        dimension: dim,
        label: dimensionLabels[dim],
        raw: 0,
        comment: getComment(dim, 0),
      };
    }

    // Sum actual scores and max possible scores for answered nodes
    const totalScore = answeredNodes.reduce((sum, [id]) => sum + (answers[id] ?? 0), 0);
    const maxScore = answeredNodes.reduce((sum, [, node]) => {
      const maxOpt = Math.max(...node.options.map((o) => o.value));
      return sum + maxOpt;
    }, 0);

    const raw = maxScore > 0 ? Math.min(totalScore / maxScore, 1) : 0;

    return {
      dimension: dim,
      label: dimensionLabels[dim],
      raw,
      comment: getComment(dim, raw),
    };
  });

  // Weighted composite score (0~1)
  const weightedScore = dimensionScores.reduce(
    (sum, ds) => sum + ds.raw * dimensionWeights[ds.dimension],
    0
  );

  // Type 2: weighted score >= 0.55 (no individual dimension gates)
  // The 7:3 ratio comes naturally from:
  // - dataCollection(30%) + analyticsTools(30%) = 60% of total weight
  // - low-branch OX questions tend to get 0-point "공감" answers
  // - companies need to score well across multiple dimensions to hit 0.55
  const isType2 = weightedScore >= 0.55;

  const dc = dimensionScores.find((d) => d.dimension === "dataCollection")!.raw;
  const at = dimensionScores.find((d) => d.dimension === "analyticsTools")!.raw;
  const ce = dimensionScores.find((d) => d.dimension === "campaignExperience")!.raw;

  // Generate reasons
  const reasons: string[] = [];
  if (isType2) {
    reasons.push("데이터 수집과 분석 환경이 잘 갖춰져 있어, 바로 성장 전략에 집중할 수 있습니다");
    if (ce >= 0.5) reasons.push("캠페인 운영 경험을 바탕으로 A/B 테스트 기반의 그로스해킹을 시작하기 좋은 단계입니다");
    reasons.push("전문 컨설턴트와 함께라면, 데이터 기반의 빠른 성장을 충분히 실현하실 수 있습니다");
  } else {
    if (dc < 0.4) reasons.push("고객 행동 데이터를 체계적으로 수집할 수 있는 환경을 먼저 갖추는 것이 중요합니다");
    if (at < 0.4) reasons.push("수집된 데이터를 한눈에 보고 분석할 수 있는 도구를 도입하면 큰 변화가 시작됩니다");
    if (dc >= 0.4 && at >= 0.4) reasons.push("기본 환경은 갖춰져 있으니, 한 단계 더 고도화하면 훨씬 큰 성과를 만들 수 있습니다");
    reasons.push("잘 정리된 데이터가 있어야 AI도 똑똑해집니다. 지금 쌓는 데이터가 곧 AI 성과의 밑거름이 됩니다");
  }

  return {
    recommendedType: isType2 ? 2 : 1,
    weightedScore,
    dimensionScores,
    reasons,
  };
}
