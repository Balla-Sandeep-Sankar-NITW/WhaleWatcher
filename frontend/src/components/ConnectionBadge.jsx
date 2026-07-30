import { Wifi, WifiOff } from "lucide-react";

export default function ConnectionBadge({ connected, label }) {
  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors ${
        connected
          ? "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300"
          : "border-red-500/25 bg-red-500/[0.08] text-red-300"
      }`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {connected && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
            aria-hidden="true"
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            connected ? "bg-emerald-400" : "bg-red-400"
          }`}
          aria-hidden="true"
        />
      </span>
      <span>{connected ? (label ?? "Connected") : `${label ? `${label} ` : ""}Disconnected`}</span>
      {connected ? (
        <Wifi size={12} strokeWidth={2.25} aria-hidden="true" />
      ) : (
        <WifiOff size={12} strokeWidth={2.25} aria-hidden="true" />
      )}
    </div>
  );
}
