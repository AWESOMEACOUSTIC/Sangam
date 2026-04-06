function BookingSummary({ selectedSeats, totalPrice, hoveredSeat }) {
  const hasSeats = selectedSeats.length > 0;

  return (
    <section className="flex h-full flex-col">
      <div>
        <p className="text-center text-2xl font-semibold uppercase tracking-[0.08em] text-white/90 lg:text-left">
          Selected Seats
        </p>
        <div className="mt-2 h-0.5 w-14 rounded-full bg-primary lg:mx-0 mx-auto" />
        <p className="mt-3 text-center text-xs text-zinc-400 lg:text-left">
          {hoveredSeat
            ? `Preview: Row ${hoveredSeat.rowNumber} / Seat ${hoveredSeat.seatNumber} - $${hoveredSeat.price}`
            : "Hover or focus a seat to preview its price"}
        </p>
      </div>

      <div className="mt-5 flex-1 space-y-3">
        {hasSeats ? (
          selectedSeats.map((seat) => (
            <div
              key={`selected-${seat.rowNumber}-${seat.seatNumber}`}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3 text-base text-zinc-200"
            >
              <p>
                Row {seat.rowNumber} / Seat {seat.seatNumber}
              </p>
              <p className="font-medium">${seat.price}</p>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-zinc-500">
            Tap on available seats to select them
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-center gap-2 text-2xl lg:justify-between">
          <span className="uppercase tracking-[0.08em] text-zinc-400">
            Total:
          </span>
          <span className="font-semibold text-cyan-400">${totalPrice}</span>
        </div>

        <button
          type="button"
          disabled={!hasSeats}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-lg font-semibold text-white shadow-[0_0_30px_rgba(248,69,101,0.45)] transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
        >
          Payment
        </button>
      </div>
    </section>
  );
}

export default BookingSummary;