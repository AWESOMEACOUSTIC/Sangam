import { SEAT_STATUS } from "../../constants/bookingConstants";

const STATUS_STYLES = {
  [SEAT_STATUS.AVAILABLE]:
    "border-white/20 bg-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] cursor-pointer hover:border-white/40 hover:bg-white/5",
  [SEAT_STATUS.RESERVED]:
    "border-transparent bg-zinc-500/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] cursor-not-allowed",
  [SEAT_STATUS.SOLD]:
    "border-transparent bg-red-900/65 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] cursor-not-allowed",
  [SEAT_STATUS.BLOCKED]:
    "border-transparent bg-amber-700/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] cursor-not-allowed",
  [SEAT_STATUS.SELECTED]:
    "border-primary/60 bg-primary shadow-[0_0_18px_rgba(248,69,101,0.45)] cursor-pointer",
};

const NON_INTERACTIVE_STATUSES = new Set([
  SEAT_STATUS.RESERVED,
  SEAT_STATUS.SOLD,
  SEAT_STATUS.BLOCKED,
]);

function SeatBadge({
  seat,
  interactive = true,
  onActivate,
  onHoverStart,
  onHoverEnd,
  showPricePreview = true,
}) {
  const isInteractive = interactive && !NON_INTERACTIVE_STATUSES.has(seat.status);

  const handleActivate = () => {
    if (!isInteractive) return;
    onActivate?.(seat);
  };

  const handleHoverStart = () => {
    if (!isInteractive) return;
    onHoverStart?.(seat);
  };

  const handleHoverEnd = () => {
    onHoverEnd?.();
  };

  return (
    <div className="group relative">
      <button
        type="button"
        disabled={!isInteractive}
        className={[
          "h-7 w-7 rounded-lg border transition-all duration-150 sm:h-8 sm:w-8 lg:h-9 lg:w-9",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          STATUS_STYLES[seat.status],
        ].join(" ")}
        onClick={handleActivate}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onFocus={handleHoverStart}
        onBlur={handleHoverEnd}
        aria-label={`Row ${seat.rowNumber} Seat ${seat.seatNumber} - ${seat.status} - $${seat.price}`}
      />

      {showPricePreview && isInteractive ? (
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-primary/35 bg-black/85 px-2 py-0.5 text-[10px] font-semibold text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          ${seat.price}
        </span>
      ) : null}
    </div>
  );
}

export default SeatBadge;