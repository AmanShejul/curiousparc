# CuriousPARC — Emergency Response Backend (MVP)

Drop-in backend for the Vite frontend. Vercel serverless functions in `/api`.

## What's here

| File | What it does |
|---|---|
| `api/_lib/types.ts` | **Frozen API contract** — share with frontend, don't rename fields |
| `api/_lib/mockData.ts` | Seed flood scenario (3 teams, 3 hospitals, 2 shelters, 2 roads) |
| `api/_lib/gemini.ts` | Gemini JSON-mode service, 8s timeout, throws on failure |
| `api/_lib/agents.ts` | **The 3 agents** (Risk, Resource & Routing, Planning) + orchestrator. Each agent has a real Gemini prompt AND a deterministic fallback — a failed AI call degrades the demo instead of killing it |
| `api/system.ts` | `GET /api/system` → initial state |
| `api/simulation.ts` | `POST /api/simulation` → applies event deterministically, runs full agent cycle, returns `{ state, plan, activityLog, degraded }` |

## Install into the repo

```bash
# from repo root (AmanShejul/curiousparc)
cp -r /path/to/this/api ./api
cp package.json vercel.json tsconfig.json .env.example ./
npm install          # installs @google/generative-ai + @vercel/node at root
```

> The repo already has `frontend/package.json` for the Vite app. The root
> `package.json` here is ONLY for the `/api` functions. Don't merge them.

## Environment

```bash
cp .env.example .env
# put your key in .env, and in Vercel dashboard -> Settings -> Environment Variables
```

No key? The agents run fully on deterministic fallbacks — the demo still works,
`degraded: true` is returned, and the timeline notes it. Get a key before demo
day for the real AI behavior.

## Test locally

```bash
npx vercel dev
curl localhost:3000/api/system
curl -X POST localhost:3000/api/simulation \
  -H 'Content-Type: application/json' \
  -d '{"event":"BLOCK_ROAD","roadId":"road-a","state":'"$(curl -s localhost:3000/api/system)"'}'
```

Expected: road-a BLOCKED, plan switches to Team 01/03 + Route B + lowest-burden
hospital, activity log narrates each agent.

## Demo flow (60 seconds)

1. `GET /api/system` → flood, Plan #1 (nearest team, Route A, Hospital B/C)
2. `POST /api/simulation` `{event:"BLOCK_ROAD", roadId:"road-a"}` → agents replan
3. Response shows new plan + `activityLog` → render old vs new + timeline
4. `{event:"HOSPITAL_OVERLOAD", hospitalId:"hosp-b"}` → proves multi-constraint adaptation

## Design notes (for the PPT)

- **Stateless API**: frontend holds state, sends it with each call. No database
  needed for the MVP; serverless functions can't hold memory anyway.
- **Deterministic event application**: the road/hospital/team change is applied in
  code, THEN agents replan from the mutated state — the replanning is genuine,
  not staged.
- **Gemini does reasoning only** (risk interpretation, trade-offs, explanations);
  TypeScript does distances, capacity, filtering. JSON schema enforced via
  `responseMimeType: "application/json"`.
- Risk + Resource agents run **in parallel**; Planning runs after. Full cycle
  stays under Vercel's 10s function limit.
