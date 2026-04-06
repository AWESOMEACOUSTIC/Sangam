import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, PlayCircle, Star } from "lucide-react";
import toast from "react-hot-toast";

import TrailerModal from "../../../common/components/TrailerModal";
import MOVIES from "../../../data/movies";
import useMovieDetail from "../hooks/useMovieDetail";
import { buildMoviePath } from "../services/movieDetailService";
import useBookingAuthGate from "../../bookings/hooks/useBookingAuthGate";
import { buildSeatLayoutPath } from "../../bookings/utils/bookingPath";
import useShowtimeSelection from "../../bookings/showtimes/hooks/useShowtimeSelection";

function MovieNotFound() {
  return (
    <main className="min-h-screen px-4 pb-14 pt-28 sm:px-8 md:px-12 lg:px-16">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-10 text-center sm:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">
          Movie not found
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          This title is unavailable
        </h1>

        <p className="mt-4 text-zinc-300">
          The requested title might have been moved or the URL is incorrect.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Back to home
          </Link>

          <Link
            to="/movies"
            className="inline-flex rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse all
          </Link>
        </div>
      </section>
    </main>
  );
}

function MovieDetail() {
  const { movieSlug = "", id = "" } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { ensureAuthenticated } = useBookingAuthGate();

  const [activeTrailer, setActiveTrailer] = useState(null);

  const routeSlug = movieSlug || id;

  const { movie, canonicalPath, isCanonicalPath } =
    useMovieDetail(routeSlug, pathname);

  const {
    showtimes,
    selectedShowtime,
    selectedShowtimeId,
    setSelectedShowtimeId,
  } = useShowtimeSelection(movie?.id);

  useEffect(() => {
    if (movie && canonicalPath && !isCanonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [movie, canonicalPath, isCanonicalPath, navigate]);

  const relatedTitles = useMemo(() => {
    if (!movie) return [];

    const movieType = movie.type ?? "movie";

    return MOVIES.filter(
      (item) =>
        item.id !== movie.id &&
        (item.type ?? "movie") === movieType
    ).slice(0, 4);
  }, [movie]);

  const seatLayoutPath = useMemo(() => {
    if (!movie?.id || !selectedShowtime) {
      return "";
    }

    return buildSeatLayoutPath({
      movieId: movie.id,
          movieTitle: movie.title,
      date: selectedShowtime.date,
      showId: selectedShowtime.id,
      showTime: selectedShowtime.time,
      theater: selectedShowtime.theater,
    });
  }, [movie, selectedShowtime]);

  const handleBookTickets = () => {
    if (!selectedShowtime || !seatLayoutPath) {
      toast.error("Please select a showtime first.");
      return;
    }

    if (ensureAuthenticated(seatLayoutPath)) {
      navigate(seatLayoutPath);
    }
  };

  if (!movie) {
    return <MovieNotFound />;
  }

  return (
    <>
      <main className="min-h-screen px-4 pb-14 pt-26 sm:px-8 md:px-12 lg:px-16">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-xl">
          <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr] md:p-8 lg:grid-cols-[320px_1fr]">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-800">
              <img
                src={movie.poster}
                alt={movie.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                {movie.type ?? "movie"}
              </span>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-200">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1">
                    <CalendarDays className="h-4 w-4 text-yellow-300" />
                    {movie.release}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1">
                    <Star className="h-4 w-4 text-yellow-300" />
                    {movie.rating}/10
                  </span>
                </div>

                <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                  {movie.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={`${movie.id}-${genre}`}
                      className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-medium text-zinc-200"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Select showtime
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => {
                      const isSelected = showtime.id === selectedShowtimeId;

                      return (
                        <button
                          key={showtime.id}
                          type="button"
                          onClick={() => setSelectedShowtimeId(showtime.id)}
                          className={[
                            "rounded-xl border px-3 py-2 text-left transition",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/80",
                            isSelected
                              ? "border-yellow-300 bg-yellow-400/20 text-yellow-100"
                              : "border-white/15 bg-black/30 text-zinc-200 hover:border-white/30 hover:bg-white/5",
                          ].join(" ")}
                        >
                          <p className="text-xs font-medium uppercase tracking-[0.08em]">
                            {showtime.dateLabel}
                          </p>
                          <p className="mt-1 text-sm font-semibold">{showtime.time}</p>
                          <p className="mt-1 text-[11px] text-zinc-300">
                            {showtime.theater}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTrailer(movie)}
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300"
                >
                  <PlayCircle className="h-4 w-4" />
                  Watch trailer
                </button>

                <button
                  type="button"
                  onClick={handleBookTickets}
                  className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Book tickets
                </button>
              </div>
            </div>
          </div>
        </section>

        {relatedTitles.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-extrabold text-white">
              More like this
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTitles.map((item) => (
                <Link
                  key={item.id}
                  to={buildMoviePath(item)}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70"
                >
                  <div className="aspect-2/3 overflow-hidden bg-zinc-800">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-1 p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-400">
                      {item.genres?.join(" / ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <TrailerModal
        movie={activeTrailer}
        onClose={() => setActiveTrailer(null)}
      />
    </>
  );
}

export default MovieDetail;