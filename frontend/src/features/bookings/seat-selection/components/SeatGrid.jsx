import React from "react";
import SeatBadge from "./SeatBadge";

function rowLabel(rowNumber) {
  return String.fromCharCode(64 + rowNumber); 
}

function SeatGrid({ rows, onSeatActivate, onSeatHoverStart, onSeatHoverEnd }) {
  return (
    <section className="space-y-2.5">
      {rows.map((row) => {
        const label = rowLabel(row.rowNumber);

        return (
          <div
            key={row.rowNumber}
            className="grid grid-cols-[20px_1fr_20px] items-center gap-2"
          >
            <span className="text-xs font-medium text-zinc-500">{label}</span>

            <div className="flex items-center justify-center gap-3 lg:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5">
                {row.leftSeats.map((seat) => (
                  <SeatBadge
                    key={`${row.rowNumber}-L-${seat.seatNumber}`}
                    seat={seat}
                    onActivate={onSeatActivate}
                    onHoverStart={onSeatHoverStart}
                    onHoverEnd={onSeatHoverEnd}
                  />
                ))}
              </div>

              <div className="h-px w-4 bg-white/10" />

              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5">
                {row.rightSeats.map((seat) => (
                  <SeatBadge
                    key={`${row.rowNumber}-R-${seat.seatNumber}`}
                    seat={seat}
                    onActivate={onSeatActivate}
                    onHoverStart={onSeatHoverStart}
                    onHoverEnd={onSeatHoverEnd}
                  />
                ))}
              </div>
            </div>

            <span className="text-right text-xs font-medium text-zinc-500">
              {label}
            </span>
          </div>
        );
      })}
    </section>
  );
}

export default SeatGrid;