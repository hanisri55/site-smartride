export type Difficulty = "Easy" | "Medium" | "Hard";

export function nextDifficulty(current: Difficulty, correct: boolean): Difficulty {
  const order: Difficulty[] = ["Easy", "Medium", "Hard"];
  const index = order.indexOf(current);
  const nextIndex = correct ? Math.min(order.length - 1, index + 1) : Math.max(0, index - 1);
  return order[nextIndex];
}

export type ReadinessInputs = {
  technicalSkills: number;
  verifiedSkills: number;
  jobMatch: number;
  projects: number;
  experience: number;
  certifications: number;
  assessment: number;
};

export function calculateReadiness(input: ReadinessInputs): number {
  const score = input.technicalSkills * 0.2 + input.verifiedSkills * 0.2 + input.jobMatch * 0.2 + input.projects * 0.15 + input.experience * 0.1 + input.certifications * 0.05 + input.assessment * 0.1;
  return Math.round(Math.max(0, Math.min(100, score)));
}

export type SimulationOption = { id: string; readinessDelta: number; opportunityDelta: number };

export function simulateOpportunity(baseReadiness: number, baseOpportunities: number, options: SimulationOption[], selectedIds: string[]) {
  const selected = options.filter(option => selectedIds.includes(option.id));
  return {
    readiness: Math.min(100, baseReadiness + selected.reduce((sum, option) => sum + option.readinessDelta, 0)),
    opportunities: baseOpportunities + selected.reduce((sum, option) => sum + option.opportunityDelta, 0),
  };
}
