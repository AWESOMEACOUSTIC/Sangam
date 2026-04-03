import React from "react";
import CheckoutPage from "../checkout/pages/CheckoutPage";
import BookingConfirmationPage from "../confirmation/pages/BookingConfirmationPage";
import MyBookingsPage from "../history/pages/MyBookingsPage";
import SeatLayoutPage from "../seat-selection/pages/SeatLayoutPage";
import { bookingPaths } from "../utils/bookingPath";

export const bookingRouteDefinitions = [
	{
		path: bookingPaths.seatLayout,
		element: <SeatLayoutPage />,
	},
	{
		path: bookingPaths.checkout,
		element: <CheckoutPage />,
	},
	{
		path: bookingPaths.confirmation,
		element: <BookingConfirmationPage />,
	},
	{
		path: bookingPaths.myBookings,
		element: <MyBookingsPage />,
	},
];
