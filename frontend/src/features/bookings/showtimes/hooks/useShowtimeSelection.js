import { useEffect, useMemo, useState } from "react";
import { getShowtimeOptions } from "../../mocks/showtimeMocks";

function formatDateLabel(dateString) {
	const date = new Date(dateString);

	if (Number.isNaN(date.getTime())) {
		return dateString;
	}

	return date.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
}

export default function useShowtimeSelection(movieId) {
	const showtimes = useMemo(() => {
		return getShowtimeOptions(movieId).map((showtime) => ({
			...showtime,
			dateLabel: formatDateLabel(showtime.date),
		}));
	}, [movieId]);

	const [selectedShowtimeId, setSelectedShowtimeId] = useState("");

	useEffect(() => {
		setSelectedShowtimeId(showtimes[0]?.id ?? "");
	}, [showtimes]);

	const selectedShowtime = useMemo(() => {
		return showtimes.find((showtime) => showtime.id === selectedShowtimeId) ?? null;
	}, [selectedShowtimeId, showtimes]);

	return {
		showtimes,
		selectedShowtime,
		selectedShowtimeId,
		setSelectedShowtimeId,
	};
}
