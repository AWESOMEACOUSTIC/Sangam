import { useCallback, useMemo, useState } from "react";
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

function buildInitialRows() {
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
}

function toSeatKey(rowNumber, seatNumber) {
	return `${rowNumber}-${seatNumber}`;
}

export default function useSeatSelection() {
	const [rows, setRows] = useState(() => buildInitialRows());
	const [hoveredSeatKey, setHoveredSeatKey] = useState("");

	const toggleSeat = useCallback((seat) => {
		if (!seat) return;

		setRows((previousRows) =>
			previousRows.map((row) => {
				if (row.rowNumber !== seat.rowNumber) {
					return row;
				}

				const toggleSeatStatus = (rowSeat) => {
					if (rowSeat.seatNumber !== seat.seatNumber) {
						return rowSeat;
					}

					if (rowSeat.status === SEAT_STATUS.RESERVED) {
						return rowSeat;
					}

					const nextStatus =
						rowSeat.status === SEAT_STATUS.SELECTED
							? SEAT_STATUS.AVAILABLE
							: SEAT_STATUS.SELECTED;

					return {
						...rowSeat,
						status: nextStatus,
					};
				};

				return {
					...row,
					leftSeats: row.leftSeats.map(toggleSeatStatus),
					rightSeats: row.rightSeats.map(toggleSeatStatus),
				};
			})
		);
	}, []);

	const startSeatHover = useCallback((seat) => {
		if (!seat || seat.status === SEAT_STATUS.RESERVED) {
			setHoveredSeatKey("");
			return;
		}

		setHoveredSeatKey(toSeatKey(seat.rowNumber, seat.seatNumber));
	}, []);

	const clearSeatHover = useCallback(() => {
		setHoveredSeatKey("");
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

	const hoveredSeat = useMemo(() => {
		if (!hoveredSeatKey) return null;

		for (const row of rows) {
			for (const seat of [...row.leftSeats, ...row.rightSeats]) {
				if (toSeatKey(seat.rowNumber, seat.seatNumber) === hoveredSeatKey) {
					return seat;
				}
			}
		}

		return null;
	}, [hoveredSeatKey, rows]);

	return {
		rows,
		selectedSeats,
		totalPrice,
		hoveredSeat,
		toggleSeat,
		startSeatHover,
		clearSeatHover,
	};
}
