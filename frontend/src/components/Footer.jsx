import config from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-6 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-ink-400">
        <span aria-hidden="true">🚀</span>
        {config.appName} v1.0 · Real-time institutional trade detection
      </p>
      <p className="mt-1 text-2xs text-ink-600">
        Data: Binance WebSocket &amp; CoinGecko API · Stack: Node.js, Socket.io, React, Chart.js
      </p>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-2xs text-ink-600">
        Press <span className="kbd">⌘</span>
        <span className="kbd">K</span> anytime for quick actions
      </p>
    </footer>
  );
}
