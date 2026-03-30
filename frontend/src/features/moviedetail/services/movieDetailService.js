import MOVIES from "../../../data/movies";

export function slugifyMovieTitle(title = "") {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/["'.,:;!?()[\]{}]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}


export function buildMovieSlug(movie) {
  if (!movie) return "";

  return `${slugifyMovieTitle(movie.title)}-${movie.id}`;
}

export function buildMoviePath(movie) {
  const movieSlug = buildMovieSlug(movie);
  return movieSlug ? `/movie/${movieSlug}` : "/movie";
}

/**
 * Extract movie ID from slug
 * Handles:
 * - "inception-123"
 * - "123"
 */
export function extractMovieId(movieSlug = "") {
  const slug = String(movieSlug).trim();

  if (!slug) return null;

  // Case: slug is just a number
  if (/^\d+$/.test(slug)) {
    return Number(slug);
  }

  // Extract ID from end of slug
  const idMatch = slug.match(/-(\d+)$/);
  return idMatch ? Number(idMatch[1]) : null;
}

export function getMovieBySlug(movieSlug = "") {
  const movieId = extractMovieId(movieSlug);

  if (movieId === null) return null;

  return (
    MOVIES.find((movie) => Number(movie.id) === movieId) ?? null
  );
}


export function getCanonicalMoviePath(movie) {
  return buildMoviePath(movie);
}