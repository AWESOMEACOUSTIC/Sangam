/**
 * Replace poster URLs with actual movie poster images
 * and video URLs with movie trailer/clip MP4s.
 *
 * Unsplash images and Google-hosted sample videos
 * are used here as working placeholders.
 */
const MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    genres: ["Action", "Adventure", "Drama"],
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    release: "In theaters",
    poster:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 2,
    title: "Oppenheimer",
    genres: ["Biography", "Drama", "History"],
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    release: "In theaters",
    poster:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 3,
    title: "The Batman",
    genres: ["Action", "Crime", "Drama"],
    description:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    release: "Streaming now",
    poster:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    title: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft to find a new home for humanity.",
    release: "Streaming now",
    poster:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 5,
    title: "Blade Runner 2049",
    genres: ["Action", "Drama", "Sci-Fi"],
    description:
      "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    release: "Streaming now",
    poster:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: 6,
    title: "Arrival",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    description:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    release: "Streaming now",
    poster:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  },
];

export default MOVIES;