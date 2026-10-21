# Remotion Video SaaS

AI-driven video generation platform: a Next.js creator studio, a Remotion render
engine, and a FastAPI backend for transcription and video processing.

## Repository layout

| Path            | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `frontend/`     | Next.js 16 app — creator studio, dashboard, template marketplace   |
| `video-engine/` | Remotion compositions (Explainer) and render scripts                |
| `backend/`      | FastAPI service — video and transcription APIs, SQLAlchemy models   |
| `schema.prisma` | Prisma schema for users, teams, projects, renders, assets, webhooks |

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv/Scripts/activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # then fill in real values
uvicorn app.main:app --reload
```

`.env` is gitignored. `backend/.env.example` is committed and contains placeholders
only — it must never contain real credentials.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Video engine

```bash
cd video-engine
npm install
npm run preview                # interactive preview
npm run render                 # renders Explainer to out.mp4
npm run typecheck
```

## Rendered and source media that is not committed

Large binaries are excluded to keep the repository small and within GitHub's
per-file size limit. Restore them locally before rendering:

| Path                                                    | Size    | Notes                          |
| ------------------------------------------------------- | ------- | ------------------------------ |
| `sample1.mp4`, `sample2.mp4`, `sample3.mp4`             | 13/10/95 MB | Duplicates of the files below |
| `video-engine/public/sample1.mp4` … `sample3.mp4`       | as above | Used by `VideoComparisonScene` |
| `video-engine/out/`                                     | ~270 MB  | Render output, regenerated      |
| `video-engine/out.mp4`, `video-engine/out_dynamic.mp4` | ~29 MB   | Render output, regenerated      |

The image and audio assets under `frontend/public/` and `video-engine/public/`
**are** committed, since the compositions reference them directly.

## Security notes

- `.env`, `*.pem`, `*.key`, `*.p12` and similar are gitignored. Use
  `backend/.env.example` to document required variables.
- `schema.prisma` reads the database URL from `env("DATABASE_URL")` — no
  credentials are stored in the schema.
- Keep real credentials out of committed files. Rotate any credential that has
  ever been committed or shared.
