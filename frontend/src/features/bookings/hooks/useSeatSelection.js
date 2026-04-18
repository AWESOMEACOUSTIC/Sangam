import { useCallback, useEffect, useMemo, useState } from "react";
import {
	DEFAULT_SEAT_PRICE,
	MAX_SEAT_SELECTION,
	resolveSeatClassByRow,
	SEAT_CLASS_DETAILS,
	SEAT_LAYOUT_TEMPLATE,
	SEAT_STATUS,
} from "../constants/bookingConstants";

const MOCK_SEAT_MAP_DELAY_MS = 350;
const SEAT_MAP_LOAD_ERROR = "We couldn't load seats right now. Please try again.";

function withSeatNumbers(rowNumber, statuses, startingSeatNumber = 1) {
	let seatNumber = startingSeatNumber;
	const seatClass = resolveSeatClassByRow(rowNumber);
	const seatClassDetails = SEAT_CLASS_DETAILS[seatClass];

	return statuses.map((status) => ({
		rowNumber,
		seatNumber: seatNumber++,
		status,
		seatClass,
		seatClassLabel: seatClassDetails?.label ?? "Standard",
		price: seatClassDetails?.price ?? DEFAULT_SEAT_PRICE,
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

function isSeatLockedStatus(status) {
	return (
		status === SEAT_STATUS.RESERVED ||
		status === SEAT_STATUS.SOLD ||
		status === SEAT_STATUS.BLOCKED
	);
}

function countSelectedSeats(rows) {
	return rows.reduce((count, row) => {
		const rowSelectedCount = [...row.leftSeats, ...row.rightSeats].filter(
			(seat) => seat.status === SEAT_STATUS.SELECTED
		).length;

		return count + rowSelectedCount;
	}, 0);
}

function resolveSeatMapRows({ simulateError, simulateEmpty }) {
	if (simulateError) {
		throw new Error(SEAT_MAP_LOAD_ERROR);
	}

	if (simulateEmpty) {
		return [];
	}

	return buildInitialRows();
}

export default function useSeatSelection({
	simulateError = false,
	simulateEmpty = false,
} = {}) {
	const [rows, setRows] = useState([]);
	const [hoveredSeatKey, setHoveredSeatKey] = useState("");
	const [selectionFeedback, setSelectionFeedback] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		let isCancelled = false;

		setIsLoading(true);
		setLoadError("");
		setSelectionFeedback("");
		setHoveredSeatKey("");

		const timeoutId = setTimeout(() => {
			try {
				const seatRows = resolveSeatMapRows({
					simulateError,
					simulateEmpty,
				});

				if (isCancelled) return;
				setRows(seatRows);
			} catch (error) {
				if (isCancelled) return;

				setRows([]);
				setLoadError(
					error instanceof Error && error.message
						? error.message
						: SEAT_MAP_LOAD_ERROR
				);
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		}, MOCK_SEAT_MAP_DELAY_MS);

		return () => {
			isCancelled = true;
			clearTimeout(timeoutId);
		};
	}, [simulateEmpty, simulateError, reloadToken]);

	const retryLoadSeatMap = useCallback(() => {
		setReloadToken((current) => current + 1);
	}, []);

	const toggleSeat = useCallback((seat) => {
		if (!seat || isLoading || loadError || rows.length === 0) return;
		const selectedSeatCount = countSelectedSeats(rows);
		let maxLimitReached = false;

		const nextRows = rows.map((row) => {
			if (row.rowNumber !== seat.rowNumber) {
				return row;
			}

			const toggleSeatStatus = (rowSeat) => {
				if (rowSeat.seatNumber !== seat.seatNumber) {
					return rowSeat;
				}

				if (isSeatLockedStatus(rowSeat.status)) {
					return rowSeat;
				}

				if (rowSeat.status === SEAT_STATUS.SELECTED) {
					return {
						...rowSeat,
						status: SEAT_STATUS.AVAILABLE,
					};
				}

				if (selectedSeatCount >= MAX_SEAT_SELECTION) {
					maxLimitReached = true;
					return rowSeat;
				}

				const nextStatus = SEAT_STATUS.SELECTED;

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
		});

		setRows(nextRows);
		setSelectionFeedback(
			maxLimitReached
				? `You can select up to ${MAX_SEAT_SELECTION} seats per booking.`
				: ""
		);
	}, [isLoading, loadError, rows]);

	const startSeatHover = useCallback((seat) => {
		if (isLoading || loadError || !seat || isSeatLockedStatus(seat.status)) {
			setHoveredSeatKey("");
			return;
		}

		setHoveredSeatKey(toSeatKey(seat.rowNumber, seat.seatNumber));
	}, [isLoading, loadError]);

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

	const isEmpty = useMemo(() => {
		return !isLoading && !loadError && rows.length === 0;
	}, [isLoading, loadError, rows]);

	return {
		rows,
		isLoading,
		loadError,
		isEmpty,
		retryLoadSeatMap,
		selectedSeats,
		totalPrice,
		maxSelectableSeats: MAX_SEAT_SELECTION,
		selectionFeedback,
		hoveredSeat,
		toggleSeat,
		startSeatHover,
		clearSeatHover,
	};
}
