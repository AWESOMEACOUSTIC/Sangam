import { useMemo } from "react";
import {
	DEFAULT_SEAT_PRICE,
	SEAT_LAYOUT_TEMPLATE,
	SEAT_STATUS,
} from "../constants/bookingConstants";

function withSeatNumbers(rowNumber, statuses, startingSeatNumber = 1) {
	let seatNumber = startingSeatNumber;

	return statuses.map((status) => ({
		rowNumber,
		seatNumber: seatNumber++,
		status,
		price: DEFAULT_SEAT_PRICE,
	}));
}

export default function useSeatSelection() {
	const rows = useMemo(() => {
		return SEAT_LAYOUT_TEMPLATE.map((row) => {
			const leftSeats = withSeatNumbers(row.rowNumber, row.left, 1);
			const rightSeats = withSeatNumbers(
				row.rowNumber,
				row.right,
				leftSeats.length + 1
			);

			return {
				rowNumber: row.rowNumber,
				leftSeats,
				rightSeats,
			};
		});
	}, []);

	const selectedSeats = useMemo(() => {
		return rows.flatMap((row) =>
			[...row.leftSeats, ...row.rightSeats].filter(
				(seat) => seat.status === SEAT_STATUS.SELECTED
			)
		);
	}, [rows]);

	const totalPrice = useMemo(() => {
		return selectedSeats.reduce((total, seat) => total + seat.price, 0);
	}, [selectedSeats]);

	return {
		rows,
		selectedSeats,
		totalPrice,
	};
}
