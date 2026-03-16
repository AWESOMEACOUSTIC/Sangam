import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        className="w-3.5 h-3.5 text-yellow-400 shrink-0"
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
      <span className="text-white text-sm font-semibold">{rating}</span>
      <span className="text-zinc-500 text-xs">/ 10</span>
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
      className="absolute top-2.5 left-2.5 z-10 flex items-center
                 justify-center w-7 h-7 rounded-full
                 border border-white/30 backdrop-blur-md
                 overflow-hidden"
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
            className="relative z-10 w-3.5 h-3.5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
            transition={{ duration: 0.18 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="plus"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.5 }}
            transition={{ duration: 0.18 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function MovieCard({ movie, onWatchTrailer, isDragging }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (!isDragging) onWatchTrailer(movie);
  };

  return (
    <motion.div
      className="relative shrink-0 w-44 sm:w-48 md:w-52
                 bg-zinc-900 rounded-2xl overflow-hidden
                 ring-1 ring-white/5 cursor-pointer select-none"
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* ── Poster ── */}
      <div className="relative aspect-2/3 overflow-hidden bg-zinc-800">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-600 text-xs text-center px-2">
              {movie.title}
            </span>
          </div>
        )}

        {/* Bottom gradient */}
        <div
          className="absolute inset-0 bg-linear-to-t
                     from-zinc-900 via-transparent to-transparent"
        />

        {/* Hover shimmer */}
        <motion.div
          className="absolute inset-0 bg-yellow-400/5 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Watchlist toggle */}
        <WatchlistButton
          added={inWatchlist}
          onToggle={() => setInWatchlist((prev) => !prev)}
        />
      </div>

      {/* ── Card body ── */}
      <div className="p-3 space-y-2.5">
        {/* Title */}
        <h3
          className="text-white text-sm font-semibold leading-snug
                     line-clamp-2 min-h-[2.5rem]"
        >
          {movie.title}
        </h3>

        {/* Genres — updated from movie.genre → movie.genres */}
        <p className="text-zinc-500 text-xs">
          {movie.genres.join(" / ")}
        </p>

        {/* Rating */}
        <StarRating rating={movie.rating} />

        {/* Watch Trailer */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleTrailerClick}
          className="w-full flex items-center justify-center gap-1.5
                     bg-zinc-800 hover:bg-zinc-700 border border-white/8
                     text-white text-xs font-medium py-2 rounded-xl
                     transition-colors duration-200 group"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-blue-400 group-hover:text-blue-300
                       transition-colors"
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