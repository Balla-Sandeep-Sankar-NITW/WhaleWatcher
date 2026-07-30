import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowRight, Copy, ExternalLink, LineChart, Table, Bell, Activity } from "lucide-react";
import config from "../config";

export default function CommandPalette({ open, onClose, coinData }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const actions = useMemo(
    () => [
      {
        id: "chart",
        label: "Jump to price chart",
        icon: LineChart,
        run: () => scrollToId("chart"),
      },
      {
        id: "trades",
        label: "Jump to recent trades",
        icon: Table,
        run: () => scrollToId("trades"),
      },
      {
        id: "alerts",
        label: "Jump to whale alerts",
        icon: Bell,
        run: () => scrollToId("alerts"),
      },
      {
        id: "status",
        label: "Jump to system status",
        icon: Activity,
        run: () => scrollToId("status"),
      },
      {
        id: "copy",
        label: coinData?.current_price
          ? `Copy current price ($${coinData.current_price.toLocaleString()})`
          : "Copy current price",
        icon: Copy,
        disabled: !coinData?.current_price,
        run: async () => {
          if (!coinData?.current_price) return;
          await navigator.clipboard.writeText(String(coinData.current_price));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
        keepOpen: true,
      },
      {
        id: "binance",
        label: `View ${config.coinSymbol} on Binance`,
        icon: ExternalLink,
        run: () =>
          window.open(
            `https://www.binance.com/en/trade/${config.coinSymbol.replace("/", "_")}`,
            "_blank",
            "noopener,noreferrer"
          ),
      },
    ],
    [coinData]
  );

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = filtered[activeIndex];
      if (action && !action.disabled) {
        action.run();
        if (!action.keepOpen) onClose();
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-abyss-950/70 px-4 pt-[14vh] backdrop-blur-sm animate-fade-in"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-abyss-800 shadow-glow-lg animate-fade-up"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <Search size={16} className="shrink-0 text-ink-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section or run an action…"
            aria-label="Search commands"
            className="w-full bg-transparent text-sm text-ink-300 placeholder:text-ink-600 focus:outline-none"
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <ul className="max-h-72 overflow-y-auto p-1.5" role="listbox">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-500">No matching actions.</li>
          )}
          {filtered.map((action, idx) => {
            const Icon = action.icon;
            const isActive = idx === activeIndex;
            return (
              <li key={action.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  disabled={action.disabled}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    action.run();
                    if (!action.keepOpen) onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive ? "bg-signal-teal/10 text-white" : "text-ink-300"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-signal-teal" : "text-ink-500"} aria-hidden="true" />
                  <span className="flex-1">
                    {action.id === "copy" && copied ? "Copied to clipboard ✓" : action.label}
                  </span>
                  {isActive && <ArrowRight size={13} className="text-signal-teal" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-2xs text-ink-600">
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">↵</kbd> select
          </span>
        </div>
      </div>
    </div>
  );
}
