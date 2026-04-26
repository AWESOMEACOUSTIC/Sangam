import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useBookingAuthGate from '../hooks/useBookingAuthGate'

const BOOKING_REDIRECT_KEY = 'sangam.booking.redirectPath'

const mocked = vi.hoisted(() => ({
  user: null,
  isLoaded: true,
  location: {
    pathname: '/bookings/showtimes/show-1',
    search: '',
    hash: '',
  },
  openSignIn: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@clerk/react', () => ({
  useUser: () => ({ user: mocked.user, isLoaded: mocked.isLoaded }),
  useClerk: () => ({ openSignIn: mocked.openSignIn }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useLocation: () => mocked.location,
    useNavigate: () => mocked.navigate,
  }
})

describe('useBookingAuthGate', () => {
  beforeEach(() => {
    mocked.user = null
    mocked.isLoaded = true
    mocked.location = {
      pathname: '/bookings/showtimes/show-1',
      search: '',
      hash: '',
    }

    mocked.openSignIn.mockReset()
    mocked.navigate.mockReset()
    window.sessionStorage.clear()
  })

  it('returns false and opens sign in when auth is loaded but user is missing', () => {
    const { result } = renderHook(() => useBookingAuthGate())

    const isAllowed = result.current.ensureAuthenticated('/bookings/seat-selection/show-1')

    expect(isAllowed).toBe(false)
    expect(mocked.openSignIn).toHaveBeenCalledTimes(1)
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBe(
      '/bookings/seat-selection/show-1'
    )
  })

  it('does not open sign in while auth is still loading', () => {
    mocked.isLoaded = false

    const { result } = renderHook(() => useBookingAuthGate())

    const isAllowed = result.current.ensureAuthenticated('/bookings/seat-selection/show-1')

    expect(isAllowed).toBe(false)
    expect(mocked.openSignIn).not.toHaveBeenCalled()
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBeNull()
  })

  it('returns true when user is authenticated', () => {
    mocked.user = { id: 'user-1' }

    const { result } = renderHook(() => useBookingAuthGate())

    const isAllowed = result.current.ensureAuthenticated('/bookings/seat-selection/show-1')

    expect(isAllowed).toBe(true)
    expect(mocked.openSignIn).not.toHaveBeenCalled()
  })

  it('stores current path when requesting authentication without a target path', () => {
    mocked.location = {
      pathname: '/bookings/seat-selection/show-2/',
      search: '',
      hash: '',
    }

    const { result } = renderHook(() => useBookingAuthGate())

    result.current.requestAuthentication()

    expect(mocked.openSignIn).toHaveBeenCalledTimes(1)
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBe(
      '/bookings/seat-selection/show-2'
    )
  })

  it('redirects to pending path after sign in and clears stored path', () => {
    window.sessionStorage.setItem(BOOKING_REDIRECT_KEY, '/bookings/checkout/show-9')

    const { rerender } = renderHook(() => useBookingAuthGate())

    expect(mocked.navigate).not.toHaveBeenCalled()

    mocked.user = { id: 'user-2' }
    rerender()

    expect(mocked.navigate).toHaveBeenCalledWith('/bookings/checkout/show-9', {
      replace: true,
    })
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBeNull()
  })

  it('clears stored path without navigating when pending path matches current path', () => {
    mocked.user = { id: 'user-3' }
    mocked.location = {
      pathname: '/bookings/history',
      search: '',
      hash: '',
    }

    window.sessionStorage.setItem(BOOKING_REDIRECT_KEY, '/bookings/history/')

    renderHook(() => useBookingAuthGate())

    expect(mocked.navigate).not.toHaveBeenCalled()
    expect(window.sessionStorage.getItem(BOOKING_REDIRECT_KEY)).toBeNull()
  })
})
