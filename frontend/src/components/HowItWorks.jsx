import { Radio, Bell, LineChart, Globe } from "lucide-react";
import config from "../config";

const items = [
  {
    icon: Radio,
    color: "text-signal-teal bg-signal-teal/10",
    text: `Real-time ${config.coinSymbol} trades via Binance`,
  },
  {
    icon: Bell,
    color: "text-gold-glow bg-gold-glow/10",
    text: `Alerts for trades ≥ $${config.whaleThresholdUsd.toLocaleString()}`,
  },
  {
    icon: LineChart,
    color: "text-emerald-400 bg-emerald-400/10",
    text: `${config.chartWindowSize}-trade rolling price chart`,
  },
  {
    icon: Globe,
    color: "text-purple-400 bg-purple-400/10",
    text: "Metadata from the CoinGecko API",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="panel scroll-mt-24 p-5" aria-label="How it works">
      <h2 className="panel-title mb-4">How it works</h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-sm text-ink-300">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
              <item.icon size={13} aria-hidden="true" />
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
