export const bookingPaths = Object.freeze({
	seatLayout: "/shows/:showId/seats",
	checkout: "/checkout/:bookingSessionId",
	confirmation: "/movietickets",
	myBookings: "/bookings",
});

export function buildSeatLayoutPath({
	showId,
	movieId,
	movieTitle,
	posterSrc,
	date,
	showTime,
	theater,
} = {}) {
	if (showId == null || showId === "") {
		return bookingPaths.seatLayout;
	}

	const basePath = `/shows/${encodeURIComponent(String(showId))}/seats`;

	const queryParams = new URLSearchParams();

	if (movieId != null && movieId !== "") {
		queryParams.set("movieId", String(movieId));
	}

	if (movieTitle) {
		queryParams.set("movieTitle", String(movieTitle));
	}

	if (posterSrc) {
		queryParams.set("posterSrc", String(posterSrc));
	}

	if (date) {
		queryParams.set("date", String(date));
	}

	if (showTime) {
		queryParams.set("showTime", String(showTime));
	}

	if (theater) {
		queryParams.set("theater", String(theater));
	}

	const queryString = queryParams.toString();
	return queryString ? `${basePath}?${queryString}` : basePath;
}

export function buildBookingConfirmationPath() {
	return bookingPaths.confirmation;
}

export function buildMyBookingsPath() {
	return bookingPaths.myBookings;
}

export function buildCheckoutPath({ bookingSessionId } = {}) {
	if (bookingSessionId == null || bookingSessionId === "") {
		return bookingPaths.checkout;
	}

	return `/checkout/${encodeURIComponent(String(bookingSessionId))}`;
}
