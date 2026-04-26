import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedBookingRoute from '../routes/ProtectedBookingRoute'

const mocked = vi.hoisted(() => ({
  location: {
    pathname: '/bookings/seat-selection/show-44',
    search: '?date=2026-04-26',
    hash: '#vip',
  },
  authGate: {
    isAuthLoaded: true,
    isAuthenticated: false,
    requestAuthentication: vi.fn(),
  },
}))

vi.mock('../hooks/useBookingAuthGate', () => ({
  default: () => mocked.authGate,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useLocation: () => mocked.location,
  }
})

describe('ProtectedBookingRoute', () => {
  beforeEach(() => {
    mocked.location = {
      pathname: '/bookings/seat-selection/show-44',
      search: '?date=2026-04-26',
      hash: '#vip',
    }

    mocked.authGate.isAuthLoaded = true
    mocked.authGate.isAuthenticated = false
    mocked.authGate.requestAuthentication.mockReset()
  })

  it('renders children when user is authenticated', () => {
    mocked.authGate.isAuthenticated = true

    render(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    expect(screen.getByText('Booking content')).toBeInTheDocument()
    expect(screen.queryByText('Sign in to continue booking')).not.toBeInTheDocument()
    expect(mocked.authGate.requestAuthentication).not.toHaveBeenCalled()
  })

  it('renders auth required screen while user is unauthenticated', () => {
    render(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    expect(screen.getByText('Sign in to continue booking')).toBeInTheDocument()
    expect(screen.queryByText('Booking content')).not.toBeInTheDocument()
  })

  it('requests authentication exactly once per mount when unauthenticated', async () => {
    const expectedPath = '/bookings/seat-selection/show-44?date=2026-04-26#vip'

    const { rerender } = render(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    await waitFor(() => {
      expect(mocked.authGate.requestAuthentication).toHaveBeenCalledTimes(1)
    })

    rerender(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    expect(mocked.authGate.requestAuthentication).toHaveBeenCalledTimes(1)
    expect(mocked.authGate.requestAuthentication).toHaveBeenCalledWith(expectedPath)
  })

  it('triggers authentication when Sign in button is clicked', async () => {
    const expectedPath = '/bookings/seat-selection/show-44?date=2026-04-26#vip'

    render(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    await waitFor(() => {
      expect(mocked.authGate.requestAuthentication).toHaveBeenCalledTimes(1)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(mocked.authGate.requestAuthentication).toHaveBeenCalledTimes(2)
    expect(mocked.authGate.requestAuthentication).toHaveBeenLastCalledWith(
      expectedPath
    )
  })

  it('does not request authentication until auth state is loaded', () => {
    mocked.authGate.isAuthLoaded = false

    render(
      <ProtectedBookingRoute>
        <div>Booking content</div>
      </ProtectedBookingRoute>
    )

    expect(mocked.authGate.requestAuthentication).not.toHaveBeenCalled()
    expect(screen.getByText('Sign in to continue booking')).toBeInTheDocument()
  })
})
