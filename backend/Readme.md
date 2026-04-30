## Backend File Structure (Proposed)

```
backend/
	package.json
	Readme.md
	.env.example
	.gitignore
	src/
		server.js
		app.js
		config/
			env.js
			logger.js
			database.js
		routes/
			index.js
			health.routes.js
			showtime.routes.js
			seat.routes.js
			booking.routes.js
			payment.routes.js
			user.routes.js
		controllers/
			health.controller.js
			showtime.controller.js
			seat.controller.js
			booking.controller.js
			payment.controller.js
			user.controller.js
		services/
			showtime.service.js
			seat.service.js
			booking.service.js
			pricing.service.js
			hold.service.js
			payment.service.js
			user.service.js
		repositories/
			showtime.repository.js
			seat.repository.js
			booking.repository.js
			payment.repository.js
			user.repository.js
		models/
			...
		middleware/
			auth.js
			error-handler.js
			rate-limit.js
			request-id.js
			validate.js
		validators/
			...
		utils/
			...
		constants/
			...
		telemetry/
			metrics.js
		docs/
			openapi.yaml
		tests/
			unit/
			integration/
		scripts/
	migrations/
```

### Why each file/folder exists

| Path | Role |
| --- | --- |
| package.json | Dependency manifest and runnable scripts for build, test, and start. |
| Readme.md | Backend docs, onboarding, and operational guidance. |
| .env.example | Template for required environment variables and defaults. |
| .gitignore | Keeps secrets, logs, and build artifacts out of git. |
| src/server.js | Process entry point that boots the HTTP server. |
| src/app.js | Express app wiring, middleware stack, and base configuration. |
| src/config/env.js | Centralized env loading and validation to fail fast. |
| src/config/logger.js | Logger setup with formats, levels, and transports. |
| src/config/database.js | Database connection and lifecycle management. |
| src/routes/index.js | Route registry that mounts all feature routes. |
| src/routes/*.routes.js | HTTP endpoints grouped by domain for clarity and ownership. |
| src/controllers/*.controller.js | Request handling and response shaping at the edge. |
| src/services/*.service.js | Business logic and orchestration across repositories. |
| src/repositories/*.repository.js | Data access layer with queries and persistence rules. |
| src/models/ | Database models or schemas and their shared helpers. |
| src/middleware/auth.js | Authentication and authorization guardrails. |
| src/middleware/error-handler.js | Centralized error mapping to a consistent API format. |
| src/middleware/rate-limit.js | Throttling for abuse protection and stability. |
| src/middleware/request-id.js | Correlation IDs for tracing across logs and services. |
| src/middleware/validate.js | Request validation entry point for schemas. |
| src/validators/ | Schema definitions for params, query, and body validation. |
| src/utils/ | Shared helpers that are pure and infrastructure-agnostic. |
| src/constants/ | Shared enums and static values used across domains. |
| src/telemetry/metrics.js | Metrics setup for health and performance monitoring. |
| src/docs/openapi.yaml | API contract for frontend and external integrations. |
| src/tests/unit/ | Unit tests for services, utils, and pure logic. |
| src/tests/integration/ | Integration tests for routes and data access. |
| src/scripts/ | One-off maintenance scripts and tooling. |
| migrations/ | Database migrations managed by your chosen tool. |

---

## Backend Requirements

### Phase 1: Base (MVP + Contracts)

#### Phase 1A: Foundations and Contracts

- [ ] Define API contract in an OpenAPI spec for all v1 endpoints.
- [ ] Standardize error response format (code, message, requestId, details).
- [ ] Health and readiness endpoints for basic monitoring.
- [ ] Env validation and config loading (fail fast on missing secrets).
- [ ] Schema validation for params, query, and body on all endpoints.
- [ ] Auth integration (Clerk JWT verification) for booking-protected routes.

#### Phase 1B: Data Model and Inventory

- [ ] DB schema + migrations for movies, shows, theaters, auditoriums, seats, holds, bookings, payments.
- [ ] Showtime listing endpoint (movieId, date range, theater info, showId).
- [ ] Seat status enum aligns with UI (available, reserved, sold, blocked).
- [ ] Seat map endpoint returning seat status, class, and price per seat.
- [ ] Seat hold creation with expiry and max-seat enforcement (limit = 6).

#### Phase 1C: Pricing and Checkout

- [ ] Backend pricing rules (seat class pricing + fees + tax) are the source of truth.
- [ ] Checkout session endpoint returns pricing snapshot, payment methods, hold expiry, and normalized seats.
- [ ] Payment confirmation endpoint returns ticket payload (bookingId, qrValue, theater/address, show date/time, seats).
- [ ] Generate deterministic booking reference IDs.

#### Phase 1D: Booking History

- [ ] My bookings list endpoint with pagination and newest-first sort.
- [ ] Booking detail endpoint.
- [ ] Booking list returns bookingStatus and createdAt for timeline UI.

### Phase 2: Production Ready (Reliability + Security)

- [ ] Concurrency-safe seat locking (transaction + unique constraint).
- [ ] Auto-expire holds and release seats after timeout.
- [ ] Revalidate seat availability and pricing before payment confirmation.
- [ ] Idempotency keys for hold creation and booking confirmation.
- [ ] Rate limiting on booking-sensitive endpoints.
- [ ] Strict authorization on user-owned booking resources.
- [ ] Consistent time zone handling (store UTC, return locale-safe strings).
- [ ] Structured logs for hold, payment, and confirmation flows.
- [ ] Metrics for booking success, payment failure, and hold expiry.

### Phase 3: Advanced (Scale + Resilience)

- [ ] Short-lived caching for showtime listings and seat maps.
- [ ] Background job to sweep expired holds and repair stuck sessions.
- [ ] Payment webhook handling with replay-safe processing.
- [ ] Conflict-safe seat allocation responses with retry guidance.
- [ ] Booking status timeline (pending_payment, confirmed, cancelled, expired, refunded).
- [ ] Indexing strategy for hot queries (shows, seats, bookings).
- [ ] Read model for fast booking history retrieval.

## Backend Done Criteria (v1)

- [ ] Phase 1 complete, Phase 2 in progress with critical items done.
- [ ] Seat locking is concurrency safe.
- [ ] Pricing is backend authoritative (frontend only displays).
- [ ] Confirmed bookings are persistent and queryable.
- [ ] Payment and booking state remain consistent under failures.
- [ ] Frontend can switch from mocks to real APIs without route or UX redesign.

---

## Final Release Checklist

- [ ] Frontend tracker complete.
- [ ] Backend tracker complete.
- [ ] End-to-end manual test pass on full journey.
- [ ] Basic monitoring and error handling in place.
- [ ] Deployment notes updated for both frontend and backend.
