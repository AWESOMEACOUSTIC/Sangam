const MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    genres: ["Action", "Adventure", "Drama"],
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    release: "In theaters",
    rating: 8.6,
    poster:
      "https://i.pinimg.com/1200x/b3/0d/fb/b30dfb22c63854d62471dd5f50cb9d16.jpg",
    youtubeId: "U2Qp5pL3ovA",
  },
  {
    id: 2,
    title: "Oppenheimer",
    genres: ["Biography", "Drama", "History"],
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    release: "In theaters",
    rating: 8.5,
    poster:
      "https://i.pinimg.com/736x/41/b4/97/41b497e285d10991713dac29a7fe2dd5.jpg",
    youtubeId: "uYPbbksJxIg",
  },
  {
    id: 3,
    title: "The Batman",
    genres: ["Action", "Crime", "Drama"],
    description:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    release: "Streaming now",
    rating: 7.9,
    poster:
      "https://i.pinimg.com/736x/2b/ef/ed/2befed038b8612196bd386ee6ff79096.jpg",
    youtubeId: "mqqft2x_Aa4",
  },
  {
    id: 4,
    title: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft to find a new home for humanity.",
    release: "Streaming now",
    rating: 8.7,
    poster:
      "https://i.pinimg.com/1200x/25/75/9e/25759eeb8dc28d874431cdfa8024284f.jpg",
    youtubeId: "zSWdZVtXT7E",
  },
  {
    id: 5,
    title: "Blade Runner 2049",
    genres: ["Action", "Drama", "Sci-Fi"],
    description:
      "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    release: "Streaming now",
    rating: 8.1,
    poster:
      "https://i.pinimg.com/736x/24/40/1a/24401a021b7bc59238ca2b91b62d0c90.jpg",
    youtubeId: "gCcx85zbxz4",
  },
  {
    id: 6,
    title: "Into The Spider-Verse",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    description:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    release: "Streaming now",
    rating: 8.4,
    poster:
      "https://i.pinimg.com/736x/01/c2/4c/01c24c9c59f49a895d8979ff02e6342b.jpg",
    youtubeId: "g4Hbz2jLxvQ",
  },
  {
    id: 7,
    title: "The Wolf of Wall Street",
    genres: ["Crime", "Comedy"],
    description:
      "A stockbroker rises to extreme wealth and corruption on Wall Street.",
    release: "2013",
    rating: 8.2,
    poster:
      "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzObOgb.jpg",
    youtubeId: "iszwuX1AK6A",
  },
  {
    id: 8,
    title: "Interstellar",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "Explorers travel through a wormhole in search of a new home for humanity.",
    release: "2014",
    rating: 8.7,
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    youtubeId: "zSWdZVtXT7E",
  },
  {
    id: 9,
    title: "Anyone But You",
    genres: ["Romance", "Comedy"],
    description:
      "Two rivals pretend to be a couple at a wedding but their fake relationship becomes complicated.",
    release: "2023",
    rating: 6.2,
    poster:
      "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    youtubeId: "bMNPn2HI7rE",
  },
  {
    id: 10,
    title: "Inception",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "A thief who steals secrets through dream-sharing technology is given an impossible mission.",
    release: "2010",
    rating: 8.8,
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    youtubeId: "YoHD9XEInc0",
  },
  {
    id: 11,
    title: "Poor Things",
    genres: ["Comedy", "Sci-Fi"],
    description:
      "A woman resurrected by an eccentric scientist explores the world with childlike curiosity.",
    release: "2023",
    rating: 7.9,
    poster:
      "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXIf5p7oPxs5vAA.jpg",
    youtubeId: "RlbR5N6veqw",
  },
  {
    id: 12,
    title: "10 Things I Hate About You",
    genres: ["Romance", "Comedy"],
    description:
      "A high school romance unfolds through a clever dating scheme.",
    release: "1999",
    rating: 7.3,
    poster:
      "https://image.tmdb.org/t/p/w500/s1FhMAr91WL8LuGZAFnCRHXHCSC.jpg",
    youtubeId: "HBsOt21NWEI",
  },
  {
    id: 13,
    title: "Breaking Bad",
    genres: ["Crime", "Drama"],
    description:
      "A chemistry teacher turns to making meth after being diagnosed with cancer.",
    release: "2008",
    rating: 9.5,
    poster:
      "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    youtubeId: "HhesaQXLuRY",
  },
  {
    id: 14,
    title: "Stranger Things",
    genres: ["Sci-Fi", "Horror"],
    description:
      "Kids uncover supernatural forces and secret experiments in their town.",
    release: "2016",
    rating: 8.7,
    poster:
      "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    youtubeId: "b9EkMc79ZSU",
  },
  {
    id: 15,
    title: "The Last of Us",
    genres: ["Drama", "Sci-Fi"],
    description:
      "A hardened survivor escorts a girl across a post-apocalyptic America.",
    release: "2023",
    rating: 8.8,
    poster:
      "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    youtubeId: "uLtkt8BonwM",
  },
  {
    id: 16,
    title: "Severance",
    genres: ["Sci-Fi", "Thriller"],
    description:
      "Employees undergo a procedure separating work memories from personal life.",
    release: "2022",
    rating: 8.7,
    poster:
      "https://image.tmdb.org/t/p/w500/lNqT4Y3fCdwKqHc36u0nNzM5GhF.jpg",
    youtubeId: "xEQP4VVuyrY",
  },
];

export default MOVIES;