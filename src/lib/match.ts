import type { Arrival, Booking } from './types'

const MIN_PLATE_QUERY_LENGTH = 3
const MIN_NAME_QUERY_LENGTH = 2

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/[\s\-・･.,]/g, '')
}

function nameKeys(booking: Booking): string[] {
  const names = [booking.guestName, booking.alias]
  const parts = names.flatMap((name) => name.split(/\s+/)).filter((part) => part.length >= MIN_NAME_QUERY_LENGTH)
  return [...names, ...parts].map(normalize)
}

function plateKeys(booking: Booking): string[] {
  const full = normalize(booking.plate)
  const digits = full.replace(/\D/g, '')
  return digits ? [full, digits] : [full]
}

/** Finds the booking a guest typed a name or plate for. Returns null when nothing matches. */
export function findBooking(bookings: readonly Booking[], query: string, takenIds: ReadonlySet<string>): Booking | null {
  const q = normalize(query)
  if (q.length < MIN_NAME_QUERY_LENGTH) return null

  const isMatch = (booking: Booking): boolean => {
    if (takenIds.has(booking.id)) return false
    const byName = nameKeys(booking).some((key) => key === q || key.includes(q) || q.includes(key))
    const byPlate = q.length >= MIN_PLATE_QUERY_LENGTH && plateKeys(booking).some((key) => key === q || key.endsWith(q))
    return byName || byPlate
  }

  return bookings.find(isMatch) ?? null
}

/** Picks the first site nobody is using, or a generic walk-in label when the park is full. */
export function nextFreeSite(sites: readonly string[], usedSites: ReadonlySet<string>): string {
  return sites.find((site) => !usedSites.has(site)) ?? 'Walk-in'
}

/** Sites currently occupied: reserved bookings not yet checked out, plus arrivals that haven't checked out. */
export function occupiedSites(bookings: readonly Booking[], arrivals: readonly Arrival[]): Set<string> {
  const checkedOutBookingIds = new Set(arrivals.flatMap((a) => (a.checkedOutAt && a.bookingId ? [a.bookingId] : [])))
  const bookingSites = bookings.filter((b) => !checkedOutBookingIds.has(b.id)).map((b) => b.site)
  const activeArrivalSites = arrivals.filter((a) => !a.checkedOutAt).map((a) => a.site)
  return new Set([...bookingSites, ...activeArrivalSites])
}
