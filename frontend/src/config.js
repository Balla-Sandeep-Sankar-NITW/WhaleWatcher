/**
 * Centralized frontend configuration.
 *
 * Vite only exposes env vars prefixed with `VITE_` to client code, and only
 * ones actually present in `.env` (copy `.env.example` to get started).
 * Import `config` from this file instead of touching `import.meta.env`
 * directly elsewhere.
 */

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const env = import.meta.env;

const config = {
  // Leave empty to use the current origin (works with the Vite dev proxy
  // and with same-origin production deployments). Set to a full URL like
  // https://api.example.com to point at a separately hosted backend.
  apiBaseUrl: env.VITE_API_BASE_URL || "",
  socketUrl: env.VITE_SOCKET_URL || "",

  appName: env.VITE_APP_NAME || "Whale Watcher",
  coinSymbol: env.VITE_COIN_SYMBOL || "BTC/USDT",

  whaleThresholdUsd: toNumber(env.VITE_WHALE_THRESHOLD_USD, 500000),
  maxTradesInMemory: toNumber(env.VITE_MAX_TRADES_IN_MEMORY, 100),
  chartWindowSize: toNumber(env.VITE_CHART_WINDOW_SIZE, 60),
  whaleAlertDisplayMs: toNumber(env.VITE_WHALE_ALERT_DISPLAY_MS, 4000),
};

export default config;
