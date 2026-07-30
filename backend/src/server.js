const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const axios = require("axios");
const cors = require("cors");

const config = require("./config");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory trade store
// ---------------------------------------------------------------------------
let recentTrades = [];

function addTrade(trade) {
  recentTrades.push(trade);
  if (recentTrades.length > config.maxStoredTrades) {
    recentTrades.shift();
  }
}

// ---------------------------------------------------------------------------
// Binance WebSocket feed, with automatic reconnect + exponential backoff
// ---------------------------------------------------------------------------
let binanceWS = null;
let reconnectAttempt = 0;
let reconnectTimer = null;

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

function connectToBinance() {
  binanceWS = new WebSocket(config.binanceWsUrl);

  binanceWS.on("open", () => {
    reconnectAttempt = 0;
    log("Connected to Binance WebSocket feed");
    io.emit("feedStatus", { connected: true });
  });

  binanceWS.on("message", (data) => {
    try {
      const trade = JSON.parse(data);
      const price = parseFloat(trade.p);
      const quantity = parseFloat(trade.q);

      if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
        log("Skipping malformed trade payload");
        return;
      }

      const value = price * quantity;
      const isWhale = value >= config.whaleThresholdUsd;

      const enrichedTrade = {
        ...trade,
        valueUSD: value,
        isWhale,
      };

      addTrade({
        time: new Date(trade.T).toLocaleTimeString(),
        price,
        volume: quantity,
        value,
      });

      io.emit("trade", enrichedTrade);

      if (isWhale) {
        const alert = {
          price,
          quantity,
          value,
          timestamp: new Date(trade.T).toLocaleTimeString(),
          side: trade.m ? "SELL" : "BUY",
        };
        log(`WHALE ALERT: $${value.toLocaleString()} ${alert.side} trade detected`);
        io.emit("whaleAlert", alert);
      }
    } catch (error) {
      log("Error processing trade message:", error.message);
    }
  });

  binanceWS.on("error", (error) => {
    log("Binance WebSocket error:", error.message);
  });

  binanceWS.on("close", () => {
    io.emit("feedStatus", { connected: false });
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer);
  const delay = Math.min(
    config.binanceReconnectDelayMs * 2 ** reconnectAttempt,
    config.binanceMaxReconnectDelayMs
  );
  reconnectAttempt += 1;
  log(`Binance WebSocket closed. Reconnecting in ${delay}ms...`);
  reconnectTimer = setTimeout(connectToBinance, delay);
}

connectToBinance();

// ---------------------------------------------------------------------------
// REST API
// ---------------------------------------------------------------------------

// Simple in-memory cache so we don't hammer CoinGecko on every page load.
let coinInfoCache = { data: null, fetchedAt: 0 };

app.get("/api/coin-info", async (req, res) => {
  const isFresh = Date.now() - coinInfoCache.fetchedAt < config.coinInfoCacheMs;
  if (coinInfoCache.data && isFresh) {
    return res.json(coinInfoCache.data);
  }

  try {
    const response = await axios.get(
      `${config.coinGeckoBaseUrl}/coins/${config.coinId}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
        headers: config.coinGeckoApiKey
          ? { "x-cg-demo-api-key": config.coinGeckoApiKey }
          : undefined,
        timeout: 8000,
      }
    );

    const payload = {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      image: response.data.image?.large,
      current_price: response.data.market_data?.current_price?.usd,
      market_cap: response.data.market_data?.market_cap?.usd,
      price_change_24h: response.data.market_data?.price_change_24h,
      price_change_percentage_24h:
        response.data.market_data?.price_change_percentage_24h,
    };

    coinInfoCache = { data: payload, fetchedAt: Date.now() };
    res.json(payload);
  } catch (error) {
    log("CoinGecko API error:", error.message);
    // Serve stale cache rather than nothing, if we have it.
    if (coinInfoCache.data) {
      return res.json(coinInfoCache.data);
    }
    res.status(502).json({ error: "Failed to fetch coin data" });
  }
});

app.get("/api/recent-trades", (req, res) => {
  res.json(recentTrades.slice(-config.recentTradesResponseLimit));
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    binanceConnected: binanceWS?.readyState === WebSocket.OPEN,
    uptimeSeconds: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// Socket.io
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  log("Client connected:", socket.id);
  socket.emit("initData", {
    message: "Connected to Whale Watcher",
    recentTrades: recentTrades.slice(-20),
    feedConnected: binanceWS?.readyState === WebSocket.OPEN,
  });

  socket.on("disconnect", () => {
    log("Client disconnected:", socket.id);
  });
});

// ---------------------------------------------------------------------------
// Error handling & startup
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

server.listen(config.port, () => {
  log(`Server running on port ${config.port} (${config.nodeEnv})`);
});

function shutdown() {
  log("Shutting down gracefully...");
  clearTimeout(reconnectTimer);
  binanceWS?.close();
  server.close(() => process.exit(0));
  // Force-exit if close hangs.
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
