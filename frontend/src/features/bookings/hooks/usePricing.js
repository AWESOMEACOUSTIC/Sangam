import { useMemo } from "react";
import {
	DEFAULT_SEAT_PRICE,
	SEAT_CLASS,
	SEAT_CLASS_DETAILS,
} from "../constants/bookingConstants";

const SEAT_CLASS_ORDER = [
	SEAT_CLASS.STANDARD,
	SEAT_CLASS.PRIME,
	SEAT_CLASS.RECLINER,
];

function resolveSeatClassLabel(seatClass) {
	return SEAT_CLASS_DETAILS[seatClass]?.label ?? "Standard";
}

function resolveSeatClassUnitPrice(seatClass) {
	return SEAT_CLASS_DETAILS[seatClass]?.price ?? DEFAULT_SEAT_PRICE;
}

function resolveSeatPrice(seat) {
	if (seat && typeof seat.price === "number") {
		return seat.price;
	}

	return resolveSeatClassUnitPrice(seat?.seatClass);
}

export default function usePricing(selectedSeats = []) {
	return useMemo(() => {
		if (!selectedSeats.length) {
			return {
				seatCount: 0,
				classBreakdown: [],
				subtotal: 0,
				totalPrice: 0,
			};
		}

		const classBreakdownMap = new Map();

		for (const seat of selectedSeats) {
			const seatClass = seat?.seatClass ?? SEAT_CLASS.STANDARD;
			const seatPrice = resolveSeatPrice(seat);

			if (!classBreakdownMap.has(seatClass)) {
				classBreakdownMap.set(seatClass, {
					seatClass,
					seatClassLabel: resolveSeatClassLabel(seatClass),
					seatCount: 0,
					unitPrice: resolveSeatClassUnitPrice(seatClass),
					lineTotal: 0,
				});
			}

			const classEntry = classBreakdownMap.get(seatClass);
			classEntry.seatCount += 1;
			classEntry.lineTotal += seatPrice;
		}

		const classBreakdown = [...classBreakdownMap.values()].sort((a, b) => {
			return (
				SEAT_CLASS_ORDER.indexOf(a.seatClass) -
				SEAT_CLASS_ORDER.indexOf(b.seatClass)
			);
		});

		const subtotal = classBreakdown.reduce(
			(total, entry) => total + entry.lineTotal,
			0
		);

		return {
			seatCount: selectedSeats.length,
			classBreakdown,
			subtotal,
			totalPrice: subtotal,
		};
	}, [selectedSeats]);
}
