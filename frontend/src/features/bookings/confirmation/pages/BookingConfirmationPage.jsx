import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Armchair,
	CalendarDays,
	Clock3,
	MapPin,
	Ticket,
} from "lucide-react";
import PosterPane from "../components/PosterPane";
import QrPanel from "../components/QrPanel";
import TicketField from "../components/TicketField";
import TicketShell from "../components/TicketShell";
import { buildMyBookingsPath } from "../../utils/bookingPath";

function hasValidConfirmationPayload(payload) {
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

export default function BookingConfirmationPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const booking = location.state?.confirmation;

	if (!hasValidConfirmationPayload(booking)) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-black px-4 pb-10 pt-24 sm:px-6 lg:px-10">
				<section className="w-full max-w-2xl rounded-3xl border border-amber-500/25 bg-amber-950/20 p-6 sm:p-8">
					<p className="text-xs uppercase tracking-[0.18em] text-amber-200">
						Confirmation unavailable
					</p>

					<h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
						Ticket data is missing
					</h1>

					<p className="mt-3 text-sm text-amber-100/90">
						This confirmation page needs checkout success data. Complete payment
						from checkout to view your ticket.
					</p>

					<div className="mt-8 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => navigate(buildMyBookingsPath())}
							className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
						>
							Go To My Bookings
						</button>

						<button
							type="button"
							onClick={() => navigate("/")}
							className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
						>
							Go Home
						</button>
					</div>
				</section>
			</main>
		);
	}

	const seatAssignments = Array.isArray(booking.seats)
		? booking.seats.join(", ")
		: "Seats TBA";

	return (
		<main className="min-h-screen px-4 py-18 sm:px-6 lg:px-12">
			<TicketShell>
				<article
					aria-label="Confirmed movie ticket"
					className="grid h-full md:grid-cols-[272px_1fr]"
				>
					<PosterPane booking={booking} />

					<section className="border-t border-black/15 md:border-l md:border-t-0 md:border-dashed">
						<div className="flex h-full flex-col p-4 sm:p-5">
							<header className="flex flex-col gap-3 border-b border-black/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="min-w-0">
									<h3 className="mt-1 text-2xl font-black uppercase tracking-[0.06em] text-[#111111] sm:text-[28px]">
										{booking.theaterName}
									</h3>

									<p className="mt-1.5 max-w-2xl text-sm leading-5 text-black/65">
										{booking.theaterAddress}
									</p>
								</div>
							</header>

							<div className="mt-4 grid gap-4 xl:grid-cols-[1fr_176px]">
								<div className="grid auto-rows-min gap-3 sm:grid-cols-2">
									<TicketField
										icon={MapPin}
										label="Theater Address"
										value={booking.theaterAddress}
										className="sm:col-span-2"
									/>

									<TicketField
										icon={CalendarDays}
										label="Screening Date"
										value={booking.showDate}
									/>

									<TicketField
										icon={Clock3}
										label="Screening Time"
										value={booking.showTime}
									/>

									<TicketField
										icon={Armchair}
										label="Seat Assignments"
										value={seatAssignments}
									/>

									<TicketField
										icon={Ticket}
										label="Auditorium"
										value={booking.auditorium}
									/>
								</div>

								<QrPanel booking={booking} />
							</div>

							<footer className="mt-6 border-t border-black/10 pt-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
										Booking ID
									</p>

									<p className="text-base font-black tracking-[0.12em] text-[#111111]">
										{booking.bookingId}
									</p>
								</div>
							</footer>
						</div>
					</section>
				</article>
			</TicketShell>
		</main>
	);
}
