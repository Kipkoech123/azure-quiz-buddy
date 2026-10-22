import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cloud, Layers, ShieldCheck, Sparkles, Check, X, ArrowRight, RotateCcw, Target } from "lucide-react";
import { buildQuiz, readiness, scoreByTopic, scoreTone, weakestTopic, TOPICS, type Question } from "@/lib/quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AZ-900 Quiz Buddy — Azure Fundamentals practice" },
      { name: "description", content: "Free, friendly practice quizzes for the AZ-900 Azure Fundamentals exam, with instant feedback and topic scores." },
      { property: "og:title", content: "AZ-900 Quiz Buddy" },
      { property: "og:description", content: "Practise AZ-900 topics with instant feedback and a readiness meter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

const ICONS = [Cloud, Layers, ShieldCheck];

const HOW_TO = [
  "Pick a topic, or choose All topics for a mixed quiz.",
  "Tap an answer, then read the explanation that appears.",
  "Check your results and retry your weakest topic.",
];

type State =
  | { screen: "home" }
  | { screen: "quiz"; qs: Question[]; i: number; picks: number[] }
  | { screen: "results"; qs: Question[]; picks: number[] };

function App() {
  const [s, setS] = useState<State>({ screen: "home" });
  const start = (topic: string | null) => setS({ screen: "quiz", qs: buildQuiz(topic), i: 0, picks: [] });
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-8">
        <div className="flex-1">
          {s.screen === "home" && <Home onStart={start} />}
          {s.screen === "quiz" && (
            <Quiz
              key={s.i}
              q={s.qs[s.i]!}
              n={s.i + 1}
              total={s.qs.length}
              onPick={(p) => setS({ ...s, picks: [...s.picks, p] })}
              onNext={() =>
                s.i + 1 < s.qs.length
                  ? setS({ ...s, i: s.i + 1 })
                  : setS({ screen: "results", qs: s.qs, picks: s.picks })
              }
            />
          )}
          {s.screen === "results" && (
            <Results qs={s.qs} picks={s.picks} onRetry={start} onHome={() => setS({ screen: "home" })} />
          )}
        </div>
        <footer className="mt-10 border-t pt-5 text-center text-xs leading-relaxed text-muted-foreground">
          Unofficial study tool. Questions are original and based on the public AZ-900 skills outline.
        </footer>
      </div>
    </main>
  );
}

function Home({ onStart }: { onStart: (t: string | null) => void }) {
  return (
    <div className="space-y-6">
      <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
        Unofficial study tool - not affiliated with Microsoft
      </span>
      <div>
        <h1 className="font-display text-4xl font-bold text-foreground">AZ-900 Quiz Buddy</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bite-sized practice for Azure Fundamentals. Pick a topic, get instant feedback, and see how ready you are.
        </p>
      </div>
      <div className="space-y-3">
        {TOPICS.map((t, idx) => {
          const Icon = ICONS[idx] ?? Cloud;
          return (
            <button key={t} onClick={() => onStart(t)} className="tap-card group">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-6" />
              </span>
              <span className="flex-1 text-left">
                <span className="block text-lg font-semibold text-foreground">{t}</span>
                <span className="text-sm text-muted-foreground">10 questions</span>
              </span>
              <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
            </button>
          );
        })}
      </div>
      <button onClick={() => onStart(null)} className="btn-primary w-full">
        <Sparkles className="size-5" /> All topics
      </button>
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-display text-lg font-bold text-foreground">How to use</h2>
        <ol className="mt-3 space-y-3">
          {HOW_TO.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Quiz({ q, n, total, onPick, onNext }: { q: Question; n: number; total: number; onPick: (p: number) => void; onNext: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const done = pick !== null;
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex justify-between text-sm font-medium text-muted-foreground">
          <span>Question {n} of {total}</span>
          <span className="text-primary">{q.topic}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(n / total) * 100}%` }} />
        </div>
      </div>
      <h2 className="text-xl font-semibold leading-snug text-foreground">{q.question}</h2>
      <div className="space-y-3">
        {q.options.map((o, i) => {
          const state = !done ? "idle" : i === q.answer ? "correct" : i === pick ? "wrong" : "dim";
          return (
            <button
              key={i}
              disabled={done}
              onClick={() => { setPick(i); onPick(i); }}
              className="answer"
              data-state={state}
            >
              <span className="flex-1 text-left">{o}</span>
              {state === "correct" && <Check className="size-5" />}
              {state === "wrong" && <X className="size-5" />}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
          <div className="rounded-2xl border bg-card p-4">
            <p className={`font-semibold ${pick === q.answer ? "text-success" : "text-destructive"}`}>
              {pick === q.answer ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1 text-muted-foreground">{q.explanation}</p>
          </div>
          <button onClick={onNext} className="btn-primary w-full">
            {n < total ? "Next" : "See results"} <ArrowRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function Results({ qs, picks, onRetry, onHome }: { qs: Question[]; picks: number[]; onRetry: (t: string) => void; onHome: () => void }) {
  const correct = qs.filter((q, i) => picks[i] === q.answer).length;
  const pct = Math.round((correct / qs.length) * 100);
  const level = readiness(pct);
  const topics = scoreByTopic(qs, picks);
  const weak = weakestTopic(topics)!;
  const tone = scoreTone(pct);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-primary p-6 text-center text-primary-foreground shadow-elegant">
        <p className="text-sm opacity-80">Your score</p>
        <p className="font-display text-6xl font-bold">{pct}%</p>
        <p className="opacity-90">{correct} of {qs.length} correct</p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Readiness</span>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold text-primary-foreground ${tone}`}>{level}</span>
        </div>
        <div className="relative mt-4 h-3 rounded-full bg-gradient-to-r from-destructive via-warning to-success">
          <div className="absolute -top-1 size-5 -translate-x-1/2 rounded-full border-4 border-card bg-foreground" style={{ left: `${pct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>0</span><span>60</span><span>80</span><span>100</span></div>
      </div>
      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.topic} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{t.topic}</span>
              <span className="text-muted-foreground">{t.correct}/{t.total} · {t.pct}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
              <div className={`h-full rounded-full transition-all duration-500 ${scoreTone(t.pct)}`} style={{ width: `${t.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-muted-foreground">
        Weakest topic: <span className="font-semibold text-foreground">{weak}</span>
      </p>
      <div className="space-y-3">
        <button onClick={() => onRetry(weak)} className="btn-primary w-full"><Target className="size-5" /> Retry my weakest topic</button>
        <button onClick={onHome} className="btn-outline w-full"><RotateCcw className="size-5" /> Start over</button>
      </div>
    </div>
  );
}
