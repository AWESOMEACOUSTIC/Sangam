export const bookingPaths = Object.freeze({
	seatLayout: "/movies/:id/:date",
	checkout: "/checkout/:bookingSessionId",
	confirmation: "/movietickets",
	myBookings: "/bookings",
});

export function buildSeatLayoutPath({ movieId, date }) {
	if (movieId == null || date == null) {
		return bookingPaths.seatLayout;
	}

	return `/movies/${encodeURIComponent(String(movieId))}/${encodeURIComponent(
		String(date)
	)}`;
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
