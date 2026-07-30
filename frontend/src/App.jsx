import { useEffect, useState } from "react";
import useWhaleFeed from "./hooks/useWhaleFeed";

import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import PriceChart from "./components/PriceChart";
import TradesTable from "./components/TradesTable";
import WhaleAlerts from "./components/WhaleAlerts";
import WhaleAlertToast from "./components/WhaleAlertToast";
import SystemStatus from "./components/SystemStatus";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";

function App() {
  const {
    isConnected,
    feedConnected,
    trades,
    whaleAlerts,
    whaleCount,
    latestAlert,
    dismissLatestAlert,
    coinData,
    coinError,
  } = useWhaleFeed();

  const [paletteOpen, setPaletteOpen] = useState(false);

  const totalVolume = trades.reduce((sum, t) => sum + parseFloat(t.q || 0), 0);

  useEffect(() => {
    function handleKeyDown(e) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <WhaleAlertToast alert={latestAlert} onDismiss={dismissLatestAlert} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} coinData={coinData} />

      <Header
        isConnected={isConnected}
        feedConnected={feedConnected}
        trades={trades}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main id="main-content">
        <StatsGrid
          coinData={coinData}
          coinError={coinError}
          totalVolume={totalVolume}
          tradeCount={trades.length}
          whaleCount={whaleCount}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 pb-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6 animate-fade-up">
            <PriceChart trades={trades} />
            <TradesTable trades={trades} />
          </div>

          <div className="flex flex-col gap-6 animate-fade-up">
            <WhaleAlerts alerts={whaleAlerts} />
            <SystemStatus
              isConnected={isConnected}
              feedConnected={feedConnected}
              coinData={coinData}
              coinError={coinError}
            />
            <HowItWorks />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
