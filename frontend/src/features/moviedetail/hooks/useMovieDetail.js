import { useMemo } from "react";
import {
  getCanonicalMoviePath,
  getMovieBySlug,
} from "../services/movieDetailService";

export default function useMovieDetail(routeSlug) {
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
      isCanonicalPath: canonicalPath === `/movie/${movieSlug}`,
    };
  }, [routeSlug]);
}