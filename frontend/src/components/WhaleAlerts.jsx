export default function WhaleAlerts({ alerts }) {
  return (
    <section id="alerts" className="panel scroll-mt-24 p-5 shadow-glow-gold" aria-label="Whale alerts">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-title flex items-center gap-2 text-gold-glow">
          <span aria-hidden="true">🐋</span> Whale alerts
        </h2>
        <span className="rounded-full bg-red-500/15 px-3 py-1 text-2xs font-bold uppercase tracking-wide text-red-300">
          Live
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-ink-500">
          <span className="text-4xl" aria-hidden="true">🐳</span>
          <p className="text-sm">Waiting for whale activity…</p>
          <p className="text-2xs text-ink-600">Alerts trigger for trades ≥ $500,000</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {alerts.map((alert, index) => (
            <li
              key={`${alert.timestamp}-${index}`}
              className="animate-slide-in rounded-xl border border-gold-glow/20 bg-gold-glow/5 p-3.5 transition-colors hover:border-gold-glow/35 hover:bg-gold-glow/[0.08]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold tabular-nums text-white">
                  ${alert.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-2xs font-semibold ${
                    alert.side === "SELL"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {alert.side}
                </span>
              </div>
              <p className="mt-1 font-mono text-2xs tabular-nums text-ink-500">
                {alert.quantity.toFixed(4)} BTC @ ${alert.price.toFixed(2)}
              </p>
              <p className="mt-1 text-2xs text-ink-600">{alert.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
