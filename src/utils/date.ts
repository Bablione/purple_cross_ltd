import type { EmploymentStatus, TerminationStatus, EmployeeLifecycleStatus } from '../types/employee'

// Expected format: YYYY-MM-DD
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

// Used to display dates like "01 Jan 2027"
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/**
 * Converts a YYYY-MM-DD string into a Date object.
 * Check validity and returns null if the value is not a valid date.
 */
export function parseCalendarDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1 // JavaScript months start at 0
  const day = Number(match[3])

  const date = new Date(0)

  date.setFullYear(year, month, day)
  date.setHours(0, 0, 0, 0)

  // we check that the final date still matches the input.
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day

  return isValidDate ? date : null
}

/**
 * Returns today's date with the time removed.
 */
export function todayAsCalendarDate(now = new Date()): Date {
  const today = new Date(now)

  today.setHours(0, 0, 0, 0)

  return today
}

/**
 * Compares a date with today.
 *
 * Returns
 *  -1 if the date is in the past
 *   0 if the date is today
 *   1 if the date is in the future
 */
export function compareCalendarDates(
  value: string,
  now = new Date(),
): number {
  const date = parseCalendarDate(value)

  if (!date) {
    throw new RangeError(`Invalid calendar date: ${value}`)
  }

  const today = todayAsCalendarDate(now)

  return Math.sign(date.getTime() - today.getTime())
}

/**
 * Works out the employee's current employment status
 * based on their start date.
 */
export function getEmploymentStatus(
  startDate: string,
  now = new Date(),
): EmploymentStatus {
  const startsInFuture = compareCalendarDates(startDate, now) > 0

  return startsInFuture ? 'Employed soon' : 'Currently employed'
}

/**
 * Works out the employee's termination status.
 * Returns null when no termination date has been set.
 */
export function getTerminationStatus(
  terminationDate: string | null,
  now = new Date(),
): TerminationStatus {
  if (!terminationDate) {
    return null
  }

  const endsInFuture = compareCalendarDates(terminationDate, now) > 0

  return endsInFuture ? 'To be terminated' : 'Terminated'
}

/**
 * Formats a YYYY-MM-DD value into a readable date.
 * 
 * Example
 * 2026-09-21 -> 21 Sep 2026
 */
export function formatCalendarDate(value: string | null): string {
  if (!value) {
    return '-'
  }

  const date = parseCalendarDate(value)

  if (!date) {
    return 'Invalid date'
  }

  return dateFormatter.format(date)
}

// Method make sure if someone is terminated, he will not be currently employed
export function getEmployeeLifecycleStatus(
  employmentDate: string,
  terminationDate: string | null,
  now = new Date(),
): EmployeeLifecycleStatus {
  if (
    terminationDate &&
    compareCalendarDates(terminationDate, now) <= 0
  ) {
    return 'Terminated'
  }

  if (compareCalendarDates(employmentDate, now) > 0) {
    return 'Employed soon'
  }

  if (terminationDate) {
    return 'To be terminated'
  }

  return 'Currently employed'
}