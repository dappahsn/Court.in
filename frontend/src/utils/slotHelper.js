/**
 * Unified Slot and Schedule Helper
 * Automatically computes real-time slot availability based on actual customer bookings,
 * current real-time clock (locking past hours), and venue operational rules.
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
 * Checks if a slot on a given date has already passed compared to the current real-time clock.
 */
export function isSlotPastRealTime(dateStr, slotTime) {
  if (!dateStr || !slotTime) return false

  const now = new Date()
  const todayYear = now.getFullYear()
  const todayMonth = String(now.getMonth() + 1).padStart(2, '0')
  const todayDay = String(now.getDate()).padStart(2, '0')
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`

  // 1. If date is in the past (e.g. yesterday)
  if (dateStr < todayStr) {
    return true
  }

  // 2. If date is in the future (e.g. tomorrow or next week)
  if (dateStr > todayStr) {
    return false
  }

  // 3. If date is TODAY, compare hour and minute
  const [slotStart] = slotTime.split(' - ')
  if (!slotStart) return false

  const [slotHourStr, slotMinuteStr] = slotStart.split(':')
  const slotHour = parseInt(slotHourStr, 10)
  const slotMinute = parseInt(slotMinuteStr, 10)

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  if (currentHour > slotHour) {
    return true
  }
  if (currentHour === slotHour && currentMinute >= slotMinute) {
    return true
  }

  return false
}

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
 * - isAvailable: boolean (true if open and in future, false if booked, manually locked, or past real time)
 * - booking: Object | null (booking details if booked)
 * - isManualLock: boolean (true if admin locked for maintenance)
 * - isPast: boolean (true if slot time has passed real-time clock)
 */
export function getCourtSlotsForDate(court, date, bookings = [], manualLocks = {}) {
  const courtId = court?.id || ''

  return OPERATIONAL_SLOTS.map((time) => {
    const booking = getSlotBooking(bookings, courtId, date, time)
    const lockKey = `${courtId}_${date}_${time}`
    const isManualLock = !!manualLocks[lockKey]
    const isPast = isSlotPastRealTime(date, time)

    const isAvailable = !booking && !isManualLock && !isPast

    return {
      time,
      isAvailable,
      booking,
      isManualLock,
      isPast,
      statusLabel: isPast
        ? 'Lewat Jam / Selesai'
        : booking
        ? `Terpesan (${booking.customer_name})`
        : isManualLock
        ? 'Terkunci (Maintenance)'
        : 'Tersedia',
    }
  })
}
