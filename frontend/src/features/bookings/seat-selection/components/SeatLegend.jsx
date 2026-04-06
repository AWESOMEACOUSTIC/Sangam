import { SEAT_STATUS } from "../../constants/bookingConstants";
import SeatBadge from "./SeatBadge";

const LEGEND_ITEMS = [
  { status: SEAT_STATUS.RESERVED, label: "Reserved" },
  { status: SEAT_STATUS.AVAILABLE, label: "Available" },
  { status: SEAT_STATUS.SELECTED, label: "Your seat" },
];

function SeatLegend({ direction = "row" }) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-4",
        direction === "col" ? "flex-col items-start" : "justify-center",
      ].join(" ")}
    >
      {LEGEND_ITEMS.map(({ status, label }) => (
        <div
          key={status}
          className="flex items-center gap-2 text-sm text-zinc-300"
        >
          <SeatBadge
            seat={{ rowNumber: 0, seatNumber: 0, status }}
            interactive={false}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default SeatLegend;