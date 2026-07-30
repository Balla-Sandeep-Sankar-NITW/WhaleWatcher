export default function StatCard({ icon: Icon, label, value, sub, accent = "teal", loading = false }) {
  const accentClasses = {
    teal: "text-signal-teal bg-signal-teal/10",
    gold: "text-gold-glow bg-gold-glow/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    red: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="panel group flex items-start justify-between gap-3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10">
      <div className="min-w-0">
        <div className="panel-title">{label}</div>
        {loading ? (
          <div className="mt-2.5 h-7 w-24">
            <div className="skeleton h-full w-full" />
          </div>
        ) : (
          <div className="mt-2 truncate font-mono text-2xl font-semibold tabular-nums text-white">
            {value}
          </div>
        )}
        {loading ? (
          <div className="mt-2 h-3 w-32">
            <div className="skeleton h-full w-full" />
          </div>
        ) : (
          sub && <div className="mt-1 text-2xs text-ink-500">{sub}</div>
        )}
      </div>
      {Icon && (
        <div
          className={`rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110 ${accentClasses[accent]}`}
        >
          <Icon size={19} strokeWidth={2} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
