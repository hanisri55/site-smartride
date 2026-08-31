import { describe, expect, it } from "vitest";
import { calculateReadiness, nextDifficulty, simulateOpportunity } from "@/lib/skillbridge-logic";

describe("SkillBridge core logic", () => {
  it("moves adaptive difficulty up after a correct answer and down after an incorrect answer", () => {
    expect(nextDifficulty("Easy", true)).toBe("Medium");
    expect(nextDifficulty("Medium", true)).toBe("Hard");
    expect(nextDifficulty("Hard", true)).toBe("Hard");
    expect(nextDifficulty("Hard", false)).toBe("Medium");
    expect(nextDifficulty("Easy", false)).toBe("Easy");
  });

  it("calculates a bounded, weighted readiness estimate", () => {
    expect(calculateReadiness({ technicalSkills: 84, verifiedSkills: 76, jobMatch: 72, projects: 82, experience: 65, certifications: 50, assessment: 88 })).toBe(76);
    expect(calculateReadiness({ technicalSkills: 120, verifiedSkills: 120, jobMatch: 120, projects: 120, experience: 120, certifications: 120, assessment: 120 })).toBe(100);
    expect(calculateReadiness({ technicalSkills: -10, verifiedSkills: -10, jobMatch: -10, projects: -10, experience: -10, certifications: -10, assessment: -10 })).toBe(0);
  });

  it("simulates selected skill deltas without mutating the input options", () => {
    const options = [
      { id: "docker", readinessDelta: 6, opportunityDelta: 16 },
      { id: "aws", readinessDelta: 6, opportunityDelta: 18 },
    ];
    expect(simulateOpportunity(72, 42, options, ["docker", "aws"])).toEqual({ readiness: 84, opportunities: 76 });
    expect(simulateOpportunity(72, 42, options, ["unknown"])).toEqual({ readiness: 72, opportunities: 42 });
    expect(options).toHaveLength(2);
  });
});
