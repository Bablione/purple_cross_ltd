import { describe, expect, it } from 'vitest'
import {
  compareCalendarDates,
  formatCalendarDate,
  getEmploymentStatus,
  getEmployeeLifecycleStatus,
  getTerminationStatus,
  parseCalendarDate,
} from './date'

// Create a fixed today date so that the tests always produce the same result
const today = new Date(2026, 8, 21, 20, 14)

describe('date utils', () => {

  it('parses a valid calendar date', () => {

    const result = parseCalendarDate('2026-09-21')
    // Expectation
    expect(result?.getFullYear()).toBe(2026)
    expect(result?.getMonth()).toBe(8)
    expect(result?.getDate()).toBe(21)
  })


  it('rejects invalid dates', () => {

    // None existing date
    expect(parseCalendarDate('2026-02-30')).toBeNull()
    // Invalid format
    expect(parseCalendarDate('21-09-2026')).toBeNull()
    // Empty string
    expect(parseCalendarDate('')).toBeNull()
  })


  it('compares dates with today', () => {
    
    // Yesterday to be -1
    expect(compareCalendarDates('2026-09-20', today)).toBe(-1)
    // Today to be 0
    expect(compareCalendarDates('2026-09-21', today)).toBe(0)
    // Later date to be 1
    expect(compareCalendarDates('2026-09-22', today)).toBe(1)
  })

  it('returns correct employment status', () => {

    // Employed from today should be Currently employed
    expect(getEmploymentStatus('2026-09-21', today))
      .toBe('Currently employed')
    // A past date should be Currently employed 
    expect(getEmploymentStatus('2025-01-01', today))
      .toBe('Currently employed')
    // Future date should be Employed soon
    expect(getEmploymentStatus('2026-10-01', today))
      .toBe('Employed soon')
  })

  it('returns the correct termination status', () => {

    // No termination date
    expect(getTerminationStatus(null, today)).toBeNull()
    // Termination is today should return Terminated
    expect(getTerminationStatus('2026-09-21', today))
      .toBe('Terminated')
    // If termination date is later it should say To be terminated
    expect(getTerminationStatus('2026-10-01', today))
      .toBe('To be terminated')
  })

  it('formats dates for display', () => {

    expect(formatCalendarDate('2026-04-13')).toBe('13 Apr 2026')
    // If null, return -
    expect(formatCalendarDate(null)).toBe('-')
  })

  it('marks an employee with a past termination date as terminated', () => {
    
  expect(
    getEmployeeLifecycleStatus(
      '2020-01-01',
      '2026-09-20',
      today,
    ),
  ).toBe('Terminated')
})

it('marks an active employee with a future termination as leaving soon', () => {
  expect(
    getEmployeeLifecycleStatus(
      '2020-01-01',
      '2026-10-01',
      today,
    ),
  ).toBe('To be terminated')
})
})