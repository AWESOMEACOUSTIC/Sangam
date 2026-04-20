import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePricing from "../../hooks/usePricing";
import { submitMockPayment } from "../../api/bookingsApi";
import {
	buildBookingConfirmationPath,
	buildMyBookingsPath,
	buildSeatLayoutPath,
} from "../../utils/bookingPath";

const CURRENCY_TOLERANCE = 0.01;

function formatCurrency(value) {
	const numericValue = Number(value ?? 0);

	if (Number.isInteger(numericValue)) {
		return `$${numericValue}`;
	}

	return `$${numericValue.toFixed(2)}`;
}

function isCurrencyMatch(left, right) {
	return Math.abs(Number(left ?? 0) - Number(right ?? 0)) <= CURRENCY_TOLERANCE;
}

function hasPricingSnapshotMismatch(calculatedPricing, pricingSnapshot) {
	if (!pricingSnapshot) {
		return true;
	}

	if (pricingSnapshot.seatCount !== calculatedPricing.seatCount) {
		return true;
	}

	if (!isCurrencyMatch(pricingSnapshot.subtotal, calculatedPricing.subtotal)) {
		return true;
	}

	if (
		!isCurrencyMatch(
			pricingSnapshot.convenienceFee,
			calculatedPricing.convenienceFee
		)
	) {
		return true;
	}

	if (
		!isCurrencyMatch(
			pricingSnapshot.orderProcessingFee,
			calculatedPricing.orderProcessingFee
		)
	) {
		return true;
	}

	if (!isCurrencyMatch(pricingSnapshot.taxAmount, calculatedPricing.taxAmount)) {
		return true;
	}

	if (!isCurrencyMatch(pricingSnapshot.totalPrice, calculatedPricing.totalPrice)) {
		return true;
	}

	return false;
}

function CheckoutPage() {
	const { bookingSessionId = "" } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const checkoutState = location.state ?? {};
	const {
		showId = "",
		movieTitle = "Selected Movie",
		posterSrc = "",
		date = "",
		showTime = "",
		theater = "",
		selectedSeats: selectedSeatsState,
		pricing: pricingSnapshot,
	} = checkoutState;

	const selectedSeats = Array.isArray(selectedSeatsState)
		? selectedSeatsState
		: [];
	const pricing = usePricing(selectedSeats);
	const [isPaying, setIsPaying] = useState(false);
	const [paymentError, setPaymentError] = useState("");

	const seatLayoutPath = useMemo(() => {
		return buildSeatLayoutPath({
			showId,
			movieTitle,
			posterSrc,
			date,
			showTime,
			theater,
		});
	}, [date, movieTitle, posterSrc, showId, showTime, theater]);

	const forcedPaymentOutcome = useMemo(() => {
		const paymentResult = new URLSearchParams(location.search).get(
			"paymentResult"
		);

		if (paymentResult === "success" || paymentResult === "failure") {
			return paymentResult;
		}

		return "random";
	}, [location.search]);

	const checkoutValidationErrors = useMemo(() => {
		const errors = [];

		if (!bookingSessionId) {
			errors.push("Checkout session id is missing.");
		}

		if (!selectedSeats.length) {
			errors.push("No selected seats found for this checkout session.");
		}

		if (pricing.validationErrors?.length) {
			errors.push(...pricing.validationErrors);
		}

		if (hasPricingSnapshotMismatch(pricing, pricingSnapshot)) {
			errors.push(
				"Fare details changed or are incomplete. Please review seats and continue again."
			);
		}

		return [...new Set(errors)];
	}, [bookingSessionId, pricing, pricingSnapshot, selectedSeats.length]);

	const isCheckoutValid = checkoutValidationErrors.length === 0;

	const handleProceedToPayment = async () => {
		if (!isCheckoutValid || isPaying) {
			return;
		}

		setIsPaying(true);
		setPaymentError("");

		const paymentResult = await submitMockPayment({
			bookingSessionId,
			movieTitle,
			posterSrc,
			showDate: date,
			showTime,
			theaterName: theater,
			selectedSeats,
			outcome: forcedPaymentOutcome,
		});

		if (!paymentResult.ok) {
			setPaymentError(
				paymentResult.message ||
					"Payment could not be completed. Please try again."
			);
			setIsPaying(false);
			return;
		}

		navigate(buildBookingConfirmationPath(), {
			state: {
				confirmation: paymentResult.confirmation,
				bookingSessionId,
			},
		});
	};

	if (!isCheckoutValid) {
		return (
			<main className="min-h-screen bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
				<section className="mx-auto max-w-2xl rounded-3xl border border-amber-500/25 bg-amber-950/20 p-6 sm:p-8">
					<p className="text-xs uppercase tracking-[0.18em] text-amber-200">
						Checkout blocked
					</p>

					<h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
						Unable to validate your booking summary
					</h1>

					<p className="mt-3 text-sm text-amber-100/90">
						Please return to seat selection so we can refresh your booking
						details before checkout.
					</p>

					<div className="mt-5 space-y-2">
						{checkoutValidationErrors.map((error) => (
							<p key={error} className="text-sm text-amber-100">
								- {error}
							</p>
						))}
					</div>

					<div className="mt-8 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => navigate(seatLayoutPath)}
							className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
						>
							Back To Seat Selection
						</button>

						<button
							type="button"
							onClick={() => navigate(buildMyBookingsPath())}
							className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
						>
							Go To My Bookings
						</button>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
			<div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
				<section className="rounded-3xl border border-white/10 bg-linear-to-b from-[#14142a] to-[#0d0d1c] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-8">
					<p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
						Checkout Session
					</p>
					<h1 className="mt-2 text-3xl font-bold text-white">Review And Pay</h1>
					<p className="mt-2 text-sm text-zinc-300">
						Booking Session: {bookingSessionId}
					</p>

					<div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
						<p>
							<span className="text-zinc-400">Movie:</span> {movieTitle}
						</p>
						<p className="mt-2">
							<span className="text-zinc-400">Show:</span> {date || "Date TBA"} at{" "}
							{showTime || "Time TBA"}
						</p>
						<p className="mt-2">
							<span className="text-zinc-400">Theater:</span> {theater || "TBA"}
						</p>
					</div>

					<div className="mt-6 space-y-3">
						{selectedSeats.map((seat) => (
							<div
								key={`checkout-seat-${seat.rowNumber}-${seat.seatNumber}`}
								className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200"
							>
								<div>
									<p>
										Row {seat.rowNumber} / Seat {seat.seatNumber}
									</p>
									<p className="text-xs uppercase tracking-[0.08em] text-zinc-400">
										{seat.seatClassLabel}
									</p>
								</div>
								<p className="font-semibold text-white">
									{formatCurrency(seat.price)}
								</p>
							</div>
						))}
					</div>
				</section>

				<aside className="rounded-3xl border border-white/10 bg-linear-to-b from-[#14142a] to-[#0d0d1c] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
					<p className="text-lg font-semibold uppercase tracking-[0.08em] text-white/90">
						Fare Summary
					</p>

					<p className="mt-2 text-xs text-zinc-400">
						{forcedPaymentOutcome === "random"
							? "Mock payment mode: random success/failure"
							: `Mock payment mode: forced ${forcedPaymentOutcome}`}
					</p>

					<div className="mt-4 space-y-2">
						{pricing.lineItems.map((line) => (
							<div
								key={`checkout-line-${line.id}`}
								className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-zinc-400"
							>
								<span>{line.label}</span>
								<span>{formatCurrency(line.amount)}</span>
							</div>
						))}
					</div>

					<div className="mt-5 border-t border-white/10 pt-4">
						<div className="flex items-center justify-between text-base text-zinc-300">
							<span>Fees + Taxes</span>
							<span>{formatCurrency(pricing.feesAndTaxesTotal)}</span>
						</div>
						<div className="mt-2 flex items-center justify-between text-xl font-semibold text-cyan-400">
							<span>Total</span>
							<span>{formatCurrency(pricing.totalPrice)}</span>
						</div>
					</div>

					{paymentError ? (
						<div
							role="alert"
							className="mt-4 rounded-xl border border-red-500/25 bg-red-950/30 px-3 py-2"
						>
							<p className="text-xs text-red-200">{paymentError}</p>
						</div>
					) : null}

					<button
						type="button"
						onClick={handleProceedToPayment}
						disabled={isPaying}
						className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(248,69,101,0.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
					>
						{isPaying ? "Processing Payment..." : "Proceed To Payment"}
					</button>
				</aside>
			</div>
		</main>
	);
}

export default CheckoutPage;
