const MOVIES = [
  {
    id: 1,
    type: "movie",
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
    type: "movie",
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
    type: "movie",
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
    type: "movie",
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
    type: "movie",
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
    type: "movie",
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
    type: "movie",
    title: "The Wolf of Wall Street",
    genres: ["Crime", "Comedy"],
    description:
      "A stockbroker rises to extreme wealth and corruption on Wall Street.",
    release: "2013",
    rating: 8.2,
    poster:
      "https://i.pinimg.com/1200x/e4/f7/36/e4f736f717cf4c7737f698c2d8ff117d.jpg",
    youtubeId: "iszwuX1AK6A",
  },
  {
    id: 8,
    type: "movie",
    title: "The Beekeeper",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "Explorers travel through a wormhole in search of a new home for humanity.",
    release: "2014",
    rating: 8.7,
    poster:
      "https://i.pinimg.com/736x/29/50/48/2950486f7783090c0bb0310e23d5d421.jpg",
    youtubeId: "zSWdZVtXT7E",
  },
  {
    id: 9,
    type: "movie",
    title: "Anyone But You",
    genres: ["Romance", "Comedy"],
    description:
      "Two rivals pretend to be a couple at a wedding but their fake relationship becomes complicated.",
    release: "2023",
    rating: 6.2,
    poster:
      "https://i.pinimg.com/736x/9a/d1/1b/9ad11bc8792ed7ee8a49f9c26b07600c.jpg",
    youtubeId: "bMNPn2HI7rE",
  },
  {
    id: 10,
    type: "movie",
    title: "Inception",
    genres: ["Sci-Fi", "Adventure"],
    description:
      "A thief who steals secrets through dream-sharing technology is given an impossible mission.",
    release: "2010",
    rating: 8.8,
    poster:
      "https://i.pinimg.com/736x/50/ed/10/50ed1058240fcc82a5bbf52edc2680b4.jpg",
    youtubeId: "YoHD9XEInc0",
  },
  {
    id: 11,
    type: "movie",
    title: "Poor Things",
    genres: ["Comedy", "Sci-Fi"],
    description:
      "A woman resurrected by an eccentric scientist explores the world with childlike curiosity.",
    release: "2023",
    rating: 7.9,
    poster:
      "https://i.pinimg.com/736x/ee/7d/b7/ee7db7325b17fc882356e5b82a44b756.jpg",
    youtubeId: "RlbR5N6veqw",
  },
  {
    id: 12,
    type: "movie",
    title: "10 Things I Hate About You",
    genres: ["Romance", "Comedy"],
    description:
      "A high school romance unfolds through a clever dating scheme.",
    release: "1999",
    rating: 7.3,
    poster:
      "https://i.pinimg.com/736x/fc/31/09/fc3109b7595900ec3709e4400db213ef.jpg",
    youtubeId: "HBsOt21NWEI",
  },
  {
    id: 13,
    type: "tv",
    title: "Breaking Bad",
    genres: ["Crime", "Drama"],
    description:
      "A chemistry teacher turns to making meth after being diagnosed with cancer.",
    release: "2008",
    rating: 9.5,
    poster:
      "https://i.pinimg.com/1200x/37/62/75/37627587496965efcc0ae42ac9dff525.jpg",
    youtubeId: "HhesaQXLuRY",
  },
  {
    id: 14,
    type: "tv",
    title: "Stranger Things",
    genres: ["Sci-Fi", "Horror"],
    description:
      "Kids uncover supernatural forces and secret experiments in their town.",
    release: "2016",
    rating: 8.7,
    poster:
      "https://i.pinimg.com/736x/91/17/75/9117751636528b25a7b4687cab63572d.jpg",
    youtubeId: "b9EkMc79ZSU",
  },
  {
    id: 15,
    type: "tv",
    title: "The Last of Us",
    genres: ["Drama", "Sci-Fi"],
    description:
      "A hardened survivor escorts a girl across a post-apocalyptic America.",
    release: "2023",
    rating: 8.8,
    poster:
      "https://i.pinimg.com/1200x/06/54/93/065493530ecea598250927fc0911ea12.jpg",
    youtubeId: "uLtkt8BonwM",
  },
  {
    id: 16,
    type: "tv",
    title: "Severance",
    genres: ["Sci-Fi", "Thriller"],
    description:
      "Employees undergo a procedure separating work memories from personal life.",
    release: "2022",
    rating: 8.7,
    poster:
      "https://i.pinimg.com/736x/65/41/15/65411578f2fa5e1d2050542e23edfb28.jpg",
    youtubeId: "xEQP4VVuyrY",
  },
];

export default MOVIES;