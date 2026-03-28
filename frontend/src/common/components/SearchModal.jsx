import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Add Framer Motion
import { searchMovies } from "../utils/searchMovies";
import MOVIES from "../../data/movies";

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
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    const id = setTimeout(() => {
      setResults(searchMovies(query, MOVIES));
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
          className="fixed inset-0 z-[100] flex items-start justify-center
                     bg-black/60 backdrop-blur-sm pt-[10vh] p-4"
          onClick={onClose}
        >
          <motion.div
            // Modal Animation (Slides down and fades in)
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl rounded-2xl border
                       border-white/15 bg-slate-950/90 shadow-2xl
                       overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, actors, genres…"
                className="flex-1 bg-transparent text-white placeholder-gray-500
                           outline-none text-lg"
              />
              {query && (
                <X
                  className="w-5 h-5 text-gray-400 cursor-pointer
                             hover:text-white transition"
                  onClick={() => setQuery("")}
                />
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs
                              text-gray-400 border border-white/10 rounded">
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
                    // Staggered entrance for results
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={`/movie/${movie.id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 px-5 py-3
                                 hover:bg-white/5 transition group"
                    >
                      {movie.poster && (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded shrink-0 shadow-md"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate
                                      group-hover:text-sky-400 transition">
                          {movie.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {[movie.year, movie.genre, movie.language]
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