export type QuestionType = "ox" | "multiple";

export type Dimension =
  | "dataCollection"
  | "analyticsTools"
  | "campaignExperience"
  | "aiAdoption";

export interface DimensionScore {
  dimension: Dimension;
  label: string;
  raw: number; // 0~1 normalized
  comment: string;
}

export interface QuizResult {
  recommendedType: 1 | 2;
  weightedScore: number;
  dimensionScores: DimensionScore[];
  reasons: string[];
}
