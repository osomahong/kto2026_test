export type QuestionType = "ox" | "multiple";

export type Dimension =
  | "dataCollection"
  | "analyticsTools"
  | "campaignExperience"
  | "aiAdoption";

export interface QuizResult {
  recommendedType: 1 | 2;
}
