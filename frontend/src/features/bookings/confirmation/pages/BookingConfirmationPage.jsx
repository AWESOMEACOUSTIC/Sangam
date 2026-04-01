import React from "react";
import {
	Armchair,
	CalendarDays,
	Clock3,
	MapPin,
	Ticket,
} from "lucide-react";
import PosterPane from "../../../movietickets/components/PosterPane";
import QrPanel from "../../../movietickets/components/QrPanel";
import TicketField from "../../../movietickets/components/TicketField";
import TicketShell from "../../../movietickets/components/TicketShell";
import ticketData from "../../../movietickets/service/ticketData";

export default function BookingConfirmationPage() {
	return (
		<main className="min-h-screen px-4 py-18 sm:px-6 lg:px-12">
			<TicketShell>
				<article
					aria-label="Confirmed movie ticket"
					className="grid h-full md:grid-cols-[272px_1fr]"
				>
					<PosterPane />

					<section className="border-t border-black/15 md:border-l md:border-t-0 md:border-dashed">
						<div className="flex h-full flex-col p-4 sm:p-5">
							<header className="flex flex-col gap-3 border-b border-black/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="min-w-0">
									<h3 className="mt-1 text-2xl font-black uppercase tracking-[0.06em] text-[#111111] sm:text-[28px]">
										{ticketData.theaterName}
									</h3>

									<p className="mt-1.5 max-w-2xl text-sm leading-5 text-black/65">
										{ticketData.theaterAddress}
									</p>
								</div>
							</header>

							<div className="mt-4 grid gap-4 xl:grid-cols-[1fr_176px]">
								<div className="grid auto-rows-min gap-3 sm:grid-cols-2">
									<TicketField
										icon={MapPin}
										label="Theater Address"
										value={ticketData.theaterAddress}
										className="sm:col-span-2"
									/>

									<TicketField
										icon={CalendarDays}
										label="Screening Date"
										value={ticketData.showDate}
									/>

									<TicketField
										icon={Clock3}
										label="Screening Time"
										value={ticketData.showTime}
									/>

									<TicketField
										icon={Armchair}
										label="Seat Assignments"
										value={ticketData.seats.join(", ")}
									/>

									<TicketField
										icon={Ticket}
										label="Auditorium"
										value={ticketData.auditorium}
									/>
								</div>

								<QrPanel />
							</div>

							{/* <footer className="mt-6 border-t border-black/10 pt-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
										Booking ID
									</p>

									<p className="text-base font-black tracking-[0.12em] text-[#111111]">
										{ticketData.bookingId}
									</p>
								</div>
							</footer> */}
						</div>
					</section>
				</article>
			</TicketShell>
		</main>
	);
}
