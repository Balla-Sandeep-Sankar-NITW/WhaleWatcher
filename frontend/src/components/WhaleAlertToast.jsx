import { useEffect, useState } from "react";
import { X } from "lucide-react";
import config from "../config";

export default function WhaleAlertToast({ alert, onDismiss }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!alert) return;
    setCollapsed(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setCollapsed(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [alert]);

  if (!alert) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] animate-slide-in"
    >
      <div className="overflow-hidden rounded-2xl border border-gold-glow/40 bg-abyss-800/95 shadow-glow-gold backdrop-blur">
        <div className="flex items-start gap-3 p-4">
          <span className="animate-float text-3xl leading-none" aria-hidden="true">🐋</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-bold text-gold-glow">Whale alert</h3>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss whale alert"
                className="rounded-md p-1 text-ink-500 transition-colors hover:bg-white/5 hover:text-ink-300"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">
              ${alert.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-0.5 text-2xs text-ink-500">
              {alert.quantity.toFixed(4)} BTC {alert.side} @ ${alert.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-0.5 w-full bg-white/[0.06]">
          <div
            className="h-full bg-gold-glow"
            style={{
              width: collapsed ? "0%" : "100%",
              transition: collapsed ? `width ${config.whaleAlertDisplayMs}ms linear` : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
