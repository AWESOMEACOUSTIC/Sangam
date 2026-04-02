import { useMemo } from "react";
import {
  getCanonicalMoviePath,
  getMovieBySlug,
} from "../services/movieDetailService";

function normalizePath(path = "") {
  const normalizedPath = String(path).trim().replace(/\/+$/, "");
  return normalizedPath || "/";
}

export default function useMovieDetail(routeSlug, currentPath = "") {
  return useMemo(() => {
    const movieSlug = String(routeSlug ?? "").trim();
    const movie = getMovieBySlug(movieSlug);

    if (!movie) {
      return {
        movie: null,
        canonicalPath: null,
        isCanonicalPath: false,
      };
    }

    const canonicalPath = getCanonicalMoviePath(movie);

    return {
      movie,
      canonicalPath,
      isCanonicalPath:
        normalizePath(canonicalPath) === normalizePath(currentPath),
    };
  }, [routeSlug, currentPath]);
}