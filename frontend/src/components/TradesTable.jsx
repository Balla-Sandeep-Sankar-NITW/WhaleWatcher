import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function SkeletonRow() {
  return (
    <tr className="border-t border-white/[0.05]">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="skeleton h-3.5 w-full max-w-[6rem]" />
        </td>
      ))}
    </tr>
  );
}

export default function TradesTable({ trades }) {
  const rows = useMemo(() => trades.slice().reverse().slice(0, 12), [trades]);

  return (
    <section id="trades" className="panel scroll-mt-24 p-5" aria-label="Recent trades">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-title">Recent trades</h2>
        <span className="text-2xs text-ink-600">Showing latest {rows.length || "…"}</span>
      </div>

      {trades.length === 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-2xs uppercase tracking-wide text-ink-500">
                <th className="pb-3 pr-4 font-medium">Time</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Value</th>
                <th className="pb-3 font-medium">Side</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-auto rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-abyss-800/95 backdrop-blur">
              <tr className="text-2xs uppercase tracking-wide text-ink-500">
                <th className="pb-3 pr-4 pt-1 font-medium">Time</th>
                <th className="pb-3 pr-4 pt-1 font-medium">Price</th>
                <th className="pb-3 pr-4 pt-1 font-medium">Amount</th>
                <th className="pb-3 pr-4 pt-1 font-medium">Value</th>
                <th className="pb-3 pt-1 font-medium">Side</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((trade, index) => {
                const price = parseFloat(trade.p);
                const qty = parseFloat(trade.q);
                const value = price * qty;
                const isSell = Boolean(trade.m);

                return (
                  <tr
                    key={`${trade.T}-${index}`}
                    className={`group border-t border-white/[0.05] font-mono transition-colors hover:bg-white/[0.02] ${
                      trade.isWhale ? "bg-gold-glow/[0.04] animate-flash-gold" : ""
                    }`}
                  >
                    <td className="py-2.5 pr-4 tabular-nums text-ink-500">
                      {new Date(trade.T).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-300">${price.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-300">{qty.toFixed(4)} BTC</td>
                    <td
                      className={`py-2.5 pr-4 tabular-nums ${
                        trade.isWhale ? "font-semibold text-gold-glow" : "text-ink-300"
                      }`}
                    >
                      ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-2xs font-semibold ${
                          isSell
                            ? "bg-red-500/15 text-red-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {isSell ? (
                          <ArrowDownRight size={12} aria-hidden="true" />
                        ) : (
                          <ArrowUpRight size={12} aria-hidden="true" />
                        )}
                        {isSell ? "SELL" : "BUY"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
