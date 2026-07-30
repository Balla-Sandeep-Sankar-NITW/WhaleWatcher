import { useMemo } from "react";
import config from "../config";

export default function TickerTape({ trades }) {
  const recent = useMemo(() => trades.slice(-24), [trades]);

  if (recent.length < 2) {
    return (
      <div
        role="status"
        aria-label="Live price ticker, waiting for trades"
        className="flex h-9 items-center overflow-hidden border-y border-white/[0.05] bg-abyss-900/60 px-4"
      >
        <span className="animate-pulse-slow font-mono text-2xs tracking-wide text-ink-600">
          Waiting for live {config.coinSymbol} trades to populate the tape…
        </span>
      </div>
    );
  }

  const items = recent.map((t, i) => {
    const price = parseFloat(t.p);
    const prevPrice = i > 0 ? parseFloat(recent[i - 1].p) : price;
    const up = price >= prevPrice;
    return { key: `${t.T}-${i}`, price, up };
  });
  const loop = [...items, ...items];

  return (
    <div
      role="status"
      aria-label={`Live ${config.coinSymbol} price ticker`}
      className="group h-9 overflow-hidden border-y border-white/[0.05] bg-abyss-900/60"
    >
      <div className="flex h-full w-max animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
        {loop.map((item, idx) => (
          <span
            key={`${item.key}-${idx}`}
            className={`mx-4 inline-flex items-center gap-1.5 font-mono text-2xs tabular-nums ${
              item.up ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <span aria-hidden="true">{item.up ? "▲" : "▼"}</span>
            {config.coinSymbol.split("/")[0]} ${item.price.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
