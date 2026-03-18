import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MOVIES from "../../../data/movies";
import MovieCard from "../../../common/components/MovieCard";
import DraggableCarousel from "../../../common/components/DraggableCarousel";
import TrailerModal from "../../../common/components/TrailerModal";

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

export default function FreshOnDemand() {
	const [activeMovie, setActiveMovie] = useState(null);

	const topMovies = useMemo(() => {
		return MOVIES.filter((movie) => (movie.type ?? "movie") === "movie")
			.sort((a, b) => (a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY))
			.slice(0, 10);
	}, []);

	const topTvShows = useMemo(() => {
		return MOVIES.filter((movie) => movie.type === "tv")
			.sort((a, b) => (a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY))
			.slice(0, 10);
	}, []);

	const handleWatchTrailer = useCallback((movie) => {
		setActiveMovie(movie);
	}, []);

	const handleCloseModal = useCallback(() => {
		setActiveMovie(null);
	}, []);

	return (
		<>
			<section
				className="w-full min-h-screen px-4 sm:px-8
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
						<div className="px-4 py-2 inline-block">
							<h1
								className="text-3xl sm:text-4xl font-extrabold
													 text-yellow-400 leading-tight"
							>
								Fresh on Demand
							</h1>
							<div className="mt-6 flex items-center gap-2">
								<div className="w-1 h-6 bg-yellow-400"></div>
								<h2 className="text-xl sm:text-2xl font-bold text-white">
									Top 10 movies on IMDb this week
								</h2>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Movies Carousel */}
				<AnimatePresence mode="wait">
					<motion.div
						variants={listVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<DraggableCarousel gap="gap-6">
							{topMovies.map((movie, index) => (
								<motion.div
									key={movie.id}
									variants={itemVariants}
									className="relative flex items-end pl-14 sm:pl-16 md:pl-20"
								>
									<span
										aria-hidden="true"
										className="absolute left-0 bottom-2 font-[anton]
											text-[7rem] sm:text-[8.5rem] md:text-[14rem]
											font-extrabold leading-none text-zinc-600/50
											select-none pointer-events-none"
									>
										{index + 1}
									</span>
									<div className="relative z-10">
										<MovieCard
											movie={movie}
											onWatchTrailer={handleWatchTrailer}
										/>
									</div>
								</motion.div>
							))}
						</DraggableCarousel>
					</motion.div>
				</AnimatePresence>

				{/* Empty state movies */}
				<AnimatePresence>
					{topMovies.length === 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="text-center py-20 text-zinc-600 text-sm"
						>
							No titles found.
						</motion.div>
					)}
				</AnimatePresence>

				{/* TV Shows Header */}
				<div className="mb-8 mt-16">
					<motion.div
						initial={{ opacity: 0, y: -16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="inline-block"
					>
						<div className="px-4 py-2 inline-block">
							<div className="flex items-center gap-2">
								<div className="w-1 h-6 bg-yellow-400"></div>
								<h2 className="text-xl sm:text-2xl font-bold text-white">
									Top 10 TV Shows on IMDb this week
								</h2>
							</div>
						</div>
					</motion.div>
				</div>

				{/* TV Shows Carousel */}
				<AnimatePresence mode="wait">
					<motion.div
						variants={listVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						exit="exit"
					>
						<DraggableCarousel gap="gap-6">
							{topTvShows.map((show, index) => (
								<motion.div
									key={show.id}
									variants={itemVariants}
									className="relative flex items-end pl-14 sm:pl-16 md:pl-20"
								>
									<span
										aria-hidden="true"
										className="absolute left-0 bottom-2 font-[anton]
											text-[7rem] sm:text-[8.5rem] md:text-[14rem]
											font-extrabold leading-none text-zinc-600/50
											select-none pointer-events-none"
									>
										{index + 1}
									</span>
									<div className="relative z-10">
										<MovieCard
											movie={show}
											onWatchTrailer={handleWatchTrailer}
										/>
									</div>
								</motion.div>
							))}
						</DraggableCarousel>
					</motion.div>
				</AnimatePresence>

				{/* Empty state TV Shows */}
				<AnimatePresence>
					{topTvShows.length === 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="text-center py-20 text-zinc-600 text-sm"
						>
							No titles found.
						</motion.div>
					)}
				</AnimatePresence>
			</section>

			{/* Trailer Modal */}
			<TrailerModal movie={activeMovie} onClose={handleCloseModal} />
		</>
	);
}
