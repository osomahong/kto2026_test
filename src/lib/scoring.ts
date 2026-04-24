import { allNodes } from "@/data/questions";
import { Dimension, QuizResult } from "@/lib/types";

const dimensionWeights: Record<Dimension, number> = {
  dataCollection: 0.30,
  analyticsTools: 0.30,
  campaignExperience: 0.25,
  aiAdoption: 0.15,
};

export function calculateResult(answers: Record<string, number>): QuizResult {
  const dimensions: Dimension[] = [
    "dataCollection",
    "analyticsTools",
    "campaignExperience",
    "aiAdoption",
  ];

  // Per-dimension normalized score (0~1) from answered nodes only
  const dimensionRaw: Record<Dimension, number> = {
    dataCollection: 0,
    analyticsTools: 0,
    campaignExperience: 0,
    aiAdoption: 0,
  };

  for (const dim of dimensions) {
    const answeredNodes = Object.entries(allNodes).filter(
      ([id, node]) => node.dimension === dim && answers[id] !== undefined,
    );
    if (answeredNodes.length === 0) continue;

    const totalScore = answeredNodes.reduce(
      (sum, [id]) => sum + (answers[id] ?? 0),
      0,
    );
    const maxScore = answeredNodes.reduce((sum, [, node]) => {
      const maxOpt = Math.max(...node.options.map((o) => o.value));
      return sum + maxOpt;
    }, 0);

    dimensionRaw[dim] = maxScore > 0 ? Math.min(totalScore / maxScore, 1) : 0;
  }

  const weightedScore = dimensions.reduce(
    (sum, dim) => sum + dimensionRaw[dim] * dimensionWeights[dim],
    0,
  );

  return {
    recommendedType: weightedScore >= 0.55 ? 2 : 1,
  };
}
