export const bookingPaths = Object.freeze({
	seatLayout: "/movies/:id/:date",
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
