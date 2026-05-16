# BlueAnt

Strategy-led brand building application for the BlueAnt website and admin operating system.

## What is included

- Public brand site with animated entry, service sections, work gallery, testimonials, blog route, contact form, and sticky CTA.
- Firebase-backed admin area at `/admin` for dashboard, leads, calendar, content, analytics, team, and settings.
- Firestore security rules and Firebase applet configuration from the original export.
- Production build output in `dist/` after running the build.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run build
```

## Environment

The app reads Firebase settings from `firebase-applet-config.json`. If Gemini API usage is added later, create `.env.local` from `.env.example` and set `GEMINI_API_KEY`.
