import { Server, Waves, Gem, Activity } from "lucide-react";

function StatusRow({ icon: Icon, label, value, tone }) {
  const toneClasses = {
    green: "bg-emerald-500/15 text-emerald-300",
    yellow: "bg-yellow-500/15 text-yellow-300",
    red: "bg-red-500/15 text-red-300",
    teal: "bg-signal-teal/15 text-signal-teal",
  };

  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-3.5 last:border-0 last:pb-0">
      <span className="flex items-center gap-2.5 text-sm text-ink-300">
        <Icon size={14} className="text-ink-500" aria-hidden="true" />
        {label}
      </span>
      <span className={`rounded-full px-3 py-1 text-2xs font-semibold ${toneClasses[tone]}`}>
        {value}
      </span>
    </div>
  );
}

export default function SystemStatus({ isConnected, feedConnected, coinData, coinError }) {
  return (
    <section id="status" className="panel scroll-mt-24 p-5" aria-label="System status">
      <h2 className="panel-title mb-4">System status</h2>
      <div className="flex flex-col gap-3.5">
        <StatusRow
          icon={Server}
          label="Server connection"
          value={isConnected ? "Connected" : "Disconnected"}
          tone={isConnected ? "green" : "red"}
        />
        <StatusRow
          icon={Waves}
          label="Binance WebSocket"
          value={feedConnected ? "Streaming" : "Reconnecting…"}
          tone={feedConnected ? "green" : "yellow"}
        />
        <StatusRow
          icon={Gem}
          label="CoinGecko API"
          value={coinError ? "Error" : coinData ? "Connected" : "Connecting…"}
          tone={coinError ? "red" : coinData ? "green" : "yellow"}
        />
        <StatusRow icon={Activity} label="Data pipeline" value="Active" tone="teal" />
      </div>
    </section>
  );
}
