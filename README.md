# AudioConvert Pro

A modern, production-ready web application that converts user-uploaded MP4 videos into MP3 audio files. Built with a premium glassmorphism UI, dark/light mode, and a secure Node.js/FFmpeg backend.

> AudioConvert Pro only ever processes files a user explicitly uploads. It does not download or extract media from YouTube or any other third-party platform.

![Tech](https://img.shields.io/badge/frontend-React%20%2B%20Vite%20%2B%20TypeScript-7C5CFF)
![Tech](https://img.shields.io/badge/backend-Node.js%20%2B%20Express%20%2B%20FFmpeg-4FD8E5)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- Drag & drop and click-to-browse MP4 upload
- Batch/queue conversion of multiple files at once
- Selectable output quality: 128 / 192 / 256 / 320 kbps
- Live upload and conversion progress with cancel support
- Automatic, scheduled cleanup of temporary files on the server
- Toast notifications for success, error, and status changes
- Full dark mode / light mode with system preference detection
- Fully responsive, accessible (WCAG-conscious) UI with visible focus states
- SEO-friendly landing page (meta tags, semantic HTML, `robots.txt`)
- Code-split, lazy-loaded routes for fast initial load

## Tech Stack

**Frontend:** React 18 (Vite), TypeScript, Tailwind CSS, Framer Motion, React Icons, React Dropzone, React Hot Toast, Axios, React Router

**Backend:** Node.js, Express, Multer, fluent-ffmpeg + ffmpeg-static, Helmet, express-rate-limit, node-cron

## Project Structure

```
audioconvert-pro/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI building blocks
│   │   ├── pages/          # Route-level pages (Home, Convert, Features, About, 404)
│   │   ├── layouts/        # Page shell (Navbar + Footer wrapper)
│   │   ├── hooks/          # useConversion (upload/convert/poll state machine)
│   │   ├── services/       # API client (axios wrapper)
│   │   ├── utils/          # Formatters & client-side validators
│   │   ├── context/        # Theme (dark/light) context
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   └── package.json
└── backend/
    ├── routes/              # upload, convert, download, delete, status
    ├── middleware/          # error handling, rate limiting, file validation
    ├── utils/               # ffmpegService, fileCleanup
    ├── uploads/             # temporary storage for incoming MP4s
    ├── converted/           # temporary storage for output MP3s
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

FFmpeg itself does **not** need to be installed system-wide — the `ffmpeg-static` package bundles a compatible binary automatically.

### 1. Clone and install

```bash
git clone <your-repo-url> audioconvert-pro
cd audioconvert-pro

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Run in development

In one terminal:

```bash
cd backend
npm run dev        # starts the API on http://localhost:5000
```

In another terminal:

```bash
cd frontend
npm run dev         # starts the app on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

### 3. Production build (frontend)

```bash
cd frontend
npm run build        # outputs to frontend/dist
npm run preview      # preview the production build locally
```

### 4. Production start (backend)

```bash
cd backend
npm start
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `CLIENT_URL` | Comma-separated list of allowed CORS origins | `http://localhost:5173` |
| `MAX_UPLOAD_SIZE_MB` | Maximum upload size per file | `500` |
| `ALLOWED_MIME_TYPES` | Comma-separated accepted MIME types | `video/mp4` |
| `ALLOWED_EXTENSIONS` | Comma-separated accepted extensions | `.mp4` |
| `UPLOAD_DIR` / `CONVERTED_DIR` | Storage folder names (relative to `backend/`) | `uploads` / `converted` |
| `FILE_RETENTION_MINUTES` | How long files are kept before auto-deletion | `60` |
| `CLEANUP_INTERVAL_MINUTES` | How often the cleanup job runs | `15` |
| `RATE_LIMIT_WINDOW_MINUTES` / `RATE_LIMIT_MAX_REQUESTS` | API rate limiting | `15` / `100` |
| `DEFAULT_AUDIO_BITRATE` | Fallback bitrate if none supplied | `192` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API (include `/api`) | `http://localhost:5000/api` |

## API Reference

All responses are JSON with a `success: boolean` field.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload one or more MP4 files (`files` form field). Returns job metadata. |
| `POST` | `/api/convert` | Body: `{ jobId, bitrate, metadata? }`. Starts async conversion, returns `202`. |
| `POST` | `/api/convert/:id/cancel` | Cancels an in-progress conversion. |
| `GET` | `/api/status/:id` | Returns current job status/progress for polling. |
| `GET` | `/api/download/:filename` | Streams the converted MP3 for download. |
| `DELETE` | `/api/delete/:filename` | Deletes an uploaded or converted file immediately. |

## Security

- MIME type **and** file extension are both validated server-side
- Filenames are sanitized and namespaced with a UUID to prevent collisions and path traversal
- Downloads and deletes resolve paths and confirm they stay within the storage directory
- Helmet sets standard security headers; CORS is restricted to configured origins
- Rate limiting on all `/api/*` routes
- Uploads are capped by size; files are automatically purged on a schedule
- All configuration lives in environment variables, never hardcoded

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Vercel, **New Project** → import the repo, set the **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add an environment variable `VITE_API_URL` pointing to your deployed backend, e.g. `https://your-backend.onrender.com/api`.
5. Deploy.

### Backend → Render

1. In Render, **New** → **Web Service** → connect your repo, set **Root Directory** to `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add the environment variables from `backend/.env.example` (at minimum set `CLIENT_URL` to your Vercel frontend URL).
4. Because Render's filesystem is ephemeral, keep `FILE_RETENTION_MINUTES` low — files are meant to be temporary regardless of host.
5. Deploy, then copy the resulting URL into the frontend's `VITE_API_URL` (with `/api` appended) and redeploy the frontend.

## License

This project is provided as a starting point for your own deployment. Add a license of your choice before distributing.
