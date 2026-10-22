import { describe, expect, it } from "vitest";
import { buildQuiz, QUESTIONS, readiness, scoreByTopic, weakestTopic, type Question } from "@/lib/quiz";

describe("readiness", () => {
  it("80% or more is Ready", () => expect(readiness(80)).toBe("Ready"));
  it("60-79% is Almost there", () => {
    expect(readiness(60)).toBe("Almost there");
    expect(readiness(79)).toBe("Almost there");
  });
  it("below 60% is Keep practising", () => expect(readiness(59)).toBe("Keep practising"));
});

describe("weakest topic", () => {
  it("names the lowest-scoring topic", () => {
    const q = (topic: string): Question => ({ id: 0, topic, question: "", options: [], answer: 0, explanation: "" });
    const qs = [q("Cloud Concepts"), q("Cloud Concepts"), q("Azure Management and Governance")];
    const s = scoreByTopic(qs, [0, 0, 1]);
    expect(weakestTopic(s)).toBe("Azure Management and Governance");
});

describe("buildQuiz shuffling", () => {
  it("keeps the marked answer on the correct option text after shuffling", () => {
    for (const topic of [null, ...(["Cloud Concepts", "Azure Architecture and Services", "Azure Management and Governance"] as const)]) {
      for (const q of buildQuiz(topic)) {
        const source = QUESTIONS.find((s) => s.id === q.id)!;
        expect(q.options[q.answer]).toBe(source.options[source.answer]);
      }
    }
  });

  it("keeps the same set of options as the source question", () => {
    for (const q of buildQuiz(null)) {
      const source = QUESTIONS.find((s) => s.id === q.id)!;
      expect([...q.options].sort()).toEqual([...source.options].sort());
    }
  });
});
