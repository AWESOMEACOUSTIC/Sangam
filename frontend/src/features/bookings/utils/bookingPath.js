export const bookingPaths = Object.freeze({
	seatLayout: "/movies/:id/:date",
	checkout: "/checkout/:bookingSessionId",
	confirmation: "/movietickets",
	myBookings: "/bookings",
});

export function buildSeatLayoutPath({
	movieId,
	date,
	showId,
	showTime,
	theater,
} = {}) {
	if (movieId == null || date == null) {
		return bookingPaths.seatLayout;
	}

	const basePath = `/movies/${encodeURIComponent(String(movieId))}/${encodeURIComponent(
		String(date)
	)}`;

	const queryParams = new URLSearchParams();

	if (showId) {
		queryParams.set("showId", String(showId));
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
