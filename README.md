# Azure Quiz Buddy

Build a mobile-friendly quiz web app called "AZ-900 Quiz Buddy" for learners preparing for Microsoft Azure Fundamentals.

Screens:

1. Home: short intro, a visible label "Unofficial study tool - not affiliated with Microsoft", and three topic cards (Cloud Concepts, Azure Architecture and Services, Azure Management and Governance) plus an "All topics" button.

2. Quiz: one question at a time, a progress bar ("Question 3 of 10"), four answer buttons. When the learner taps an answer, instantly show green for correct or red for wrong, reveal the explanation, then show a "Next" button.

3. Results: overall score, a score for each topic, and a readiness meter: 80% or more = "Ready", 60-79% = "Almost there", below 60% = "Keep practising". Name the weakest topic. Add a "Retry my weakest topic" button and a "Start over" button.

Rules: no Microsoft logos. Use a clean, friendly design with a blue and white colour scheme and large tap targets. Keep scores in local state, no login needed. Use the questions below as the data source (fields: id, topic, question, options, answer = index of correct option, explanation).

QUESTIONS JSON:

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c192620c-ea48-45a2-942c-669cdaebff67).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
