# NextLap — Athlete Career & Financial Resilience Demo

A full-stack hackathon prototype for Udbhav 2026.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- API: REST
- Storage: in-memory demo repository (replaceable with PostgreSQL/Prisma)
- No external API key is required for the demo.

## Features
- Personalized athlete onboarding with interests, self-identified skills, career goals and financial literacy signals
- Interactive Skill Passport with explanations and strengthening actions
- Personalized Career Radar with transferable-skill matches and skill gaps
- Curated course recommendations using verified Microsoft Learn, Coursera, Khan Academy, freeCodeCamp and Google learning URLs
- Course save/progress/completion tracking through the backend API
- English / हिंदी interface switch with translated navigation, onboarding, dashboard and empty-state copy
- Financial resilience assessment with educational modules and completion tracking
- Searchable, filterable demo Opportunity Board with save and applied states
- Personalized 90-day roadmap with checkable tasks
- Explore Demo Athlete flow for judges
- REST backend with Zod validation and service/repository separation
- Responsive modern sports-tech UI with progress states, toasts and expandable details

## Run

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

The frontend proxies `/api` to the backend.

No database or external API key is required for the demo. Athlete, course and opportunity state is held in backend memory and resets when the backend restarts; the service boundaries are ready for a PostgreSQL/Prisma repository when persistence beyond a demo session is needed.

## Host on Render

Push the `nextlap` folder to a GitHub repository, then create two Render services from the same repository:

### Backend Web Service

- Root Directory: `nextlap/backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variable: `PORT` is optional; Render supplies one automatically.

### Frontend Static Site

- Root Directory: `nextlap/frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com`

After the backend deploys, copy its public `onrender.com` URL into `VITE_API_URL` on the frontend service and redeploy the frontend. Vite embeds `VITE_*` variables at build time, so the frontend must be rebuilt after changing this value. Render supports monorepo root directories and static Vite sites; the API web service must listen on the platform-provided `PORT`.

## Demo API
- `GET /api/health`
- `GET /api/careers`
- `GET /api/opportunities`
- `GET /api/courses?career=sports-analytics`
- `GET /api/demo`
- `POST /api/athletes`
- `GET /api/athletes/:id/dashboard`
- `POST /api/athletes/:id/financial-check`
- `GET /api/athletes/:id/courses`
- `PATCH /api/athletes/:id/courses/:courseId/progress`
- `POST /api/athletes/:id/courses/:courseId/save`
- `POST /api/athletes/:id/opportunities/:opportunityId/save`
- `POST /api/athletes/:id/opportunities/:opportunityId/apply`
- `POST /api/athletes/:id/finance/modules/:moduleId`
- `POST /api/athletes/:id/roadmap`
- `PATCH /api/athletes/:id/roadmap/:taskId`

This is a hackathon demo. Production would add authentication, PostgreSQL/Prisma, verified athlete credentials, real employers/partners, and a secure financial-data model.
