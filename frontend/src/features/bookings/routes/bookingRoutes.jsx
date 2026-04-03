import React from "react";
import CheckoutPage from "../checkout/pages/CheckoutPage";
import BookingConfirmationPage from "../confirmation/pages/BookingConfirmationPage";
import MyBookingsPage from "../history/pages/MyBookingsPage";
import SeatLayoutPage from "../seat-selection/pages/SeatLayoutPage";
import ProtectedBookingRoute from "./ProtectedBookingRoute";
import { bookingPaths } from "../utils/bookingPath";

export const bookingRouteDefinitions = [
	{
		path: bookingPaths.seatLayout,
		element: (
			<ProtectedBookingRoute>
				<SeatLayoutPage />
			</ProtectedBookingRoute>
		),
	},
	{
		path: bookingPaths.checkout,
		element: (
			<ProtectedBookingRoute>
				<CheckoutPage />
			</ProtectedBookingRoute>
		),
	},
	{
		path: bookingPaths.confirmation,
		element: <BookingConfirmationPage />,
	},
	{
		path: bookingPaths.myBookings,
		element: (
			<ProtectedBookingRoute>
				<MyBookingsPage />
			</ProtectedBookingRoute>
		),
	},
];
