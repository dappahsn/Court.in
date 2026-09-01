/**
 * Unified Slot and Schedule Helper
 * Automatically computes real-time slot availability based on actual customer bookings
 * and venue operational rules.
 */

export const OPERATIONAL_SLOTS = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00',
]

/**
 * Checks if a specific court has an active customer booking for a date and time slot.
 * Returns the booking object if booked, or null if open/available.
 */
export function getSlotBooking(bookings = [], courtId, date, slotTime) {
  if (!courtId || !date || !slotTime || !Array.isArray(bookings)) return null

  return (
    bookings.find((b) => {
      // Must match court ID and booking date, and not be cancelled
      if (b.court_id !== courtId || b.booking_date !== date || b.status === 'CANCELLED') {
        return false
      }

      const bSlot = b.time_slot || `${b.start_time} - ${b.end_time}`
      if (bSlot === slotTime) return true

      // Handle multi-hour spans (e.g. 14:00 - 16:00 covers 14:00 - 15:00 and 15:00 - 16:00)
      const [slotStart] = slotTime.split(' - ')
      const [bStart, bEnd] = bSlot.split(' - ')
      if (slotStart && bStart && bEnd) {
        const sH = parseInt(slotStart.split(':')[0], 10)
        const bsH = parseInt(bStart.split(':')[0], 10)
        const beH = parseInt(bEnd.split(':')[0], 10)
        if (sH >= bsH && sH < beH) return true
      }
      return false
    }) || null
  )
}

/**
 * Get comprehensive slot list for a court on a given date.
 * Each slot item contains:
 * - time: string e.g. '19:00 - 20:00'
 * - isAvailable: boolean (true if open, false if booked or manually locked)
 * - booking: Object | null (booking details if booked)
 * - isManualLock: boolean (true if admin locked for maintenance)
 */
export function getCourtSlotsForDate(court, date, bookings = [], manualLocks = {}) {
  const courtId = court?.id || ''

  return OPERATIONAL_SLOTS.map((time) => {
    const booking = getSlotBooking(bookings, courtId, date, time)
    const lockKey = `${courtId}_${date}_${time}`
    const isManualLock = !!manualLocks[lockKey]

    const isAvailable = !booking && !isManualLock

    return {
      time,
      isAvailable,
      booking,
      isManualLock,
      statusLabel: booking
        ? `Terpesan (${booking.customer_name})`
        : isManualLock
        ? 'Terkunci (Maintenance)'
        : 'Tersedia',
    }
  })
}
