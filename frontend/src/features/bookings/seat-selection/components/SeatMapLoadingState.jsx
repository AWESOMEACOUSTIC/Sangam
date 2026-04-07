function SeatMapLoadingState() {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <p className="text-center text-sm uppercase tracking-[0.08em] text-zinc-400">
        Loading seat map...
      </p>

      <div className="mt-5 space-y-3">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={`loading-seat-row-${rowIndex}`}
            className="flex items-center justify-center gap-2"
          >
            {Array.from({ length: 10 }).map((_, seatIndex) => (
              <span
                key={`loading-seat-${rowIndex}-${seatIndex}`}
                className="h-6 w-6 animate-pulse rounded-lg border border-white/10 bg-white/5 sm:h-7 sm:w-7"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeatMapLoadingState;
