import React from "react";
import ticketData from "../service/ticketData";

export default function PosterPane() {
  return (
    <section className="flex h-full flex-col p-3 sm:p-4 md:p-5">
      <div className="flex h-full flex-col rounded-[22px] border border-black/15 bg-black/90 p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.22)]">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img
            src={ticketData.posterSrc}
            alt={`${ticketData.movieTitle} poster`}
            className="aspect-[3/4] max-h-[318px] w-full object-cover"
          />
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#f5c518]">
            Confirmed Ticket
          </p>

          <h2 className="mt-2 text-lg font-black uppercase tracking-[0.08em] text-white sm:text-[26px]">
            {ticketData.movieTitle}
          </h2>
        </div>
      </div>
    </section>
  );
}
