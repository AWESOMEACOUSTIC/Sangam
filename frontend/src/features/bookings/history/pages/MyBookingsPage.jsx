import React, { useMemo, useState } from "react";
import { CalendarDays, Clock3, Eye, EyeOff, MapPin, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingConfirmationMock from "../../mocks/bookingMocks";
import useBookingHistory from "../hooks/useBookingHistory";
import { buildBookingConfirmationPath } from "../../utils/bookingPath";

const BOOKING_STATUS = Object.freeze({
	CONFIRMED: "confirmed",
	CANCELLED: "cancelled",
	EXPIRED: "expired",
});

const BOOKING_STATUS_STYLE_MAP = Object.freeze({
	[BOOKING_STATUS.CONFIRMED]: {
		label: "Confirmed",
		className:
			"rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200",
	},
	[BOOKING_STATUS.CANCELLED]: {
		label: "Cancelled",
		className:
			"rounded-full border border-rose-400/35 bg-rose-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-200",
	},
	[BOOKING_STATUS.EXPIRED]: {
		label: "Expired",
		className:
			"rounded-full border border-amber-400/35 bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200",
	},
});

const MOCK_BOOKING_RECORDS = [
	{
		...bookingConfirmationMock,
		status: BOOKING_STATUS.EXPIRED,
	},
	{
		...bookingConfirmationMock,
		movieTitle: "Interstellar",
		posterSrc:
			"https://i.pinimg.com/736x/53/c4/5a/53c45af9024f6f3404389d7dd0c5d2ea.jpg",
		theaterName: "INOX Megaplex",
		theaterAddress: "Phoenix Marketcity, Whitefield, Bengaluru 560048",
		showDate: "Sun, 30 Mar 2030",
		showTime: "9:30 PM",
		auditorium: "Audi 07",
		seats: ["D9", "D10"],
		bookingId: "CNF-94LM2Q",
		qrValue: "CNF-94LM2Q|Interstellar|2026-03-30|9:30 PM|D9,D10",
		status: BOOKING_STATUS.CONFIRMED,
		createdAt: "2026-03-24T14:20:00.000Z",
	},
	{
		...bookingConfirmationMock,
		movieTitle: "Dune: Part Two",
		posterSrc:
			"https://i.pinimg.com/736x/e2/7e/60/e27e60be69ecf4c99f17f57bcdbcf8a8.jpg",
		theaterName: "PVR Superplex",
		theaterAddress: "Forum South Bengaluru, Kanakapura Road, Bengaluru 560062",
		showDate: "Sat, 22 Mar 2026",
		showTime: "6:15 PM",
		auditorium: "Audi 02",
		seats: ["F5", "F6", "F7"],
		bookingId: "CNF-71PD3R",
		qrValue: "CNF-71PD3R|Dune: Part Two|2026-03-22|6:15 PM|F5,F6,F7",
		status: BOOKING_STATUS.CANCELLED,
		createdAt: "2026-03-20T11:05:00.000Z",
	},
];

function normalizeBookingStatus(status) {
	const normalizedValue = String(status || "")
		.trim()
		.toLowerCase();

	if (
		normalizedValue === BOOKING_STATUS.CONFIRMED ||
		normalizedValue === BOOKING_STATUS.CANCELLED ||
		normalizedValue === BOOKING_STATUS.EXPIRED
	) {
		return normalizedValue;
	}

	return null;
}

function hasValidBookingRecord(payload) {
	return Boolean(
		payload &&
			typeof payload.movieTitle === "string" &&
			typeof payload.theaterName === "string" &&
			typeof payload.theaterAddress === "string" &&
			typeof payload.showDate === "string" &&
			typeof payload.showTime === "string" &&
			typeof payload.auditorium === "string" &&
			Array.isArray(payload.seats) &&
			payload.seats.length > 0 &&
			typeof payload.bookingId === "string" &&
			typeof payload.qrValue === "string"
	);
}

function resolveTicketTimestamp(ticket) {
	if (!ticket?.createdAt) {
		return 0;
	}

	const parsedTime = new Date(ticket.createdAt).getTime();
	return Number.isNaN(parsedTime) ? 0 : parsedTime;
}

function resolveShowDateTimeTimestamp(ticket) {
	const showDate = String(ticket?.showDate || "").trim();
	const showTime = String(ticket?.showTime || "").trim();

	const candidateDateTimes = [
		`${showDate} ${showTime}`.trim(),
		showDate,
	].filter(Boolean);

	for (const candidate of candidateDateTimes) {
		const parsedTime = new Date(candidate).getTime();
		if (!Number.isNaN(parsedTime)) {
			return parsedTime;
		}
	}

	return null;
}

function resolveBookingStatus(booking, showTimestamp, nowTimestamp) {
	const explicitStatus = normalizeBookingStatus(booking?.status);

	if (explicitStatus) {
		return explicitStatus;
	}

	if (showTimestamp != null && showTimestamp < nowTimestamp) {
		return BOOKING_STATUS.EXPIRED;
	}

	return BOOKING_STATUS.CONFIRMED;
}

function formatBookedAt(value) {
	if (!value) {
		return "Not available";
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return String(value);
	}

	return parsedDate.toLocaleString("en-US", {
		weekday: "short",
		month: "short",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function BookingListCard({
	booking,
	isPreviewOpen,
	onOpenTicket,
	onTogglePreview,
}) {
	const seatAssignments = Array.isArray(booking.seats)
		? booking.seats.join(", ")
		: "Seats TBA";
	const statusStyle =
		BOOKING_STATUS_STYLE_MAP[booking.bookingStatus] ||
		BOOKING_STATUS_STYLE_MAP[BOOKING_STATUS.CONFIRMED];

	return (
		<article className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#16162c] to-[#0f0f20] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
			<div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[112px_1fr_auto] md:items-center">
				<div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
					{booking.posterSrc ? (
						<img
							src={booking.posterSrc}
							alt={`${booking.movieTitle} poster`}
							className="aspect-3/4 w-full object-cover"
						/>
					) : (
						<div className="flex aspect-3/4 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
							No poster
						</div>
					)}
				</div>

				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-lg font-black uppercase tracking-[0.06em] text-white sm:text-xl">
							{booking.movieTitle}
						</p>
						<span className={statusStyle.className}>
							{statusStyle.label}
						</span>
					</div>

					<p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
						{booking.bookingId}
					</p>

					<div className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
						<p className="inline-flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-cyan-300" />
							{booking.showDate}
						</p>
						<p className="inline-flex items-center gap-2">
							<Clock3 className="h-4 w-4 text-cyan-300" />
							{booking.showTime}
						</p>
						<p className="inline-flex items-start gap-2 sm:col-span-2">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
							<span className="line-clamp-2">{booking.theaterName}</span>
						</p>
						<p className="inline-flex items-center gap-2 sm:col-span-2">
							<Ticket className="h-4 w-4 text-cyan-300" />
							{seatAssignments} • {booking.auditorium}
						</p>
					</div>
				</div>

				<div className="grid gap-2 md:justify-self-end">
					<button
						type="button"
						onClick={onTogglePreview}
						aria-expanded={isPreviewOpen}
						className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-cyan-100 transition hover:bg-cyan-500/20 md:w-auto"
					>
						{isPreviewOpen ? (
							<EyeOff className="h-3.5 w-3.5" />
						) : (
							<Eye className="h-3.5 w-3.5" />
						)}
						{isPreviewOpen ? "Hide Preview" : "Preview Details"}
					</button>

					<button
						type="button"
						onClick={onOpenTicket}
						className="w-full rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_0_24px_rgba(248,69,101,0.38)] transition hover:brightness-110 md:w-auto"
					>
						Open Ticket
					</button>
				</div>
			</div>

			{isPreviewOpen ? (
				<div className="border-t border-white/10 bg-black/25 px-4 py-4 sm:px-5">
					<div className="grid gap-3 text-sm text-zinc-200 sm:grid-cols-2">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
								Booking Reference
							</p>
							<p className="mt-1 font-semibold text-white">{booking.bookingId}</p>
						</div>

						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
								Booked On
							</p>
							<p className="mt-1 font-semibold text-white">
								{formatBookedAt(booking.createdAt)}
							</p>
						</div>

						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
								Theater Address
							</p>
							<p className="mt-1 text-zinc-100">{booking.theaterAddress}</p>
						</div>

						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
								Status
							</p>
							<p className="mt-1 text-zinc-100">{statusStyle.label}</p>
						</div>

						<div className="sm:col-span-2">
							<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
								Check-In QR Value
							</p>
							<p className="mt-1 line-clamp-2 break-all text-zinc-100/90">
								{booking.qrValue}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</article>
	);
}

function BookingSection({
	title,
	helpText,
	bookings,
	emptyMessage,
	onOpenTicket,
	previewBookingId,
	onTogglePreview,
}) {
	return (
		<section className="rounded-2xl border border-white/10 bg-white/2 p-4 sm:p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-xl font-black uppercase tracking-[0.08em] text-white sm:text-2xl">
						{title}
					</h2>
					<p className="mt-1 text-sm text-zinc-300/85">{helpText}</p>
				</div>

				<span className="inline-flex min-w-8 items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200">
					{bookings.length}
				</span>
			</div>

			{bookings.length ? (
				<div className="mt-4 space-y-4">
					{bookings.map((booking) => (
						<BookingListCard
							key={`${title}-${booking.bookingId}`}
							booking={booking}
							isPreviewOpen={previewBookingId === booking.bookingId}
							onOpenTicket={() => onOpenTicket(booking)}
							onTogglePreview={() => onTogglePreview(booking.bookingId)}
						/>
					))}
				</div>
			) : (
				<p className="mt-4 rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-zinc-300/80">
					{emptyMessage}
				</p>
			)}
		</section>
	);
}

function MyBookingsPage() {
	const navigate = useNavigate();
	const { bookingHistory } = useBookingHistory();
	const [previewBookingId, setPreviewBookingId] = useState(null);

	const validHistoryRecords = useMemo(
		() => bookingHistory.filter(hasValidBookingRecord),
		[bookingHistory]
	);

	const bookings = useMemo(() => {
		if (!validHistoryRecords.length) {
			return [...MOCK_BOOKING_RECORDS].sort(
				(left, right) =>
					resolveTicketTimestamp(right) - resolveTicketTimestamp(left)
			);
		}

		return [...validHistoryRecords].sort(
			(left, right) => resolveTicketTimestamp(right) - resolveTicketTimestamp(left)
		);
	}, [validHistoryRecords]);

	const { upcomingBookings, pastBookings } = useMemo(() => {
		const nowTimestamp = Date.now();
		const upcoming = [];
		const past = [];

		for (const booking of bookings) {
			const showTimestamp = resolveShowDateTimeTimestamp(booking);
			const bookingStatus = resolveBookingStatus(
				booking,
				showTimestamp,
				nowTimestamp
			);
			const bookingWithStatus = {
				...booking,
				bookingStatus,
			};

			if (showTimestamp == null || showTimestamp >= nowTimestamp) {
				upcoming.push(bookingWithStatus);
			} else {
				past.push(bookingWithStatus);
			}
		}

		upcoming.sort((left, right) => {
			const leftTimestamp = resolveShowDateTimeTimestamp(left);
			const rightTimestamp = resolveShowDateTimeTimestamp(right);

			if (leftTimestamp == null && rightTimestamp == null) {
				return resolveTicketTimestamp(right) - resolveTicketTimestamp(left);
			}

			if (leftTimestamp == null) {
				return 1;
			}

			if (rightTimestamp == null) {
				return -1;
			}

			return leftTimestamp - rightTimestamp;
		});

		past.sort((left, right) => {
			const leftTimestamp = resolveShowDateTimeTimestamp(left);
			const rightTimestamp = resolveShowDateTimeTimestamp(right);

			if (leftTimestamp == null && rightTimestamp == null) {
				return resolveTicketTimestamp(right) - resolveTicketTimestamp(left);
			}

			if (leftTimestamp == null) {
				return 1;
			}

			if (rightTimestamp == null) {
				return -1;
			}

			return rightTimestamp - leftTimestamp;
		});

		return {
			upcomingBookings: upcoming,
			pastBookings: past,
		};
	}, [bookings]);

	const isUsingMockRecords = validHistoryRecords.length === 0;

	const handleOpenTicket = (booking) => {
		navigate(buildBookingConfirmationPath(), {
			state: { confirmation: booking },
		});
	};

	const handleTogglePreview = (bookingId) => {
		setPreviewBookingId((currentBookingId) =>
			currentBookingId === bookingId ? null : bookingId
		);
	};

	return (
		<main className="min-h-screen bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
			<section className="mx-auto max-w-6xl">
				<header className="rounded-2xl border border-white/10 bg-white/3 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300/80">
						My Bookings
					</p>
					<h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
						{bookings.length > 1 ? "Your Booking Records" : "Your Booking Record"}
					</h1>
					<p className="mt-1 text-sm text-zinc-300/80">
						Your records are separated into upcoming and past bookings.
					</p>

					{isUsingMockRecords ? (
						<p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-amber-200">
							Showing mock records until you complete a booking.
						</p>
					) : null}
				</header>

				<div className="mt-6 space-y-6">
					<BookingSection
						title="Upcoming Bookings"
						helpText="Shows that are scheduled for now or later."
						bookings={upcomingBookings}
						emptyMessage="No upcoming bookings yet."
						onOpenTicket={handleOpenTicket}
						previewBookingId={previewBookingId}
						onTogglePreview={handleTogglePreview}
					/>

					<BookingSection
						title="Past Bookings"
						helpText="Completed shows from your booking history."
						bookings={pastBookings}
						emptyMessage="No past bookings to show yet."
						onOpenTicket={handleOpenTicket}
						previewBookingId={previewBookingId}
						onTogglePreview={handleTogglePreview}
					/>
				</div>
			</section>
		</main>
	);
}

export default MyBookingsPage;
