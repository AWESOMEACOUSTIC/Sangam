import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 30,
    transition: { duration: 0.2 },
  },
};

export default function TrailerModal({ movie, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  
  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Blurred dark backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal container */}
          <motion.div
            className="relative z-10 w-full max-w-4xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h2 className="text-white text-xl font-bold leading-tight">
                  {movie.title}
                </h2>
                <p className="text-zinc-400 text-sm mt-0.5">
                  {movie.year} &bull; {movie.genre.join(" / ")}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                           flex items-center justify-center text-white
                           transition-colors duration-200 shrink-0 ml-4"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {/* iFrame wrapper — 16:9 */}
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-2xl
                         bg-black ring-1 ring-white/10"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} — Official Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write;
                       encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Footer hint */}
            <p className="text-center text-zinc-500 text-xs mt-3">
              Press{" "}
              <kbd
                className="px-1.5 py-0.5 rounded bg-white/10
                           text-zinc-300 font-mono text-xs"
              >
                Esc
              </kbd>{" "}
              or click outside to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}