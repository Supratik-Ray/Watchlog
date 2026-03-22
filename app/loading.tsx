export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sidebar-primary-foreground">
      <div className="flex flex-col items-center gap-6">
        {/* logo */}
        <span className="text-2xl font-extrabold tracking-tight">
          Watch<span className="text-chart-2">logger</span>
        </span>

        {/* film strip loader */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-2 rounded-full bg-chart-2 opacity-30"
              style={{
                animation: "pulse-bar 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes pulse-bar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
