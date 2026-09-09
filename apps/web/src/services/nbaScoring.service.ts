export interface NbaScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  status: "strong" | "partial" | "weak";
}

export function calculateEvidenceScore(
  hasDocument: boolean,
  aiScore: number
): NbaScoreResult {
  const maxScore = 100;

  if (!hasDocument) {
    return {
      score: 0,
      maxScore,
      percentage: 0,
      status: "weak",
    };
  }

  const score = Math.max(
    0,
    Math.min(100, aiScore)
  );

  let status:
    | "strong"
    | "partial"
    | "weak";

  if (score >= 75) {
    status = "strong";
  } else if (score >= 50) {
    status = "partial";
  } else {
    status = "weak";
  }

  return {
    score,
    maxScore,
    percentage: score,
    status,
  };
}

export function calculateCriterionScore(
  scores: number[]
) {
  if (scores.length === 0) {
    return 0;
  }

  const total = scores.reduce(
    (sum, score) => sum + score,
    0
  );

  return Number(
    (total / scores.length).toFixed(2)
  );
}

export function calculateOverallScore(
  criterionScores: number[]
) {
  if (criterionScores.length === 0) {
    return 0;
  }

  const total = criterionScores.reduce(
    (sum, score) => sum + score,
    0
  );

  return Number(
    (total / criterionScores.length).toFixed(2)
  );
}

export function getScoreStatus(
  score: number
) {
  if (score >= 75) {
    return "strong";
  }

  if (score >= 50) {
    return "partial";
  }

  return "weak";
}