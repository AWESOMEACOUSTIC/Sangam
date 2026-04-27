import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { bookingRouteDefinitions } from '../routes/bookingRoutes'

const BOOKING_REDIRECT_KEY = 'sangam.booking.redirectPath'

const authState = vi.hoisted(() => ({
  user: null,
  isLoaded: true,
  openSignIn: vi.fn(),
}))

vi.mock('@clerk/react', () => ({
  useUser: () => ({ user: authState.user, isLoaded: authState.isLoaded }),
  useClerk: () => ({ openSignIn: authState.openSignIn }),
}))

function renderBookingRoutes(initialPath) {
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

describe('logged-out deep-link integration', () => {
  beforeEach(() => {
    authState.user = null
    authState.isLoaded = true
    authState.openSignIn.mockReset()
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('stores deep-link path while logged out and redirects to it after sign in', async () => {
    const deepLinkPath =
      '/shows/deep-link-show/seats?movieTitle=Deep%20Link%20Movie&date=2026-05-03&showTime=08:00%20PM&theater=Sangam%20IMAX'

    const initialRender = renderBookingRoutes(deepLinkPath)

    await screen.findByText('Sign in to continue booking')

    expect(authState.openSignIn).toHaveBeenCalledTimes(1)
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBe(deepLinkPath)

    initialRender.unmount()

    authState.user = { id: 'user-1' }
    renderBookingRoutes('/bookings')

    await screen.findByText(/Deep Link Movie/i, {}, { timeout: 3000 })

    await waitFor(() => {
      expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBeNull()
    })

    expect(authState.openSignIn).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Sign in to continue booking')).not.toBeInTheDocument()
  })
})
