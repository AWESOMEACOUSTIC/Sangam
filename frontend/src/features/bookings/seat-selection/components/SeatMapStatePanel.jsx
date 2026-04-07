function SeatMapStatePanel({
  title,
  description,
  actionLabel,
  onAction,
  tone = "neutral",
}) {
  const toneClassName =
    tone === "error"
      ? "border-red-500/30 bg-red-950/20 text-red-100"
      : "border-white/10 bg-black/20 text-zinc-200";

  return (
    <section className={`rounded-2xl border p-6 text-center ${toneClassName}`}>
      <p className="text-lg font-semibold uppercase tracking-[0.08em]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-zinc-300">{description}</p>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {actionLabel || "Try again"}
        </button>
      ) : null}
    </section>
  );
}

export default SeatMapStatePanel;
