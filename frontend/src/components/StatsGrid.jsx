import { DollarSign, BarChart3, Bell, Gem } from "lucide-react";
import StatCard from "./StatCard";

function formatUsd(value, opts = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2, ...opts });
}

export default function StatsGrid({ coinData, coinError, totalVolume, tradeCount, whaleCount }) {
  const change = coinData?.price_change_24h;
  const changePct = coinData?.price_change_percentage_24h;
  const isUp = typeof change === "number" ? change >= 0 : null;
  const priceLoading = !coinData && !coinError;

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Key statistics">
      <StatCard
        icon={DollarSign}
        label="Current price"
        loading={priceLoading}
        value={
          coinData?.current_price
            ? `$${formatUsd(coinData.current_price)}`
            : coinError
              ? "Unavailable"
              : "—"
        }
        sub={
          typeof change === "number"
            ? `${isUp ? "↗" : "↘"} $${formatUsd(Math.abs(change))} (${formatUsd(
                Math.abs(changePct ?? 0),
                { maximumFractionDigits: 2 }
              )}%) · 24h`
            : coinError
              ? "CoinGecko request failed"
              : "Fetching market data"
        }
        accent={isUp === null ? "teal" : isUp ? "emerald" : "red"}
      />
      <StatCard
        icon={BarChart3}
        label="Total volume"
        value={`${totalVolume.toFixed(3)} BTC`}
        sub={`Last ${tradeCount} trades`}
        accent="teal"
      />
      <StatCard
        icon={Bell}
        label="Whale alerts"
        value={whaleCount}
        sub="Trades ≥ $500K"
        accent="gold"
      />
      <StatCard
        icon={Gem}
        label="Market cap"
        loading={priceLoading}
        value={
          coinData?.market_cap
            ? `$${(coinData.market_cap / 1e9).toFixed(1)}B`
            : coinError
              ? "Unavailable"
              : "—"
        }
        sub={coinData?.name ?? (coinError ? "CoinGecko request failed" : "—")}
        accent="teal"
      />
    </div>
  );
}
