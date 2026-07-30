# 🐋 Whale Watcher

Real-time BTC/USDT institutional trade detection. A Node.js/Socket.io backend
streams trades from Binance and flags "whale" trades over a configurable
USD threshold; a React + Tailwind frontend visualizes the feed live.

```
WhaleWatcher/
├── backend/     Express + Socket.io + Binance WebSocket bridge
└── frontend/    React + Vite + Tailwind dashboard
```

## Quick start

You need two terminals — one for each service.

### 1. Backend

```bash
cd backend
cp .env.example .env   # adjust values if needed
npm install
npm run dev             # nodemon, restarts on change
# or: npm start
```

Runs on `http://localhost:3000` by default.

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # adjust values if needed
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` and `/socket.io` to the
backend (see `VITE_DEV_PROXY_TARGET` in `frontend/.env`).

Open `http://localhost:5173` in your browser.

## Configuration

Every environment-specific value — ports, URLs, thresholds, CORS origins —
lives in a `.env` file per service, never hard-coded in source. Each folder
ships a documented `.env.example`; copy it to `.env` and edit freely.

- `backend/.env.example` → `backend/.env`
  Read centrally by `backend/src/config.js`. Covers the server port, CORS
  origins, the Binance WebSocket URL and reconnect timing, the CoinGecko
  base URL/cache duration/API key, the whale-alert threshold, and how many
  trades to keep in memory.

- `frontend/.env.example` → `frontend/.env`
  Read centrally by `frontend/src/config.js` (via Vite's `import.meta.env`,
  so variables must be prefixed `VITE_`). Covers the API/socket base URLs
  (leave blank to use the dev proxy / same-origin deploy), branding text,
  the whale-alert threshold (keep in sync with the backend), and chart/
  toast tuning.

Neither `.env` file is committed — only the `.env.example` templates are.
Nothing else in either codebase reads `process.env` / `import.meta.env`
directly; everything imports the shared `config` object instead, so there's
one place to look for every tunable value.

## What changed from the original version

- **Config files** — introduced `backend/src/config.js` and
  `frontend/src/config.js`, backed by `.env.example` templates, so ports,
  URLs, CORS origins, and thresholds are no longer hard-coded.
- **Resilience** — the backend now auto-reconnects to Binance with
  exponential backoff, caches CoinGecko responses to avoid rate limits,
  validates incoming trade payloads, exposes `/api/health`, and shuts down
  gracefully on `SIGINT`/`SIGTERM`.
- **Bug fixes** — the price chart used to derive new state from a stale
  closure over `chartData`; it's now computed with `useMemo` straight from
  the trade list.
- **Code structure** — the ~700-line single-file frontend is now split into
  a `useWhaleFeed` hook plus focused components (`Header`, `StatsGrid`,
  `PriceChart`, `TradesTable`, `WhaleAlerts`, `WhaleAlertToast`,
  `SystemStatus`, `HowItWorks`, `Footer`).
- **UI** — rebuilt with Tailwind CSS around a dark "abyssal trading
  terminal" theme (deep-navy panels, cyan data accents, gold whale-alert
  accents, monospace figures), with a sonar-ping logo animation, live
  connection badges for both the server and the Binance feed, a dismissible
  toast for new whale alerts, and a responsive layout down to mobile.

## Production build

```bash
cd frontend
npm run build      # outputs to frontend/dist
```

Serve `frontend/dist` from any static host, and point
`VITE_API_BASE_URL` / `VITE_SOCKET_URL` at your deployed backend if it
isn't on the same origin.
