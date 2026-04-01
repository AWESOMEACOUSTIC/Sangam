import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { searchMovies } from "../utils/searchMovies";
import MOVIES from "../../data/movies";
import { buildMoviePath } from "../../features/moviedetail/services/movieDetailService"

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    const id = setTimeout(() => {
      setResults(searchMovies(query, MOVIES));
    }, 200);

    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleResultClick = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[10vh] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, actors, genres…"
                className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 outline-none"
              />

              {query && (
                <X
                  className="h-5 w-5 cursor-pointer text-gray-400 transition hover:text-white"
                  onClick={() => setQuery("")}
                />
              )}

              <kbd className="hidden rounded border border-white/10 px-2 py-0.5 text-xs text-gray-400 sm:inline-block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === "" && (
                <p className="px-5 py-8 text-center text-gray-500">
                  Start typing to search…
                </p>
              )}

              {query.trim() !== "" && results.length === 0 && (
                <p className="px-5 py-8 text-center text-gray-500">
                  No results found for "{query}"
                </p>
              )}

              <div className="flex flex-col">
                {results.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={buildMoviePath(movie)}
                      onClick={handleResultClick}
                      className="group flex items-center gap-4 px-5 py-3 transition hover:bg-white/5"
                    >
                      {movie.poster && (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-14 w-10 shrink-0 rounded object-cover shadow-md"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white transition group-hover:text-sky-400">
                          {movie.title}
                        </p>

                        <p className="truncate text-sm text-gray-400">
                          {[
                            movie.release,
                            Array.isArray(movie.genres)
                              ? movie.genres.join(" / ")
                              : movie.genre,
                          ]
                            .flat()
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;