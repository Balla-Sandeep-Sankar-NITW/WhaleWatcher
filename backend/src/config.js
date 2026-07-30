/**
 * Centralized backend configuration.
 *
 * All environment-specific values live in `.env` (copy `.env.example` to
 * get started). Nothing else in the codebase should read `process.env`
 * directly — import `config` instead so every value has a single,
 * documented source of truth and a safe default.
 */

require("dotenv").config();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value, fallback) {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const config = {
  // Server
  port: toNumber(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV || "development",

  // CORS — comma separated list of allowed origins, e.g.
  // CORS_ORIGIN=http://localhost:5173,https://mysite.com
  corsOrigins: toList(process.env.CORS_ORIGIN, ["http://localhost:5173"]),

  // Binance
  binanceWsUrl:
    process.env.BINANCE_WS_URL || "wss://stream.binance.com:9443/ws/btcusdt@trade",
  binanceReconnectDelayMs: toNumber(process.env.BINANCE_RECONNECT_DELAY_MS, 3000),
  binanceMaxReconnectDelayMs: toNumber(
    process.env.BINANCE_MAX_RECONNECT_DELAY_MS,
    30000
  ),

  // CoinGecko
  coinGeckoBaseUrl: process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3",
  coinId: process.env.COIN_ID || "bitcoin",
  coinInfoCacheMs: toNumber(process.env.COIN_INFO_CACHE_MS, 30000),
  coinGeckoApiKey: process.env.COINGECKO_API_KEY || "",

  // App behaviour
  whaleThresholdUsd: toNumber(process.env.WHALE_THRESHOLD_USD, 500000),
  maxStoredTrades: toNumber(process.env.MAX_STORED_TRADES, 100),
  recentTradesResponseLimit: toNumber(process.env.RECENT_TRADES_RESPONSE_LIMIT, 50),
};

module.exports = config;
