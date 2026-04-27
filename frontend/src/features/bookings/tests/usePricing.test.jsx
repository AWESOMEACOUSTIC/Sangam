import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SEAT_CLASS } from '../constants/bookingConstants'
import usePricing from '../hooks/usePricing'

describe('usePricing', () => {
  it('returns default invalid summary when no seats are selected', () => {
    const { result } = renderHook(() => usePricing([]))

    expect(result.current.seatCount).toBe(0)
    expect(result.current.classBreakdown).toEqual([])
    expect(result.current.lineItems).toEqual([])
    expect(result.current.subtotal).toBe(0)
    expect(result.current.convenienceFee).toBe(0)
    expect(result.current.orderProcessingFee).toBe(0)
    expect(result.current.taxAmount).toBe(0)
    expect(result.current.feesAndTaxesTotal).toBe(0)
    expect(result.current.totalPrice).toBe(0)
    expect(result.current.isSummaryValid).toBe(false)
    expect(result.current.validationErrors).toEqual([
      'Select at least one seat before checkout.',
    ])
  })

  it('calculates class breakdown, fees, taxes, and total for mixed seat classes', () => {
    const selectedSeats = [
      { id: 'A1', seatClass: SEAT_CLASS.STANDARD, price: 14 },
      { id: 'F2', seatClass: SEAT_CLASS.PRIME, price: 18 },
      { id: 'J1', seatClass: SEAT_CLASS.RECLINER, price: 24 },
    ]

    const { result } = renderHook(() => usePricing(selectedSeats))

    expect(result.current.seatCount).toBe(3)
    expect(result.current.classBreakdown).toEqual([
      {
        seatClass: SEAT_CLASS.STANDARD,
        seatClassLabel: 'Standard',
        seatCount: 1,
        unitPrice: 14,
        lineTotal: 14,
      },
      {
        seatClass: SEAT_CLASS.PRIME,
        seatClassLabel: 'Prime',
        seatCount: 1,
        unitPrice: 18,
        lineTotal: 18,
      },
      {
        seatClass: SEAT_CLASS.RECLINER,
        seatClassLabel: 'Recliner',
        seatCount: 1,
        unitPrice: 24,
        lineTotal: 24,
      },
    ])

    expect(result.current.lineItems).toEqual([
      { id: 'subtotal', label: 'Seat Subtotal', amount: 56 },
      {
        id: 'convenience-fee',
        label: 'Convenience Fee (3 x $1.75)',
        amount: 5.25,
      },
      {
        id: 'order-processing',
        label: 'Order Processing Fee',
        amount: 2.5,
      },
      { id: 'tax', label: 'Tax (18%)', amount: 11.48 },
    ])

    expect(result.current.subtotal).toBe(56)
    expect(result.current.convenienceFee).toBe(5.25)
    expect(result.current.orderProcessingFee).toBe(2.5)
    expect(result.current.taxAmount).toBe(11.48)
    expect(result.current.feesAndTaxesTotal).toBe(19.23)
    expect(result.current.totalPrice).toBe(75.23)
    expect(result.current.isSummaryValid).toBe(true)
    expect(result.current.validationErrors).toEqual([])
  })

  it('uses seat-level prices when provided for subtotal and totals', () => {
    const selectedSeats = [
      { id: 'F1', seatClass: SEAT_CLASS.PRIME, price: 19.5 },
      { id: 'F2', seatClass: SEAT_CLASS.PRIME, price: 20.25 },
    ]

    const { result } = renderHook(() => usePricing(selectedSeats))

    expect(result.current.classBreakdown).toEqual([
      {
        seatClass: SEAT_CLASS.PRIME,
        seatClassLabel: 'Prime',
        seatCount: 2,
        unitPrice: 18,
        lineTotal: 39.75,
      },
    ])
    expect(result.current.subtotal).toBe(39.75)
    expect(result.current.convenienceFee).toBe(3.5)
    expect(result.current.orderProcessingFee).toBe(2.5)
    expect(result.current.taxAmount).toBe(8.24)
    expect(result.current.feesAndTaxesTotal).toBe(14.24)
    expect(result.current.totalPrice).toBe(53.99)
    expect(result.current.isSummaryValid).toBe(true)
    expect(result.current.validationErrors).toEqual([])
  })

  it('flags pricing as invalid when any selected seat has a non-positive fare', () => {
    const selectedSeats = [
      { id: 'A1', seatClass: SEAT_CLASS.STANDARD, price: 14 },
      { id: 'F2', seatClass: SEAT_CLASS.PRIME, price: 0 },
    ]

    const { result } = renderHook(() => usePricing(selectedSeats))

    expect(result.current.isSummaryValid).toBe(false)
    expect(result.current.validationErrors).toContain(
      'One or more selected seats has an invalid fare.'
    )
  })
})
