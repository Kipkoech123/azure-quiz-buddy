import raw from "@/data/questions.json";

export type Question = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const QUESTIONS = raw as Question[];
export const TOPICS = [
  "Cloud Concepts",
  "Azure Architecture and Services",
  "Azure Management and Governance",
] as const;

export type Readiness = "Ready" | "Almost there" | "Keep practising";

export function readiness(pct: number): Readiness {
  if (pct >= 80) return "Ready";
  if (pct >= 60) return "Almost there";
  return "Keep practising";
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = r[i];
    const target = r[j];
    if (current === undefined || target === undefined) continue;
    [r[i], r[j]] = [target, current];
  }
  return r;
}

/** Shuffle a question's options and remap the answer index so it stays correct. */
export function shuffleOptions(q: Question): Question {
  const indexedOptions = shuffle(q.options.map((text, index) => ({ text, index })));
  return {
    ...q,
    options: indexedOptions.map((option) => option.text),
    answer: indexedOptions.findIndex((option) => option.index === q.answer),
  };
}

/** Topic quiz: up to 10 questions from that topic. All topics: 4 from each, mixed. Questions and options are shuffled every time. */
export function buildQuiz(topic: string | null): Question[] {
  const picked = topic
    ? shuffle(QUESTIONS.filter((q) => q.topic === topic)).slice(0, 10)
    : shuffle(TOPICS.flatMap((t) => shuffle(QUESTIONS.filter((q) => q.topic === t)).slice(0, 4)));
  return picked.map(shuffleOptions);
}

export type TopicScore = { topic: string; correct: number; total: number; pct: number };

export function scoreByTopic(qs: Question[], picks: number[]): TopicScore[] {
  const map = new Map<string, TopicScore>();
  qs.forEach((q, i) => {
    const s = map.get(q.topic) ?? { topic: q.topic, correct: 0, total: 0, pct: 0 };
    s.total++;
    if (picks[i] === q.answer) s.correct++;
    map.set(q.topic, s);
  });
  return TOPICS.filter((t) => map.has(t)).map((t) => {
    const s = map.get(t)!;
    return { ...s, pct: Math.round((s.correct / s.total) * 100) };
  });
}

export function weakestTopic(scores: TopicScore[]): string | null {
  if (!scores.length) return null;
  return scores.reduce((a, b) => (b.pct < a.pct ? b : a)).topic;
}

/** Bar colour for a topic score: green 80+, orange 60-79, red below 60. */
export function scoreTone(pct: number): string {
  const level = readiness(pct);
  return level === "Ready" ? "bg-success" : level === "Almost there" ? "bg-warning" : "bg-destructive";
}
