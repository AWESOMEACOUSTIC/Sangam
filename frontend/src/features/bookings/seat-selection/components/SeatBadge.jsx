import { SEAT_STATUS } from "../../constants/bookingConstants";

const STATUS_STYLES = {
  [SEAT_STATUS.AVAILABLE]:
    "border-white/20 bg-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] cursor-pointer hover:border-white/40 hover:bg-white/5",
  [SEAT_STATUS.RESERVED]:
    "border-transparent bg-zinc-500/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] cursor-not-allowed",
  [SEAT_STATUS.SELECTED]:
    "border-primary/60 bg-primary shadow-[0_0_18px_rgba(248,69,101,0.45)] cursor-pointer",
};

function SeatBadge({ seat, interactive = true }) {
  return (
    <div
      className={[
        "h-7 w-7 rounded-lg border transition-all duration-150 sm:h-8 sm:w-8 lg:h-9 lg:w-9",
        STATUS_STYLES[seat.status],
      ].join(" ")}
      role={interactive ? "button" : "presentation"}
      tabIndex={interactive && seat.status !== SEAT_STATUS.RESERVED ? 0 : -1}
      aria-label={`Row ${seat.rowNumber} Seat ${seat.seatNumber} – ${seat.status}`}
    />
  );
}

export default SeatBadge;