# VIDEO MIND AI

A modern AI video generation platform starter for creating long-form video projects with a Hebrew/English RTL interface and modular AI engine architecture.

## Features
- Hero landing page and project dashboard
- Hebrew/English UI toggle with RTL support
- AI generation form for prompt, duration, style, language, voice, quality, aspect ratio
- Project library and project editor
- Scene timeline tools: add, delete, reorder, cut, replace soundtrack, adjust narration
- File download controls with clear gating when no output asset exists
- Server-side API structure for generation, project CRUD, and health checks
- Environment-based provider configuration for future AI engines

## Stack
- Next.js 14
- React 18
- TypeScript
- App Router
- Local file-backed project store for a simple working MVP

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Environment configuration

The app is designed to work with real AI providers as soon as API keys are configured.

```env
NEXT_PUBLIC_APP_NAME=VIDEOMIND AI
NEXT_PUBLIC_DEFAULT_LANGUAGE=he
VIDEOMIND_PROVIDER=none
VIDEOMIND_API_KEY=
VIDEOMIND_MODEL=
VIDEOMIND_API_URL=
```

Set `VIDEOMIND_PROVIDER` to a real provider name such as `replicate`, `openai`, or `runway` when you are ready to connect a production engine.

If no API key is present, the app intentionally shows a clear configuration notice instead of pretending a video was generated.

## Important note

This repository contains the full source code for the product interface and architecture, but it does not include a secret third-party API key. To generate actual videos in production, you must connect a real AI video provider and store the credentials securely in environment variables.

## Scripts

- `npm run dev` — start local development server
- `npm run build` — build production bundle
- `npm run start` — run production server
- `npm run lint` — lint the project

## Project structure

```text
app/
  api/
    generate/
    health/
    projects/
    projects/[id]/
  globals.css
  layout.tsx
  page.tsx
components/
  video-studio.tsx
lib/
  pipeline.ts
  store.ts
  types.ts
```

## Production recommendation

For a production deployment, replace the local file-backed project store with Postgres or a managed database, and move long-running video jobs into a queue system such as Redis + BullMQ or a cloud task worker.
