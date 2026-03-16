import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MOVIES from "../../../data/movies";
import MovieCard from "../../../common/components/MovieCard";
import DraggableCarousel from "../../../common/components/DraggableCarousel";
import TrailerModal from "../../../common/components/TrailerModal";

const TABS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.15 } },
};

export default function WhatToWatch() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeMovie, setActiveMovie] = useState(null);

  const filtered = MOVIES.filter((m) => {
    const type = m.type ?? "movie"; // default to movie when type not set
    return activeTab === "all" || type === activeTab;
  });

  const handleWatchTrailer = useCallback((movie) => {
    setActiveMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveMovie(null);
  }, []);

  return (
    <>
      <section
        className="w-full  min-h-screen px-4 sm:px-8
                   md:px-12 lg:px-16 py-10 font-sans"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div
              className="px-4 py-2 inline-block"
            >
              <h1
                className="text-3xl sm:text-4xl font-extrabold
                           text-yellow-400 leading-tight"
              >
                What to watch
              </h1>
              <p
                className="text-sm text-white/70 mt-0.5 pt-1"
              >
                Top picks just for you
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/10 pb-0">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium
                         transition-colors duration-200 rounded-t-lg
                         ${
                           activeTab === tab.id
                             ? "text-white"
                             : "text-zinc-500 hover:text-zinc-300"
                         }`}
              whileTap={{ scale: 0.96 }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5
                             bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DraggableCarousel gap="gap-4">
              {filtered.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onWatchTrailer={handleWatchTrailer}
                  variants={itemVariants}
                />
              ))}
            </DraggableCarousel>
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-zinc-600 text-sm"
            >
              No titles found in this category.
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Trailer Modal */}
      <TrailerModal movie={activeMovie} onClose={handleCloseModal} />
    </>
  );
}