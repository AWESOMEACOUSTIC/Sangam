import React from "react";
import ticketData from "../service/ticketData";

export default function PosterPane() {
  return (
    <section className="flex h-full flex-col p-4 sm:p-5 md:p-6">
      <div className="flex h-full flex-col rounded-2xl border border-black/15 bg-black/90 p-3 shadow-[0_14px_40px_rgba(0,0,0,0.24)]">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img
            src={ticketData.posterSrc}
            alt={`${ticketData.movieTitle} poster`}
            className="aspect-2/3 w-full object-cover"
          />
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#f5c518]">
            Confirmed Ticket
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-white sm:text-2xl">
            {ticketData.movieTitle}
          </h2>
        </div>
      </div>
    </section>
  );
}