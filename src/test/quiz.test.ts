import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQuiz, QUESTIONS, TOPICS, nextStep, readiness, scoreByTopic, scoreTone, shuffleOptions, weakestTopic, type Question } from "@/lib/quiz";

afterEach(() => vi.restoreAllMocks());

describe("readiness", () => {
  it("80% or more is Ready", () => expect(readiness(80)).toBe("Ready"));
  it("60-79% is Almost there", () => {
    expect(readiness(60)).toBe("Almost there");
    expect(readiness(79)).toBe("Almost there");
  });
  it("below 60% is Keep practising", () => expect(readiness(59)).toBe("Keep practising"));
});

describe("scoreTone", () => {
  it("is green at 80% or more", () => {
    expect(scoreTone(80)).toBe("bg-success");
    expect(scoreTone(100)).toBe("bg-success");
  });
  it("is orange from 60% to 79%", () => {
    expect(scoreTone(60)).toBe("bg-warning");
    expect(scoreTone(79)).toBe("bg-warning");
  });
  it("is red below 60%", () => {
    expect(scoreTone(59)).toBe("bg-destructive");
    expect(scoreTone(0)).toBe("bg-destructive");
  });
});

describe("nextStep", () => {
  it("tells an Almost-there learner to revise their weakest topic", () => {
    expect(nextStep(70, "Azure Management and Governance")).toBe("Revise Azure Management and Governance, then try again.");
  });
  it("tells a Keep-practising learner where to start", () => {
    expect(nextStep(40, "Cloud Concepts")).toContain("Start with Cloud Concepts");
  });
  it("keeps a Ready learner practising without naming a weakest topic", () => {
    const msg = nextStep(80, "Cloud Concepts");
    expect(msg).toContain("ready");
    expect(msg).not.toContain("Cloud Concepts");
  });
  it("never mentions a missing topic", () => {
    for (const pct of [0, 40, 60, 70, 80, 100]) {
      expect(nextStep(pct, null)).not.toMatch(/null|undefined/);
    }
  });
});

describe("weakest topic", () => {
  it("names the lowest-scoring topic", () => {
    const q = (topic: string): Question => ({ id: 0, topic, question: "", options: [], answer: 0, explanation: "" });
    const qs = [q("Cloud Concepts"), q("Cloud Concepts"), q("Azure Management and Governance")];
    const s = scoreByTopic(qs, [0, 0, 1]);
    expect(weakestTopic(s)).toBe("Azure Management and Governance");
  });
});

describe("buildQuiz shuffling", () => {
  it("keeps the marked answer on the correct option text after shuffling", () => {
    for (const topic of [null, ...(["Cloud Concepts", "Azure Architecture and Services", "Azure Management and Governance"] as const)]) {
      for (const q of buildQuiz(topic)) {
        const source = QUESTIONS.find((s) => s.id === q.id);
        if (!source) throw new Error(`Unknown question ${q.id}`);
        expect(q.options[q.answer]).toBe(source.options[source.answer]);
      }
    }
  });

  it("keeps the same set of options as the source question", () => {
    for (const q of buildQuiz(null)) {
      const source = QUESTIONS.find((s) => s.id === q.id);
      if (!source) throw new Error(`Unknown question ${q.id}`);
      expect([...q.options].sort()).toEqual([...source.options].sort());
    }
  });

  it("tracks the original correct option when option text is repeated", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    const q: Question = {
      id: 100, topic: TOPICS[0], question: "Repeated option labels",
      options: ["Same label", "Same label", "Third", "Fourth"],
      answer: 1, explanation: "The second option is marked correct.",
    };
    expect(shuffleOptions(q).answer).toBe(1);
  });

  it("reshuffles both questions and options on every start without mutating the source or previous quiz", () => {
    const original = structuredClone(QUESTIONS);
    const random = vi.spyOn(Math, "random").mockReturnValue(0.999);
    for (const topic of [null, ...TOPICS]) {
      random.mockReturnValue(0.999);
      const first = buildQuiz(topic);
      const firstSnapshot = structuredClone(first);
      random.mockReturnValue(0.5);
      const second = buildQuiz(topic);
      expect(second.map((q) => q.id)).not.toEqual(first.map((q) => q.id));
      for (const q of second) {
        const source = original.find((s) => s.id === q.id);
        if (!source) throw new Error(`Unknown question ${q.id}`);
        expect(q.options).not.toEqual(source.options);
        expect(q.options[q.answer]).toBe(source.options[source.answer]);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
      expect(first).toEqual(firstSnapshot);
      expect(QUESTIONS).toEqual(original);
    }
  });

  it("scores shuffled answers correctly across every topic", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const qs = buildQuiz(null);
    expect(scoreByTopic(qs, qs.map((q) => q.answer))).toEqual(
      TOPICS.map((topic) => ({ topic, correct: 4, total: 4, pct: 100 })),
    );
    expect(scoreByTopic(qs, qs.map((q) => (q.answer + 1) % q.options.length))).toEqual(
      TOPICS.map((topic) => ({ topic, correct: 0, total: 4, pct: 0 })),
    );
  });
});
