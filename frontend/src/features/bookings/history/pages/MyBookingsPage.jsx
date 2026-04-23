import React, { useMemo } from "react";
import { CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingConfirmationMock from "../../mocks/bookingMocks";
import useBookingHistory from "../hooks/useBookingHistory";
import { buildBookingConfirmationPath } from "../../utils/bookingPath";

const MOCK_BOOKING_RECORDS = [
	bookingConfirmationMock,
	{
		...bookingConfirmationMock,
		movieTitle: "Interstellar",
		posterSrc:
			"https://i.pinimg.com/736x/53/c4/5a/53c45af9024f6f3404389d7dd0c5d2ea.jpg",
		theaterName: "INOX Megaplex",
		theaterAddress: "Phoenix Marketcity, Whitefield, Bengaluru 560048",
		showDate: "Sun, 30 Mar 2026",
		showTime: "9:30 PM",
		auditorium: "Audi 07",
		seats: ["D9", "D10"],
		bookingId: "CNF-94LM2Q",
		qrValue: "CNF-94LM2Q|Interstellar|2026-03-30|9:30 PM|D9,D10",
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
		createdAt: "2026-03-20T11:05:00.000Z",
	},
];

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

function BookingListCard({ booking, onOpenTicket }) {
	const seatAssignments = Array.isArray(booking.seats)
		? booking.seats.join(", ")
		: "Seats TBA";

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
						<span className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
							Confirmed
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

				<div className="md:justify-self-end">
					<button
						type="button"
						onClick={onOpenTicket}
						className="w-full rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_0_24px_rgba(248,69,101,0.38)] transition hover:brightness-110 md:w-auto"
					>
						Open Ticket
					</button>
				</div>
			</div>
		</article>
	);
}

function MyBookingsPage() {
	const navigate = useNavigate();
	const { bookingHistory } = useBookingHistory();

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

	const isUsingMockRecords = validHistoryRecords.length === 0;

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
						Newest records appear first. Open any ticket to view full details.
					</p>

					{isUsingMockRecords ? (
						<p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-amber-200">
							Showing mock records until you complete a booking.
						</p>
					) : null}
				</header>

				<div className="mt-6 space-y-4">
					{bookings.map((booking) => (
						<BookingListCard
							key={booking.bookingId}
							booking={booking}
							onOpenTicket={() =>
								navigate(buildBookingConfirmationPath(), {
									state: { confirmation: booking },
								})
							}
						/>
					))}
				</div>
			</section>
		</main>
	);
}

export default MyBookingsPage;
