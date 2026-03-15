import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MOVIES from "../../data/movies";

const POSTER_DISPLAY_MS = 2500;
const VIDEO_DURATION_MS = 15000;
const TRANSITION_DURATION = 1.2;

const phases = {
  POSTER: "POSTER",
  TRANSITIONING: "TRANSITIONING",
  VIDEO: "VIDEO",
};

function YouTubeEmbed({ youtubeId, isActive }) {
  if (!isActive) return null;

  const src = [
    `https://www.youtube.com/embed/${youtubeId}?`,
    "autoplay=1",
    "mute=1",
    "controls=0",
    "showinfo=0",
    "modestbranding=1",
    "rel=0",
    "iv_load_policy=3",
    "disablekb=1",
    "fs=0",
    "playsinline=1",
    "loop=0",
    "start=3",
    `enablejsapi=1`,
  ].join("&");

  // Slight up-scale to mimic object-cover for 16:9 content in any viewport
  const scalePercent = 125;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <iframe
        src={src}
        title="Movie trailer"
        allow="autoplay; encrypted-media; accelerometer; gyroscope"
        allowFullScreen={false}
        frameBorder="0"
        className="absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          border: "none",
          width: `${scalePercent}%`,
          height: `${scalePercent}%`,
        }}
      />
    </div>
  );
}

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState(phases.POSTER);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const manualRef = useRef(false);

  const movie = MOVIES[currentIndex];

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (newIndex, dir) => {
      clearTimers();
      manualRef.current = true;
      setDirection(dir);
      setPhase(phases.POSTER);
      setCurrentIndex(newIndex);
    },
    [clearTimers]
  );

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % MOVIES.length;
    goToSlide(next, 1);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    const prev = (currentIndex - 1 + MOVIES.length) % MOVIES.length;
    goToSlide(prev, -1);
  }, [currentIndex, goToSlide]);

  const advanceToNext = useCallback(() => {
    setDirection(1);
    setPhase(phases.POSTER);
    setCurrentIndex((prev) => (prev + 1) % MOVIES.length);
  }, []);

  // Phase state machine
  useEffect(() => {
    clearTimers();
    manualRef.current = false;

    if (phase === phases.POSTER) {
      timerRef.current = setTimeout(() => {
        setPhase(phases.TRANSITIONING);
      }, POSTER_DISPLAY_MS);
    }

    if (phase === phases.TRANSITIONING) {
      timerRef.current = setTimeout(() => {
        setPhase(phases.VIDEO);
      }, TRANSITION_DURATION * 1000);
    }

    if (phase === phases.VIDEO) {
      timerRef.current = setTimeout(() => {
        advanceToNext();
      }, VIDEO_DURATION_MS);
    }

    return clearTimers;
  }, [phase, clearTimers, advanceToNext]);

  // Reset manual flag
  useEffect(() => {
    if (manualRef.current) {
      manualRef.current = false;
    }
  }, [currentIndex]);

  // Preload next poster
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % MOVIES.length;
    const img = new Image();
    img.src = MOVIES[nextIndex].poster;
  }, [currentIndex]);

  const showOverlayDetails = phase === phases.POSTER;
  const isVideoPhase =
    phase === phases.VIDEO || phase === phases.TRANSITIONING;

  const slideVariants = {
    enter: (d) => ({
      x: d > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d) => ({
      x: d > 0 ? "-50%" : "50%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ── Slides ── */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={movie.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: TRANSITION_DURATION,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* ── Poster background ── */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ opacity: isVideoPhase ? 0 : 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* ── YouTube video background ── */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ opacity: isVideoPhase ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <YouTubeEmbed
              youtubeId={movie.youtubeId}
              isActive={isVideoPhase}
            />
          </motion.div>

          {/* ── Gradient overlays ── */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-30% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 via-40% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent to-30% pointer-events-none" />

          {/* ── Content Overlay ── */}
          <div className="absolute inset-0 flex items-end pb-24 sm:pb-28 md:pb-32 lg:pb-36 px-6 sm:px-10 md:px-16 lg:px-20">
            <div className="max-w-2xl w-full">
              {/* Title */}
              <motion.h1
                layout
                animate={{
                  scale: showOverlayDetails ? 1 : 1.15,
                  y: showOverlayDetails ? 0 : 20,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="text-white font-bold leading-tight origin-bottom-left
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                style={{
                  textShadow: "0 4px 30px rgba(0,0,0,0.7)",
                }}
              >
                {movie.title}
              </motion.h1>

              {/* Genre Tags */}
              <AnimatePresence>
                {showOverlayDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4"
                  >
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full
                          border border-white/40 text-white/90
                          text-xs sm:text-sm font-medium backdrop-blur-sm
                          bg-white/5"
                      >
                        {genre}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Description */}
              <AnimatePresence>
                {showOverlayDetails && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.05,
                    }}
                    className="text-white/80 mt-3 sm:mt-4 leading-relaxed
                      text-sm sm:text-base md:text-lg max-w-xl"
                    style={{
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    {movie.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Release indicator */}
              <AnimatePresence>
                {showOverlayDetails && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.1,
                    }}
                    className="text-white font-bold mt-3 sm:mt-4
                      text-sm sm:text-base"
                  >
                    {movie.release}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Previous Arrow ── */}
      <button
        onClick={goPrev}
        aria-label="Previous movie"
        className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-30
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          flex items-center justify-center
          rounded-full bg-black/40 backdrop-blur-md border border-white/10
          text-white/80 hover:text-white hover:bg-white/20
          transition-all duration-300 cursor-pointer group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Next Arrow ── */}
      <button
        onClick={goNext}
        aria-label="Next movie"
        className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-30
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          flex items-center justify-center
          rounded-full bg-black/40 backdrop-blur-md border border-white/10
          text-white/80 hover:text-white hover:bg-white/20
          transition-all duration-300 cursor-pointer group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-2.5">
        {MOVIES.map((m, i) => (
          <button
            key={m.id}
            aria-label={`Go to ${m.title}`}
            onClick={() => {
              const dir = i > currentIndex ? 1 : -1;
              goToSlide(i, dir);
            }}
            className="group p-1 cursor-pointer"
          >
            <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full overflow-hidden">
              <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                  i === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
              {i === currentIndex && phase === phases.VIDEO && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: VIDEO_DURATION_MS / 1000,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}