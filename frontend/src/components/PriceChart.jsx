import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Radio } from "lucide-react";
import config from "../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart({ trades }) {
  const chartData = useMemo(() => {
    const windowed = trades.slice(-config.chartWindowSize);
    return {
      labels: windowed.map((t) => new Date(t.T).toLocaleTimeString()),
      datasets: [
        {
          label: `Price (${config.coinSymbol})`,
          data: windowed.map((t) => parseFloat(t.p)),
          borderColor: "#2dd6c4",
          backgroundColor: "rgba(45, 214, 196, 0.12)",
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#2dd6c4",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
      ],
    };
  }, [trades]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f1420",
          borderColor: "rgba(45, 214, 196, 0.3)",
          borderWidth: 1,
          titleColor: "#c3cbdb",
          bodyColor: "#2dd6c4",
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.035)" },
          ticks: { color: "#697089", maxTicksLimit: 8, font: { size: 10 } },
        },
        y: {
          beginAtZero: false,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: {
            color: "#697089",
            font: { size: 10, family: "'JetBrains Mono', monospace" },
            callback: (val) => `$${Number(val).toLocaleString()}`,
          },
        },
      },
    }),
    []
  );

  return (
    <section id="chart" className="panel scroll-mt-24 p-5" aria-label="Live price chart">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="panel-title">Price</h2>
          <p className="mt-0.5 font-display text-sm font-semibold text-white">
            {config.coinSymbol} · last {config.chartWindowSize} trades
          </p>
        </div>
        {trades.length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-signal-teal/10 px-2.5 py-1 text-2xs font-semibold text-signal-teal">
            <Radio size={11} className="animate-pulse-slow" aria-hidden="true" />
            Live
          </span>
        )}
      </div>

      <div className="h-[340px]">
        {trades.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-500">
            <div className="flex w-full max-w-sm flex-col gap-2 px-8" aria-hidden="true">
              <div className="skeleton h-24 w-full rounded-xl" />
              <div className="skeleton h-3 w-2/3 self-center rounded-full" />
            </div>
            <p className="text-sm">Waiting for the first trade to arrive…</p>
          </div>
        )}
      </div>
    </section>
  );
}
