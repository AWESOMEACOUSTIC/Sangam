import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSeatSelection from "../../hooks/useSeatSelection";
import usePricing from "../../hooks/usePricing";
import { buildCheckoutPath } from "../../utils/bookingPath";
import BackButton from "../components/BackButton";
import MovieHeader from "../components/MovieHeader";
import ScreenDisplay from "../components/ScreenDisplay";
import SeatGrid from "../components/SeatGrid";
import SeatLegend from "../components/SeatLegend";
import BookingSummary from "../components/BookingSummary";
import SeatMapLoadingState from "../components/SeatMapLoadingState";
import SeatMapStatePanel from "../components/SeatMapStatePanel";

function SeatLayoutPage() {
  const { showId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const seatMapState = searchParams.get("seatMapState");
  const {
    rows,
    isLoading,
    loadError,
    isEmpty,
    retryLoadSeatMap,
    selectedSeats,
    maxSelectableSeats,
    selectionFeedback,
    hoveredSeat,
    toggleSeat,
    startSeatHover,
    clearSeatHover,
  } = useSeatSelection({
    simulateError: seatMapState === "error",
    simulateEmpty: seatMapState === "empty",
  });
  const pricing = usePricing(selectedSeats);

  const movieTitle = searchParams.get("movieTitle") || "Selected Movie";
  const posterSrc = searchParams.get("posterSrc") || "";
  const date = searchParams.get("date") || "";
  const showTime = searchParams.get("showTime") || "Time TBA";
  const theater = searchParams.get("theater") || "IMAX Hall";

  const handleProceedToCheckout = () => {
    if (!pricing?.isSummaryValid) {
      return;
    }

    const bookingSessionId = `${showId || "show"}-${Date.now().toString(36)}`;

    navigate(buildCheckoutPath({ bookingSessionId }), {
      state: {
        showId,
        movieTitle,
        posterSrc,
        date,
        showTime,
        theater,
        selectedSeats,
        pricing,
      },
    });
  };

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
            {isLoading ? (
              <SeatMapLoadingState />
            ) : loadError ? (
              <SeatMapStatePanel
                title="Seat map unavailable"
                description={loadError}
                actionLabel="Retry loading"
                onAction={retryLoadSeatMap}
                tone="error"
              />
            ) : isEmpty ? (
              <SeatMapStatePanel
                title="No seats published"
                description="Seat inventory for this show is not available yet. Try another showtime or refresh this map."
                actionLabel="Reload seats"
                onAction={retryLoadSeatMap}
              />
            ) : (
              <SeatGrid
                rows={rows}
                onSeatActivate={toggleSeat}
                onSeatHoverStart={startSeatHover}
                onSeatHoverEnd={clearSeatHover}
              />
            )}
          </div>
          {!isLoading && !loadError && !isEmpty ? (
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
          ) : null}
          <div className="mt-8 lg:hidden">
            <BookingSummary
              selectedSeats={selectedSeats}
              pricing={pricing}
              hoveredSeat={hoveredSeat}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </section>
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-white/10 bg-linear-to-b from-[#14142a] to-[#0d0d1c] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <BookingSummary
              selectedSeats={selectedSeats}
              pricing={pricing}
              hoveredSeat={hoveredSeat}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

export default SeatLayoutPage;