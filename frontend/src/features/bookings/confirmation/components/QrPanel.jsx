import React from "react";
import { ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QrPanel({ booking }) {
  const bookingId = booking?.bookingId || "N/A";
  const qrValue = booking?.qrValue || bookingId;

  return (
    <aside className="self-start rounded-xl border border-black/15 bg-black p-3.5 text-white">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
        <ScanLine className="h-3.5 w-3.5" />
        <span>Digital Check-In</span>
      </div>

      <div className="mt-3 flex justify-center rounded-lg bg-white p-2.5">
        <QRCodeSVG
          value={qrValue}
          size={118}
          bgColor="#ffffff"
          fgColor="#111111"
          level="M"
          includeMargin={false}
        />
      </div>

      <p className="mt-2.5 text-center text-[12px] leading-5 text-white/70">
        Present this QR code at the entrance.
      </p>

      <div className="mt-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
          Booking ID
        </p>
        <p className="mt-1 text-sm font-bold tracking-[0.08em] text-white">
          {bookingId}
        </p>
      </div>
    </aside>
  );
}