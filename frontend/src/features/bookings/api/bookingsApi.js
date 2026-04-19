const MOCK_PAYMENT_DELAY_MS = 1100;
const MOCK_PAYMENT_SUCCESS_RATE = 0.72;

function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function formatShowDate(value) {
	if (!value) return "Date TBA";

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return String(value);
	}

	return parsedDate.toLocaleDateString("en-US", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function resolveSeatLabels(selectedSeats = []) {
	return selectedSeats.map((seat) => {
		const rowLabel = String.fromCharCode(64 + Number(seat.rowNumber || 0));
		return `${rowLabel}${seat.seatNumber}`;
	});
}

function generateBookingId(bookingSessionId = "") {
	const base = String(bookingSessionId || "session")
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "")
		.slice(-6)
		.padStart(6, "X");

	return `CNF-${base}`;
}

function buildConfirmationPayload({
	bookingSessionId,
	movieTitle,
	showDate,
	showTime,
	theaterName,
	selectedSeats,
}) {
	const bookingId = generateBookingId(bookingSessionId);
	const seats = resolveSeatLabels(selectedSeats);

	return {
		movieTitle: movieTitle || "Selected Movie",
		posterSrc:
			"https://i.pinimg.com/736x/38/88/6a/38886aa55d01fa7d3e801b77f1289897.jpg",
		theaterName: theaterName || "PVR Cinemas",
		theaterAddress:
			"Forum Mall, Koramangala, Bengaluru, Karnataka 560095",
		showDate: formatShowDate(showDate),
		showTime: showTime || "Time TBA",
		auditorium: "Audi 03",
		seats,
		bookingId,
		qrValue: `${bookingId}|${movieTitle || "Selected Movie"}|${showDate || "Date-TBA"}|${showTime || "Time-TBA"}|${seats.join(",")}`,
	};
}

function resolvePaymentSuccess(outcome = "random") {
	if (outcome === "success") {
		return true;
	}

	if (outcome === "failure") {
		return false;
	}

	return Math.random() <= MOCK_PAYMENT_SUCCESS_RATE;
}

export async function submitMockPayment({
	bookingSessionId,
	movieTitle,
	showDate,
	showTime,
	theaterName,
	selectedSeats,
	outcome = "random",
} = {}) {
	await wait(MOCK_PAYMENT_DELAY_MS);

	const isSuccess = resolvePaymentSuccess(outcome);

	if (!isSuccess) {
		return {
			ok: false,
			message:
				"Payment could not be completed. Please retry or use another payment method.",
		};
	}

	return {
		ok: true,
		confirmation: buildConfirmationPayload({
			bookingSessionId,
			movieTitle,
			showDate,
			showTime,
			theaterName,
			selectedSeats,
		}),
	};
}
