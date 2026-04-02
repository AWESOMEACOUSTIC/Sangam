import React from "react";
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
		path: bookingPaths.confirmation,
		element: <BookingConfirmationPage />,
	},
	{
		path: bookingPaths.myBookings,
		element: <MyBookingsPage />,
	},
];
