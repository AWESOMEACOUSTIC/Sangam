import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePricing from "../../hooks/usePricing";
import {
	getMockBookingSession,
	submitMockPayment,
} from "../../api/bookingsApi";
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

function formatSessionTime(value) {
	if (!value) {
		return "N/A";
	}

	const parsedValue = new Date(value);
	if (Number.isNaN(parsedValue.getTime())) {
		return String(value);
	}

	return parsedValue.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
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

	const baseSelectedSeats = useMemo(
		() => (Array.isArray(selectedSeatsState) ? selectedSeatsState : []),
		[selectedSeatsState]
	);
	const [mockBookingSession, setMockBookingSession] = useState(null);
	const [isLoadingSession, setIsLoadingSession] = useState(true);
	const [sessionLoadError, setSessionLoadError] = useState("");
	const [sessionReloadToken, setSessionReloadToken] = useState(0);
	const [isPaying, setIsPaying] = useState(false);
	const [paymentError, setPaymentError] = useState("");

	const selectedSeats = mockBookingSession?.seats ?? baseSelectedSeats;
	const effectivePricingSnapshot = mockBookingSession?.pricing ?? pricingSnapshot;
	const effectiveMovieTitle = mockBookingSession?.movieTitle || movieTitle;
	const effectivePosterSrc = mockBookingSession?.posterSrc || posterSrc;
	const effectiveShowDate = mockBookingSession?.showDate || date || "Date TBA";
	const effectiveRawShowDate = mockBookingSession?.rawShowDate || date;
	const effectiveShowTime = mockBookingSession?.showTime || showTime || "Time TBA";
	const effectiveTheaterName = mockBookingSession?.theaterName || theater;
	const effectiveAuditorium = mockBookingSession?.auditorium || "Audi 03";
	const effectiveShowId = mockBookingSession?.showId || showId;
	const effectivePaymentMethods = mockBookingSession?.paymentMethods || [];
	const pricing = usePricing(selectedSeats);

	useEffect(() => {
		let isCurrentRequest = true;

		const loadMockSession = async () => {
			setIsLoadingSession(true);
			setSessionLoadError("");

			const sessionResponse = await getMockBookingSession({
				bookingSessionId,
				showId,
				movieTitle,
				posterSrc,
				showDate: date,
				showTime,
				theaterName: theater,
				selectedSeats: baseSelectedSeats,
				pricing: pricingSnapshot,
			});

			if (!isCurrentRequest) {
				return;
			}

			if (!sessionResponse.ok) {
				setMockBookingSession(null);
				setSessionLoadError(
					sessionResponse.message ||
						"Checkout session could not be loaded. Please try again."
				);
				setIsLoadingSession(false);
				return;
			}

			setMockBookingSession(sessionResponse.session);
			setIsLoadingSession(false);
		};

		loadMockSession();

		return () => {
			isCurrentRequest = false;
		};
	}, [
		bookingSessionId,
		showId,
		movieTitle,
		posterSrc,
		date,
		showTime,
		theater,
		baseSelectedSeats,
		pricingSnapshot,
		sessionReloadToken,
	]);

	const seatLayoutPath = useMemo(() => {
		return buildSeatLayoutPath({
			showId: effectiveShowId,
			movieTitle: effectiveMovieTitle,
			posterSrc: effectivePosterSrc,
			date: effectiveRawShowDate,
			showTime: effectiveShowTime,
			theater: effectiveTheaterName,
		});
	}, [
		effectiveShowId,
		effectiveMovieTitle,
		effectivePosterSrc,
		effectiveRawShowDate,
		effectiveShowTime,
		effectiveTheaterName,
	]);

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

		if (sessionLoadError) {
			errors.push(sessionLoadError);
		}

		if (!bookingSessionId) {
			errors.push("Checkout session id is missing.");
		}

		if (!selectedSeats.length) {
			errors.push("No selected seats found for this checkout session.");
		}

		if (pricing.validationErrors?.length) {
			errors.push(...pricing.validationErrors);
		}

		if (hasPricingSnapshotMismatch(pricing, effectivePricingSnapshot)) {
			errors.push(
				"Fare details changed or are incomplete. Please review seats and continue again."
			);
		}

		return [...new Set(errors)];
	}, [
		bookingSessionId,
		pricing,
		effectivePricingSnapshot,
		selectedSeats.length,
		sessionLoadError,
	]);

	const isCheckoutValid = checkoutValidationErrors.length === 0;

	const handleProceedToPayment = async () => {
		if (!isCheckoutValid || isPaying) {
			return;
		}

		setIsPaying(true);
		setPaymentError("");

		const paymentResult = await submitMockPayment({
			bookingSessionId,
			movieTitle: effectiveMovieTitle,
			posterSrc: effectivePosterSrc,
			showDate: effectiveRawShowDate,
			showTime: effectiveShowTime,
			theaterName: effectiveTheaterName,
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

	if (isLoadingSession) {
		return (
			<main className="min-h-screen bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
				<section className="mx-auto max-w-2xl rounded-3xl border border-cyan-500/20 bg-cyan-950/15 p-6 sm:p-8">
					<p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
						Loading checkout session
					</p>

					<h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
						Preparing your booking details
					</h1>

					<p className="mt-3 text-sm text-cyan-100/90">
						Fetching mocked booking session response before payment.
					</p>

					<div className="mt-6 h-2 w-full rounded-full bg-cyan-950/30">
						<div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400/70" />
					</div>
				</section>
			</main>
		);
	}

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
						{sessionLoadError ? (
							<button
								type="button"
								onClick={() =>
									setSessionReloadToken((current) => current + 1)
								}
								className="rounded-full border border-cyan-300/35 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
							>
								Retry Session
							</button>
						) : null}

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

					<div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300 sm:grid-cols-2">
						<p>
							<span className="text-zinc-400">Session Source:</span> Mock API
						</p>
						<p>
							<span className="text-zinc-400">Status:</span> Pending Payment
						</p>
						<p>
							<span className="text-zinc-400">Hold Expires:</span>{" "}
							{formatSessionTime(mockBookingSession?.holdExpiresAt)}
						</p>
						<p>
							<span className="text-zinc-400">Auditorium:</span>{" "}
							{effectiveAuditorium}
						</p>
					</div>

					<div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
						<p>
							<span className="text-zinc-400">Movie:</span> {effectiveMovieTitle}
						</p>
						<p className="mt-2">
							<span className="text-zinc-400">Show:</span> {effectiveShowDate} at{" "}
							{effectiveShowTime}
						</p>
						<p className="mt-2">
							<span className="text-zinc-400">Theater:</span>{" "}
							{effectiveTheaterName || "TBA"}
						</p>
					</div>

					<div className="mt-6 space-y-3">
						{selectedSeats.map((seat) => (
							<div
								key={`checkout-seat-${seat.rowNumber}-${seat.seatNumber}`}
								className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200"
							>
								<div>
									<p>{seat.seatLabel || `Row ${seat.rowNumber} / Seat ${seat.seatNumber}`}</p>
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

					{effectivePaymentMethods.length ? (
						<div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
							<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
								Accepted Methods
							</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{effectivePaymentMethods.map((method) => (
									<span
										key={`payment-method-${method}`}
										className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-300"
									>
										{method}
									</span>
								))}
							</div>
						</div>
					) : null}

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
