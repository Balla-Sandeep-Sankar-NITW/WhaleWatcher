import { Command } from "lucide-react";
import config from "../config";
import ConnectionBadge from "./ConnectionBadge";
import LiveClock from "./LiveClock";
import TickerTape from "./TickerTape";

export default function Header({ isConnected, feedConnected, trades, onOpenPalette }) {
  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-white/[0.05] bg-abyss-950/85 backdrop-blur-md sm:-mx-6 lg:-mx-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-signal-teal/30"
              aria-hidden="true"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-abyss-800 text-xl shadow-glow">
              🐋
            </span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              {config.appName}
            </h1>
            <p className="text-2xs uppercase tracking-[0.12em] text-ink-500">
              Live {config.coinSymbol} · institutional trade detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-abyss-800/80 px-3 py-1.5 text-2xs text-ink-500 transition-colors hover:border-signal-teal/30 hover:text-ink-300 sm:flex"
          >
            <Command size={13} aria-hidden="true" />
            <span>Quick actions</span>
            <span className="kbd">⌘K</span>
          </button>

          <LiveClock />
          <div className="hidden h-8 w-px bg-white/[0.07] sm:block" aria-hidden="true" />
          <div className="flex flex-col items-end gap-2">
            <ConnectionBadge connected={isConnected} label="Server" />
            <ConnectionBadge connected={feedConnected} label="Feed" />
          </div>
        </div>
      </div>

      <TickerTape trades={trades} />
    </header>
  );
}
