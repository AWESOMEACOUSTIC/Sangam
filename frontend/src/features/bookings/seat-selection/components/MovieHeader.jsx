import React from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

function formatDateLabel(dateString) {
  if (!dateString) return "Date TBA";
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return dateString;
  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MovieHeader({ movieTitle, date, showTime, showId }) {
  const formattedDate = formatDateLabel(date);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <h2 className="line-clamp-1 text-xl font-semibold text-white lg:text-2xl">
        {movieTitle}
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-300">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
          {formattedDate}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 text-zinc-400" />
          {showTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          {showId || "Show ID"}
        </span>
      </div>
    </section>
  );
}

export default MovieHeader;