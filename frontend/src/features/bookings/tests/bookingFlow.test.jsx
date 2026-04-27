import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { bookingRouteDefinitions } from '../routes/bookingRoutes'

const authGateMock = vi.hoisted(() => ({
	requestAuthentication: vi.fn(),
}))

vi.mock('../hooks/useBookingAuthGate', () => ({
	default: () => ({
		isAuthLoaded: true,
		isAuthenticated: true,
		requestAuthentication: authGateMock.requestAuthentication,
	}),
}))

function renderBookingFlow(initialPath) {
	return render(
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				{bookingRouteDefinitions.map((routeDefinition) => (
					<Route
						key={routeDefinition.path}
						path={routeDefinition.path}
						element={routeDefinition.element}
					/>
				))}
			</Routes>
		</MemoryRouter>
	)
}

describe('booking flow integration', () => {
	beforeEach(() => {
		window.localStorage.clear()
		authGateMock.requestAuthentication.mockReset()
		vi.spyOn(Math, 'random').mockReturnValue(0.2)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('completes seat selection to checkout to confirmation happy path', async () => {
		const initialSeatLayoutPath =
			'/shows/show-happy-path/seats?movieTitle=Happy%20Path%20Movie&date=2026-05-02&showTime=07:30%20PM&theater=Sangam%20IMAX'

		renderBookingFlow(initialSeatLayoutPath)

		const firstAvailableSeat = await screen.findByRole(
			'button',
			{ name: /Row 1 Seat 1 - available - \$14/i },
			{ timeout: 2500 }
		)

		fireEvent.click(firstAvailableSeat)

		const paymentButtons = screen.getAllByRole('button', { name: 'Payment' })
		fireEvent.click(paymentButtons[0])

		await screen.findByRole(
			'heading',
			{ name: /Review And Pay/i },
			{ timeout: 3500 }
		)

		fireEvent.click(screen.getByRole('button', { name: 'Proceed To Payment' }))

		await screen.findByLabelText(/Confirmed movie ticket/i, {}, { timeout: 5000 })

		expect(screen.getByText(/Sangam IMAX/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Copy Reference/i })).toBeInTheDocument()
		expect(authGateMock.requestAuthentication).not.toHaveBeenCalled()
	})
})
