import { useEffect, useState } from "react";

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right font-mono leading-tight" aria-label="Current time">
      <div className="text-sm tabular-nums text-ink-300">{now.toLocaleTimeString()}</div>
      <div className="text-2xs tabular-nums text-ink-600">{now.toLocaleDateString()}</div>
    </div>
  );
}
