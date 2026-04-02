import React from "react";

export default function TicketField({
  icon: Icon,
  label,
  value,
  className = "",
}) {
  return (
    <div
      className={[
        "rounded-md border border-black/10 bg-white/30 px-4 py-2.5",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/55">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-[#111111] sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}