# Sangam Frontend Tracking Board

This README tracks delivery of the booking journey in two phases:

- Frontend completion with mocked data and stable UX flow
- Backend integration for transactional logic and persistence

## Target Folder Structure

This is the folder structure we will follow so the booking flow scales cleanly.

Important note:

- Keep `src/features/bookings` as the primary booking domain (do not create a separate parallel booking feature).
- Move seat selection, checkout, confirmation ticket, and booking history under this single domain over time.

### Frontend Target Structure

```text
frontend/
	src/
		app/
			router/
				AppRoutes.jsx
				routePaths.js
			guards/
				ProtectedRoute.jsx
			providers/
				AppProviders.jsx

		common/
			components/
			hooks/
			utils/
			constants/
			services/
				httpClient.js

		features/
			home/
			movie/
			moviedetail/

			bookings/
				routes/
					bookingRoutes.jsx
				api/
					bookingsApi.js
				hooks/
					useBookingAuthGate.js
					useSeatSelection.js
					usePricing.js
					useHoldTimer.js
				components/
					SeatGrid.jsx
					SeatLegend.jsx
					FareSummary.jsx
					BookingTimer.jsx
				utils/
					bookingPath.js
					seatFormatter.js
				constants/
					bookingConstants.js
				types/
					booking.types.d.ts
				mocks/
					bookingMocks.js
				tests/
					bookingFlow.test.jsx

				showtimes/
					pages/
						ShowtimesPage.jsx
					components/
					hooks/

				seat-selection/
					pages/
						SeatLayoutPage.jsx
					components/
					hooks/

				checkout/
					pages/
						CheckoutPage.jsx
					components/
					hooks/

				confirmation/
					pages/
						BookingConfirmationPage.jsx
					components/

				history/
					pages/
						MyBookingsPage.jsx
					components/
					hooks/

		main.jsx
```

### Why Each Booking Folder Is Needed

- routes/: Keeps booking-related route wiring isolated from app-level routing. This makes future route refactors safer and easier to test.
- api/: Centralizes all booking network calls in one place. UI components stay clean and do not directly handle fetch details.
- hooks/: Holds reusable booking behavior like auth gating, seat state, and pricing logic. This avoids duplicate logic across pages.
- components/: Contains reusable UI blocks for booking screens. Shared pieces keep page files smaller and more maintainable.
- utils/: Stores pure helper functions such as path building and seat formatting. Keeping helpers here improves readability and testability.
- constants/: Defines stable keys, limits, and fixed values used across booking flow. It prevents magic strings and inconsistent values.
- types/: Documents booking data contracts for stronger code clarity and safer refactoring. It also helps IDE hints and onboarding.
- mocks/: Provides frontend-first mock data while backend APIs are in progress. This lets UI flow ship earlier without blocking.
- tests/: Groups booking-specific tests close to the feature domain. It improves ownership and long-term reliability of the flow.
- showtimes/: Encapsulates show discovery and selection before seat booking starts. It separates pre-booking context from transactional steps.
- seat-selection/: Encapsulates seat map rendering and seat pick rules. This keeps the most complex interaction isolated and focused.
- checkout/: Contains fare validation and final confirmation steps before payment. It gives a clear handoff from selection to transaction.
- confirmation/: Owns post-booking ticket and success experience. This separation makes receipt/ticket enhancements easier later.
- history/: Owns My Bookings list and detail experiences. It keeps account history independent from live booking flow.

### Why Each Starter File Is Needed

- routes/bookingRoutes.jsx: Declares all booking feature routes in one source of truth. Route paths and lazy boundaries stay organized.
- api/bookingsApi.js: Exposes booking API functions with consistent request/response handling. Backend migration becomes a one-file integration point.
- hooks/useBookingAuthGate.js: Guards booking entry points for logged-in users only. It also preserves and restores intended redirect targets.
- hooks/useSeatSelection.js: Manages selected seats, constraints, and seat toggling logic. This prevents seat state bugs across components.
- hooks/usePricing.js: Computes subtotal, fees, taxes, and total from selected seats. Keeping pricing in one hook ensures consistent calculations.
- hooks/useHoldTimer.js: Tracks seat-hold countdown and expiry behavior. It prepares frontend for real backend hold and release logic.
- components/SeatGrid.jsx: Renders seat matrix and handles seat interaction callbacks. It isolates complex visual and click behavior.
- components/SeatLegend.jsx: Shows meaning of seat statuses like available or sold. This improves UX clarity and reduces booking mistakes.
- components/FareSummary.jsx: Presents fare breakdown in a reusable summary panel. The same component can be reused in seat and checkout pages.
- components/BookingTimer.jsx: Displays hold timer and urgency messaging to users. It supports better conversion and timeout awareness.
- utils/bookingPath.js: Builds consistent booking URLs from route params and IDs. It avoids duplicated path string assembly across pages.
- utils/seatFormatter.js: Normalizes seat labels and seat display helpers. It keeps seat display rules consistent everywhere.
- constants/bookingConstants.js: Stores booking limits, defaults, and reusable constants. It reduces hard-coded values spread across files.
- types/booking.types.d.ts: Defines the shapes of booking, seat, show, and pricing entities. This acts as living documentation for the domain.
- mocks/bookingMocks.js: Provides realistic mock payloads for booking screens and tests. Teams can validate UX before backend readiness.
- tests/bookingFlow.test.jsx: Covers critical flow behavior with integration-style checks. It protects core user journey from regressions.
- showtimes/pages/ShowtimesPage.jsx: Entry screen for selecting theater/date/show. It prepares clean context before seat selection.
- seat-selection/pages/SeatLayoutPage.jsx: Main transactional step where users pick seats. It orchestrates seat grid, summary, and hold timer.
- checkout/pages/CheckoutPage.jsx: Final review step before payment confirmation. It validates selected data and totals before booking creation.
- confirmation/pages/BookingConfirmationPage.jsx: Displays ticket details after successful booking. It is the canonical post-payment success state.
- history/pages/MyBookingsPage.jsx: Shows user booking history and booking statuses. It supports account-level visibility and repeat usage.

### Backend Target Structure (Next Phase)

```text
backend/
	src/
		app.js
		server.js
		config/
		middleware/
			auth.middleware.js
			error.middleware.js
		modules/
			bookings/
				bookings.routes.js
				bookings.controller.js
				bookings.service.js
				bookings.repository.js
				bookings.validator.js
			shows/
			seats/
			payments/
		utils/
		tests/
```

### Migration Mapping From Current Frontend Folders

- `src/features/seatdetails/pages/SeatLayout.jsx` -> `src/features/bookings/seat-selection/pages/SeatLayoutPage.jsx`
- `src/features/movietickets/page/MovieTickets.jsx` -> `src/features/bookings/confirmation/pages/BookingConfirmationPage.jsx`
- `src/features/movietickets/service/ticketData.js` -> `src/features/bookings/mocks/bookingMocks.js` (frontend phase) and later `src/features/bookings/api/bookingsApi.js` (backend phase)
- `src/features/bookings/pages/Bookings.jsx` -> `src/features/bookings/history/pages/MyBookingsPage.jsx`

### Structure Adoption Checklist

- [x] Create subdomains under `src/features/bookings` (showtimes, seat-selection, checkout, confirmation, history).
- [x] Move existing booking-related pages from temporary folders into `src/features/bookings`.
- [ ] Keep common, reusable logic in hooks and utils inside the booking domain.
- [x] Keep route definitions centralized and reference booking route constants.
- [x] Remove old temporary folders after route migration is complete.

## Tracker 1: Frontend Completion Checklist

### A. Routing and Flow Foundation

- [x] Define and lock canonical route structure for booking flow.
- [x] Add route for seat selection page.
- [x] Add route for checkout page.
- [x] Add route for booking confirmation page.
- [x] Add route for my bookings page.
- [ ] Remove or repurpose any legacy temporary ticket route.
- [ ] Ensure broken or missing routes do not exist in navbar and CTA links.

### B. Auth Gate and Redirect Behavior

- [x] Add reusable booking auth gate hook.
- [x] On Book tickets click, check user auth state before navigation.
- [x] If logged out, open sign in and store intended return URL.
- [x] After successful sign in, redirect user to intended seat page.
- [x] Protect seat and checkout routes with route-level guard.
- [x] Handle direct URL access while logged out and return correctly after login.

### C. Showtime and Seat Selection UX

- [x] Add showtime selection entry point from movie detail page.
- [x] Navigate to seat page using stable show identifier.
- [x] Build interactive seat grid with seat state badges.
- [x] Implement seat states: available, selected, reserved, sold, blocked.
- [x] Add seat selection constraints such as max seats per booking.
- [x] Add loading, empty, and error states for seat map UI.

### D. Pricing and Order Summary

- [ ] Implement frontend pricing calculator with seat class awareness.
- [ ] Add fees and tax line items in summary.
- [x] Show live recalculation when seats are selected or removed.
- [ ] Validate summary values before proceeding to checkout.

### E. Checkout and Ticket UI (Frontend First)

- [ ] Build checkout page UI with mock booking session response.
- [ ] Add mock payment success and failure flows for UI validation.
- [ ] Build confirmation ticket page with dynamic props.
- [ ] Replace static ticket placeholder data usage with state-driven data.
- [ ] Add copyable booking reference and share-ready ticket details.

### F. My Bookings Frontend

- [ ] Build my bookings list page with mock records.
- [ ] Show upcoming and past bookings sections.
- [ ] Add status labels such as confirmed, cancelled, expired.
- [ ] Add booking detail preview interaction.

### G. Frontend Quality and Testing

- [ ] Add unit tests for auth gate and redirect logic.
- [ ] Add unit tests for pricing calculations.
- [ ] Add integration test for end-to-end frontend happy path.
- [ ] Add integration test for logged-out deep-link access path.
- [ ] Run lint and resolve booking-related warnings and errors.

## Frontend Done Criteria

- [ ] User can complete movie detail to seat to checkout to confirmation flow using mock services.
- [ ] Login redirection works in all protected booking routes.
- [ ] No broken navigation paths remain in booking journey.
- [ ] Frontend tests pass for critical booking flows.

---

## Tracker 2: Backend Integration Checklist

### H. API Contract Finalization

- [ ] Define request and response contracts for showtime listing.
- [ ] Define request and response contracts for seat map retrieval.
- [ ] Define request and response contracts for hold seats API.
- [ ] Define request and response contracts for checkout and booking confirmation API.
- [ ] Define request and response contracts for my bookings and booking detail APIs.

### I. Auth and Authorization

- [ ] Verify user identity on protected booking endpoints.
- [ ] Enforce ownership checks for my bookings endpoints.
- [ ] Reject unauthorized access with consistent error format.

### J. Seat Hold and Concurrency

- [ ] Implement seat hold creation with expiry.
- [ ] Implement hold release on timeout.
- [ ] Revalidate seat availability before booking confirmation.
- [ ] Prevent double booking under concurrent requests.
- [ ] Return conflict-safe responses for already booked seats.

### K. Pricing and Booking Core Logic

- [ ] Move price calculation source of truth to backend.
- [ ] Store and return fare breakdown with taxes and fees.
- [ ] Persist booking session and confirmed booking entities.
- [ ] Generate deterministic booking reference IDs.

### L. Payment and Confirmation

- [ ] Integrate payment intent creation.
- [ ] Verify payment status before confirming booking.
- [ ] Handle failed payment and rollback hold state.
- [ ] Return canonical confirmation payload for frontend ticket UI.

### M. My Bookings and History APIs

- [ ] Implement user booking list endpoint with pagination.
- [ ] Implement booking detail endpoint.
- [ ] Return normalized booking status timeline.

### N. Reliability and Production Hardening

- [ ] Add schema validation for all booking inputs.
- [ ] Add idempotency protection for booking confirmation API.
- [ ] Add rate limiting for booking-sensitive endpoints.
- [ ] Add structured logs for hold, payment, and confirmation events.
- [ ] Add monitoring metrics for booking success, failure, and drop-off.

## Backend Done Criteria

- [ ] Seat locking is concurrency safe.
- [ ] Pricing is backend authoritative.
- [ ] Confirmed bookings are persistent and queryable.
- [ ] Payment and booking state remain consistent under failures.
- [ ] Frontend can switch from mock services to real APIs without route or UX redesign.

---

## Final Release Checklist

- [ ] Frontend tracker complete.
- [ ] Backend tracker complete.
- [ ] End-to-end manual test pass on full journey.
- [ ] Basic monitoring and error handling in place.
- [ ] Deployment notes updated for both frontend and backend.
