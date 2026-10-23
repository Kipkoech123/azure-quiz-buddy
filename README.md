
# AZ-900 Quiz Buddy

> **Unofficial study tool.** Not affiliated with or endorsed by Microsoft. All questions are original and based on the public AZ-900 skills outline on Microsoft Learn.

Built by Bronson Kipkoech Kibichii, Tiffany Wanjiru and Alex Nyakundi Morwabe for the #1MillionDevs hackathon.

## Live demo

https://azure-skill-scout.lovable.app

## The problem

Many learners practise with questions but never find out *why* an answer is right or wrong. They memorise answers instead of understanding Azure, and they don't know if they're ready to sit the exam.

## The solution

AZ-900 Quiz Buddy is a quiz app that gives **instant feedback and a clear explanation for every answer**, organised by AZ-900 topic. At the end, it shows a score for each topic and a readiness level, so learners know what to revise next.

## Features

- 30 original questions across the three AZ-900 areas:
  - Cloud Concepts
  - Azure Architecture and Services
  - Azure Management and Governance
- Instant green/red feedback after every answer
- An explanation of why the right answer is right and why the others are wrong
- Real-life African examples (Nairobi, Lagos, Accra, Kampala) to make ideas easier to picture
- Score per topic and a readiness meter
- "Retry my weakest topic" button
- Mobile-friendly design

## Who it's for

Beginners preparing for the Microsoft Azure Fundamentals (AZ-900) exam, especially learners across Africa who want practice that teaches, not just tests.

## How it works

1. Pick a topic (or all topics).
2. Answer one question at a time.
3. See instantly if you were right, with an explanation.
4. Finish and see your score by topic and your readiness level.
5. Retry your weakest topic.

## Tools used

- Claude.ai: writing the question bank and the app prompt
- Lovable.dev: generating the app
- GitHub: version control and hosting the code

## Prompts used

The prompts used to build this project: 
### Prompt 1: Building the question bank (Claude.ai)

**Goal:** Get original, accurate, beginner-friendly questions that teach, not just test.

**What I asked:** Write 30 original AZ-900 questions, 10 for each of the three skills-outline areas (Cloud Concepts, Azure Architecture and Services, Azure Management and Governance). Each question needs 4 options, the correct answer, and an explanation of why it is right and why the others are wrong. Use simple language and real African examples where they fit. Do not copy real exam questions. Output as JSON.

**Result:** `az900-questions.json`, with fields for topic, question, options, answer and explanation.

### Prompt 2: Building the app (Lovable.dev)

**Goal:** Turn the question bank into a working quiz app without writing code by hand.

**What I asked:**

```
Build a mobile-friendly quiz web app called "AZ-900 Quiz Buddy" for learners preparing for Microsoft Azure Fundamentals.

Screens:
1. Home: short intro, a visible label "Unofficial study tool - not affiliated with Microsoft", and three topic cards plus an "All topics" button.
2. Quiz: one question at a time, a progress bar, four answer buttons. When the learner taps an answer, instantly show green for correct or red for wrong, reveal the explanation, then show a "Next" button.
3. Results: overall score, a score for each topic, and a readiness meter (80% or more = "Ready", 60-79% = "Almost there", below 60% = "Keep practising"). Name the weakest topic. Add a "Retry my weakest topic" button and a "Start over" button.

Rules: no Microsoft logos. Clean, friendly design, blue and white colours, large tap targets. Keep scores in local state, no login needed. Use the questions below as the data source.
```

**Why it worked:** It named every screen, described exactly what happens on each tap, set rules (no logos, unofficial label), and gave the data in a fixed format.

**Result:** A working app on the first attempt, published and mobile friendly.

### Follow-up prompts


- `Shuffle the order of the questions and the answer options every time a quiz starts.`
- `On the results screen, show a bar for each topic with its percentage, coloured green, orange or red.`
- `Add a short "How to use" note on the home screen and a footer saying "Unofficial study tool. Questions are original and based on the public AZ-900 skills outline."`

### Lessons learned

- Short, one-change-at-a-time prompts are easier to test and fix.
- Giving the AI tool structured data (JSON) saved time and avoided typing mistakes.
- Lovable also found and fixed a repeated-answer-text bug after I asked it to check the shuffle.
## Screenshots
**Home screen**
<img width="573" height="1280" alt="Image 2026-10-21 at 16 06 56" src="https://github.com/user-attachments/assets/cd8ea1ca-59c8-44cd-b046-d348c79e4d1a" />
**quiz with feedback**
<img width="573" height="1280" alt="Image 2026-10-21 at 16 06 57" src="https://github.com/user-attachments/assets/831bd588-c3c9-4af3-a7b9-84067d8958d5" />
**results**
<img width="720" height="1600" alt="Image 2026-10-21 at 16 06 54" src="https://github.com/user-attachments/assets/e191bf9c-6910-463e-916f-eecd5af82272" />
*results screen with the coloured bars*
<img width="716" height="1600" alt="WhatsApp Image 2026-10-22 at 16 42 34" src="https://github.com/user-attachments/assets/b36483a1-359d-47a4-a049-e2b7338fd431" />










## Roadmap

- Add more questions for every skills-outline topic
- Add flashcards for the questions a learner keeps getting wrong
- Reuse the same engine for other certifications (AZ-104, AI-900)

## Disclaimer

This is an unofficial learning project. It does not contain real exam questions or Microsoft logos. Questions were drafted with AI assistance and written from the public AZ-900 skills outline, so learners should confirm details against Microsoft Learn.
