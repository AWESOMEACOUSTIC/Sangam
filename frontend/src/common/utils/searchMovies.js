/**
 * Client-side fuzzy search across multiple movie fields.
 *
 * @param {string} query - The user's search input.
 * @param {Array}  movies - Array of movie objects.
 * @returns {Array} Filtered & ranked results.
 */
export function searchMovies(query, movies) {
  if (!query || !query.trim()) return [];

  const normalizedQuery = query.trim().toLowerCase();
  const terms = normalizedQuery.split(/\s+/);

  const scored = movies.reduce((results, movie) => {
    const searchableFields = [
      movie.title,
      movie.genre, 
      movie.director,
      movie.cast, 
      movie.language,
      movie.year?.toString(),
    ];

    const haystack = searchableFields
      .flat() 
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const allTermsMatch = terms.every((term) => haystack.includes(term));
    if (!allTermsMatch) return results;

    let score = 0;
    const titleLower = (movie.title || "").toLowerCase();

    if (titleLower === normalizedQuery) {
      score += 100; // exact title match
    } else if (titleLower.startsWith(normalizedQuery)) {
      score += 75; // title starts with query
    } else if (titleLower.includes(normalizedQuery)) {
      score += 50; // title contains query
    }

    terms.forEach((term) => {
      if (titleLower.includes(term)) score += 10;
    });

    results.push({ movie, score });
    return results;
  }, []);

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.movie.title.localeCompare(b.movie.title),
    )
    .map((entry) => entry.movie);
}