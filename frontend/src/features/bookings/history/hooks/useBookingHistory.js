import { useCallback, useState } from "react";

const BOOKING_HISTORY_STORAGE_KEY = "sangam.bookingHistory.v1";
const MAX_BOOKING_HISTORY_ITEMS = 20;

function canUseStorage() {
	return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isBookingRecord(value) {
	return Boolean(
		value &&
			typeof value === "object" &&
			typeof value.bookingId === "string" &&
			value.bookingId
	);
}

function readBookingHistory() {
	if (!canUseStorage()) {
		return [];
	}

	try {
		const rawValue = window.localStorage.getItem(BOOKING_HISTORY_STORAGE_KEY);
		if (!rawValue) {
			return [];
		}

		const parsedValue = JSON.parse(rawValue);
		if (!Array.isArray(parsedValue)) {
			return [];
		}

		return parsedValue.filter(isBookingRecord).slice(0, MAX_BOOKING_HISTORY_ITEMS);
	} catch {
		return [];
	}
}

function saveBookingHistory(history) {
	if (!canUseStorage()) {
		return;
	}

	try {
		window.localStorage.setItem(
			BOOKING_HISTORY_STORAGE_KEY,
			JSON.stringify(history)
		);
	} catch {
		// Ignore storage errors so UI can continue to work.
	}
}

function haveSameHistory(leftList, rightList) {
	if (leftList.length !== rightList.length) {
		return false;
	}

	for (let index = 0; index < leftList.length; index += 1) {
		const left = leftList[index];
		const right = rightList[index];

		if (
			left?.bookingId !== right?.bookingId ||
			left?.qrValue !== right?.qrValue ||
			left?.showDate !== right?.showDate ||
			left?.showTime !== right?.showTime
		) {
			return false;
		}
	}

	return true;
}

export default function useBookingHistory() {
	const [bookingHistory, setBookingHistory] = useState(() => readBookingHistory());

	const upsertBooking = useCallback((booking) => {
		if (!isBookingRecord(booking)) {
			return;
		}

		setBookingHistory((previousHistory) => {
			const existingEntry = previousHistory.find(
				(entry) => entry.bookingId === booking.bookingId
			);
			const bookingWithMetadata = {
				...booking,
				createdAt: existingEntry?.createdAt || new Date().toISOString(),
			};

			const historyWithoutCurrent = previousHistory.filter(
				(entry) => entry.bookingId !== booking.bookingId
			);

			const nextHistory = [bookingWithMetadata, ...historyWithoutCurrent].slice(
				0,
				MAX_BOOKING_HISTORY_ITEMS
			);

			if (haveSameHistory(previousHistory, nextHistory)) {
				return previousHistory;
			}

			saveBookingHistory(nextHistory);
			return nextHistory;
		});
	}, []);

	return {
		bookingHistory,
		upsertBooking,
	};
}
