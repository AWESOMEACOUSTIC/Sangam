function toIsoDateFromToday(daysToAdd = 0) {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + daysToAdd);
	return date.toISOString().slice(0, 10);
}

function toShowId(movieId, date, time, theater) {
	const cleanTime = String(time).replace(/[^a-z0-9]/gi, "").toLowerCase();
	const cleanTheater = String(theater)
		.replace(/[^a-z0-9]/gi, "")
		.toLowerCase();

	return `${movieId}-${date}-${cleanTime}-${cleanTheater}`;
}

const DEFAULT_SHOWTIME_TEMPLATE = [
	{ date: toIsoDateFromToday(0), time: "10:30 AM", theater: "PVR Forum" },
	{ date: toIsoDateFromToday(0), time: "2:15 PM", theater: "INOX Nexus" },
	{ date: toIsoDateFromToday(0), time: "6:10 PM", theater: "Cinepolis Orion" },
	{ date: toIsoDateFromToday(1), time: "9:00 PM", theater: "PVR Forum" },
];

const MOVIE_SHOWTIME_OVERRIDES = {
	10: [
		{ date: toIsoDateFromToday(0), time: "11:00 AM", theater: "PVR Cinemas" },
		{ date: toIsoDateFromToday(0), time: "3:45 PM", theater: "INOX City" },
		{ date: toIsoDateFromToday(1), time: "7:30 PM", theater: "Cinepolis Mall" },
	],
	19: [
		{ date: toIsoDateFromToday(0), time: "12:10 PM", theater: "PVR Grand" },
		{ date: toIsoDateFromToday(0), time: "4:20 PM", theater: "INOX Arena" },
		{ date: toIsoDateFromToday(1), time: "8:40 PM", theater: "PVR Grand" },
	],
};

export function getShowtimeOptions(movieId) {
	if (movieId == null) return [];

	const numericMovieId = Number(movieId);
	const template = MOVIE_SHOWTIME_OVERRIDES[numericMovieId] ?? DEFAULT_SHOWTIME_TEMPLATE;

	return template.map((showtime) => ({
		...showtime,
		id: toShowId(numericMovieId, showtime.date, showtime.time, showtime.theater),
	}));
}
