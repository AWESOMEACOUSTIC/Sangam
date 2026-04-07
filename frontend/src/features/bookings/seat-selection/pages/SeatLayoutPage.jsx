import { useParams, useSearchParams } from "react-router-dom";
import useSeatSelection from "../../hooks/useSeatSelection";
import BackButton from "../components/BackButton";
import MovieHeader from "../components/MovieHeader";
import ScreenDisplay from "../components/ScreenDisplay";
import SeatGrid from "../components/SeatGrid";
import SeatLegend from "../components/SeatLegend";
import BookingSummary from "../components/BookingSummary";

function SeatLayoutPage() {
  const { showId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const {
    rows,
    selectedSeats,
    totalPrice,
    maxSelectableSeats,
    selectionFeedback,
    hoveredSeat,
    toggleSeat,
    startSeatHover,
    clearSeatHover,
  } = useSeatSelection();

  const movieTitle = searchParams.get("movieTitle") || "Selected Movie";
  const date = searchParams.get("date") || "";
  const showTime = searchParams.get("showTime") || "Time TBA";
  const theater = searchParams.get("theater") || "IMAX Hall";

  return (
    <main className="min-h-screen bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto mb-6 flex max-w-6xl items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-black tracking-widest text-primary">
          {theater.split(" ")[0].toUpperCase()}
        </h1>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-[#14142a] to-[#0d0d1c] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-7">
          <MovieHeader
            movieTitle={movieTitle}
            date={date}
            showTime={showTime}
            showId={showId}
          />

          <div className="mt-8">
            <ScreenDisplay />
          </div>

          <div className="mt-6">
            <SeatGrid
              rows={rows}
              onSeatActivate={toggleSeat}
              onSeatHoverStart={startSeatHover}
              onSeatHoverEnd={clearSeatHover}
            />
          </div>
          <div className="mt-8">
            <SeatLegend direction="row" />
            <p
              role="status"
              aria-live="polite"
              className={[
                "mt-4 text-center text-sm lg:text-left",
                selectionFeedback ? "text-amber-300" : "text-zinc-500",
              ].join(" ")}
            >
              {selectionFeedback ||
                `You can select up to ${maxSelectableSeats} seats per booking.`}
            </p>
          </div>
          <div className="mt-8 lg:hidden">
            <BookingSummary
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              hoveredSeat={hoveredSeat}
            />
          </div>
        </section>
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-white/10 bg-linear-to-b from-[#14142a] to-[#0d0d1c] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <BookingSummary
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              hoveredSeat={hoveredSeat}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

export default SeatLayoutPage;