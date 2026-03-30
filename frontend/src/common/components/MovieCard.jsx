import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { buildMoviePath } from "../../features/moviedetail/service/movieDetailService";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        className="h-3.5 w-3.5 shrink-0 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 
                 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 
                 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 
                 1.118l1.07 3.292c.3.921-.755 1.688-1.54 
                 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 
                 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
                 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
                 1 0 00.951-.69l1.07-3.292z" />
      </svg>

      <span className="text-sm font-semibold text-white">{rating}</span>
      <span className="text-xs text-zinc-500">/ 10</span>
    </div>
  );
}

function WatchlistButton({ added, onToggle }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={added ? "Remove from watchlist" : "Add to watchlist"}
      className="absolute left-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/30 backdrop-blur-md"
      whileTap={{ scale: 0.82 }}
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <motion.div
        className="absolute inset-0 bg-yellow-400"
        initial={false}
        animate={{ scale: added ? 1 : 0, opacity: added ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        style={{ borderRadius: "inherit" }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.svg
            key="check"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 h-3.5 w-3.5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
            transition={{ duration: 0.18 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <motion.svg
            key="plus"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.5 }}
            transition={{ duration: 0.18 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function MovieCard({
  movie,
  onWatchTrailer,
  isDragging,
  variants,
}) {
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (!isDragging) onWatchTrailer(movie);
  };

  const handleCardClick = () => {
    if (isDragging) return;
    navigate(buildMoviePath(movie));
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <motion.div
      variants={variants}
      className="relative w-44 shrink-0 cursor-pointer select-none overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/5 sm:w-48 md:w-52"
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-2/3 overflow-hidden bg-zinc-800">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover pointer-events-none"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="px-2 text-center text-xs text-zinc-600">
              {movie.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-yellow-400/5"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        <WatchlistButton
          added={inWatchlist}
          onToggle={() => setInWatchlist((prev) => !prev)}
        />
      </div>

      <div className="space-y-2.5 p-3">
        <h3 className="min-h-10 line-clamp-2 text-sm font-semibold leading-snug text-white">
          {movie.title}
        </h3>

        <p className="text-xs text-zinc-500">
          {movie.genres.join(" / ")}
        </p>

        <StarRating rating={movie.rating} />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleTrailerClick}
          className="group flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-zinc-800 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-zinc-700"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-blue-400 transition-colors group-hover:text-blue-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            animate={{ x: isHovered ? [0, 1, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <path d="M8 5v14l11-7z" />
          </motion.svg>
          Watch trailer
        </motion.button>
      </div>
    </motion.div>
  );
}