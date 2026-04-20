const MOCK_BOOKING_SESSION_DELAY_MS = 700;
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

function normalizeSeatForSession(seat = {}, index = 0) {
	const rowNumber = Number(seat.rowNumber || 0);
	const seatNumber = Number(seat.seatNumber || 0);
	const rowLabel = String.fromCharCode(64 + rowNumber);

	return {
		id: `${rowNumber}-${seatNumber}-${index}`,
		rowNumber,
		seatNumber,
		seatLabel: `${rowLabel}${seatNumber}`,
		seatClassKey: seat.seatClassKey || "standard",
		seatClassLabel: seat.seatClassLabel || "Standard",
		price: Number(seat.price ?? 0),
	};
}

function buildPricingSnapshot(normalizedSeats = [], pricing = {}) {
	const seatSubtotal = normalizedSeats.reduce(
		(total, seat) => total + Number(seat.price ?? 0),
		0
	);

	return {
		seatCount: Number(pricing.seatCount ?? normalizedSeats.length),
		subtotal: Number(pricing.subtotal ?? seatSubtotal),
		convenienceFee: Number(pricing.convenienceFee ?? 0),
		orderProcessingFee: Number(pricing.orderProcessingFee ?? 0),
		taxAmount: Number(pricing.taxAmount ?? 0),
		totalPrice: Number(pricing.totalPrice ?? seatSubtotal),
	};
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
	posterSrc,
	showDate,
	showTime,
	theaterName,
	selectedSeats,
}) {
	const bookingId = generateBookingId(bookingSessionId);
	const seats = resolveSeatLabels(selectedSeats);

	return {
		movieTitle: movieTitle || "Selected Movie",
		posterSrc: posterSrc || "",
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

export async function getMockBookingSession({
	bookingSessionId,
	showId,
	movieTitle,
	posterSrc,
	showDate,
	showTime,
	theaterName,
	selectedSeats,
	pricing,
} = {}) {
	await wait(MOCK_BOOKING_SESSION_DELAY_MS);

	if (!bookingSessionId) {
		return {
			ok: false,
			message: "Checkout session id is missing.",
		};
	}

	if (!Array.isArray(selectedSeats) || !selectedSeats.length) {
		return {
			ok: false,
			message: "No selected seats were found for this checkout session.",
		};
	}

	const normalizedSeats = selectedSeats.map(normalizeSeatForSession);
	const pricingSnapshot = buildPricingSnapshot(normalizedSeats, pricing);

	return {
		ok: true,
		session: {
			bookingSessionId: String(bookingSessionId),
			showId: showId ? String(showId) : "",
			status: "pending_payment",
			holdExpiresAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
			movieTitle: movieTitle || "Selected Movie",
			posterSrc: posterSrc || "",
			showDate: formatShowDate(showDate),
			rawShowDate: showDate || "",
			showTime: showTime || "Time TBA",
			theaterName: theaterName || "PVR Cinemas",
			theaterAddress:
				"Forum Mall, Koramangala, Bengaluru, Karnataka 560095",
			auditorium: "Audi 03",
			paymentMethods: ["UPI", "Card", "Net Banking", "Wallet"],
			seats: normalizedSeats,
			pricing: pricingSnapshot,
		},
	};
}

export async function submitMockPayment({
	bookingSessionId,
	movieTitle,
	posterSrc,
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
			posterSrc,
			showDate,
			showTime,
			theaterName,
			selectedSeats,
		}),
	};
}
