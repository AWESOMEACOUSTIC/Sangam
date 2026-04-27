import { useMemo, useState } from "react";
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

	const [manualSelectedShowtimeId, setManualSelectedShowtimeId] = useState("");

	const selectedShowtimeId = useMemo(() => {
		const hasManualSelection = showtimes.some(
			(showtime) => showtime.id === manualSelectedShowtimeId
		);

		if (hasManualSelection) {
			return manualSelectedShowtimeId;
		}

		return showtimes[0]?.id ?? "";
	}, [manualSelectedShowtimeId, showtimes]);

	const selectedShowtime = useMemo(() => {
		return showtimes.find((showtime) => showtime.id === selectedShowtimeId) ?? null;
	}, [selectedShowtimeId, showtimes]);

	return {
		showtimes,
		selectedShowtime,
		selectedShowtimeId,
		setSelectedShowtimeId: setManualSelectedShowtimeId,
	};
}
