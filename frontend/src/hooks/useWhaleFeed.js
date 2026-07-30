import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import config from "../config";

/**
 * Owns the socket.io connection, the live trade feed, whale alerts, and
 * the CoinGecko snapshot. Kept as a single hook so App.jsx stays a plain
 * layout component.
 */
export default function useWhaleFeed() {
  const [isConnected, setIsConnected] = useState(false);
  const [feedConnected, setFeedConnected] = useState(false);
  const [trades, setTrades] = useState([]);
  const [whaleAlerts, setWhaleAlerts] = useState([]);
  const [whaleCount, setWhaleCount] = useState(0);
  const [latestAlert, setLatestAlert] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [coinError, setCoinError] = useState(null);

  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${config.apiBaseUrl}/api/coin-info`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCoinData(data);
      })
      .catch((err) => {
        if (!cancelled) setCoinError(err.message);
      });

    const socket = io(config.socketUrl || undefined, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => setIsConnected(false));

    socket.on("initData", (payload) => {
      if (Array.isArray(payload?.recentTrades)) {
        setTrades(payload.recentTrades);
      }
      if (typeof payload?.feedConnected === "boolean") {
        setFeedConnected(payload.feedConnected);
      }
    });

    socket.on("feedStatus", (status) => {
      setFeedConnected(Boolean(status?.connected));
    });

    socket.on("trade", (trade) => {
      setTrades((prev) => {
        const next = [...prev, trade];
        return next.slice(-config.maxTradesInMemory);
      });
    });

    socket.on("whaleAlert", (alert) => {
      setWhaleAlerts((prev) => [alert, ...prev].slice(0, 10));
      setWhaleCount((prev) => prev + 1);
      setLatestAlert(alert);

      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => {
        setLatestAlert(null);
      }, config.whaleAlertDisplayMs);
    });

    return () => {
      cancelled = true;
      clearTimeout(alertTimeoutRef.current);
      socket.disconnect();
    };
  }, []);

  const dismissLatestAlert = useCallback(() => {
    clearTimeout(alertTimeoutRef.current);
    setLatestAlert(null);
  }, []);

  return {
    isConnected,
    feedConnected,
    trades,
    whaleAlerts,
    whaleCount,
    latestAlert,
    dismissLatestAlert,
    coinData,
    coinError,
  };
}
