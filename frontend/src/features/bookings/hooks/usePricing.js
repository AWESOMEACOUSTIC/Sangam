import { useMemo } from "react";
import {
	DEFAULT_SEAT_PRICE,
	PRICING_RULES,
	SEAT_CLASS,
	SEAT_CLASS_DETAILS,
} from "../constants/bookingConstants";

const SEAT_CLASS_ORDER = [
	SEAT_CLASS.STANDARD,
	SEAT_CLASS.PRIME,
	SEAT_CLASS.RECLINER,
];

function roundCurrency(value) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

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
				lineItems: [],
				subtotal: 0,
				convenienceFee: 0,
				orderProcessingFee: 0,
				taxAmount: 0,
				feesAndTaxesTotal: 0,
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

		const convenienceFee = roundCurrency(
			selectedSeats.length * PRICING_RULES.CONVENIENCE_FEE_PER_SEAT
		);
		const orderProcessingFee = roundCurrency(PRICING_RULES.ORDER_PROCESSING_FEE);
		const taxableAmount = subtotal + convenienceFee + orderProcessingFee;
		const taxAmount = roundCurrency(taxableAmount * PRICING_RULES.TAX_RATE);
		const feesAndTaxesTotal = roundCurrency(
			convenienceFee + orderProcessingFee + taxAmount
		);
		const totalPrice = roundCurrency(subtotal + feesAndTaxesTotal);

		const lineItems = [
			{ id: "subtotal", label: "Seat Subtotal", amount: roundCurrency(subtotal) },
			{
				id: "convenience-fee",
				label: `Convenience Fee (${selectedSeats.length} x $${PRICING_RULES.CONVENIENCE_FEE_PER_SEAT})`,
				amount: convenienceFee,
			},
			{
				id: "order-processing",
				label: "Order Processing Fee",
				amount: orderProcessingFee,
			},
			{
				id: "tax",
				label: `Tax (${Math.round(PRICING_RULES.TAX_RATE * 100)}%)`,
				amount: taxAmount,
			},
		];

		return {
			seatCount: selectedSeats.length,
			classBreakdown,
			lineItems,
			subtotal: roundCurrency(subtotal),
			convenienceFee,
			orderProcessingFee,
			taxAmount,
			feesAndTaxesTotal,
			totalPrice,
		};
	}, [selectedSeats]);
}
