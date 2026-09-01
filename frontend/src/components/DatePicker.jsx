import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function DatePicker({ value, onChange, minDate }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Current view year & month
  const initialDate = value ? new Date(value) : new Date()
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const min = minDate ? new Date(minDate) : today
  min.setHours(0, 0, 0, 0)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  // Calculate calendar days
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const handleSelectDate = (dayNumber) => {
    const d = new Date(viewYear, viewMonth, dayNumber)
    // format as YYYY-MM-DD
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    onChange(dateStr)
    setIsOpen(false)
  }

  // Quick Preset Handlers
  const handleSelectPreset = (daysOffset) => {
    const target = new Date(today)
    target.setDate(today.getDate() + daysOffset)
    const yyyy = target.getFullYear()
    const mm = String(target.getMonth() + 1).padStart(2, '0')
    const dd = String(target.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    setViewYear(target.getFullYear())
    setViewMonth(target.getMonth())
    onChange(dateStr)
    setIsOpen(false)
  }

  // Format label for trigger button
  const formatTriggerLabel = (dateStr) => {
    if (!dateStr) return 'Pilih Tanggal'
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    d.setHours(0, 0, 0, 0)

    const isToday = d.getTime() === today.getTime()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const isTomorrow = d.getTime() === tomorrow.getTime()

    const dayName = DAY_NAMES[d.getDay()]
    const monthName = MONTH_NAMES[d.getMonth()]

    if (isToday) {
      return `Hari Ini, ${d.getDate()} ${monthName}`
    }
    if (isTomorrow) {
      return `Besok, ${d.getDate()} ${monthName}`
    }
    return `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}`
  }

  const selectedDateObj = value ? new Date(value) : null
  if (selectedDateObj) selectedDateObj.setHours(0, 0, 0, 0)

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* ── 1. Interactive Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 text-left focus:outline-none cursor-pointer group"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar size={15} />
          </div>
          <span className="text-sm font-bold text-text-primary truncate">
            {formatTriggerLabel(value)}
          </span>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md shrink-0">
          Ubah
        </span>
      </button>

      {/* ── 2. Popover Calendar Modal Card ── */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-3 w-[320px] sm:w-[340px] bg-surface rounded-2xl border border-border shadow-2xl p-4 z-50 animate-slide-in">
          {/* Quick Presets Bar */}
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
            <button
              type="button"
              onClick={() => handleSelectPreset(0)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-primary-light hover:text-primary transition-colors text-center text-text-secondary cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(1)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-primary-light hover:text-primary transition-colors text-center text-text-secondary cursor-pointer"
            >
              Besok
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="font-bold text-sm text-text-primary">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface-container-low hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Bulan Sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface-container-low hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Bulan Berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((name, i) => (
              <span
                key={name}
                className={`text-[11px] font-bold uppercase ${
                  i === 0 || i === 6 ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for days before 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1
              const thisDate = new Date(viewYear, viewMonth, dayNum)
              thisDate.setHours(0, 0, 0, 0)

              const isPast = thisDate < min
              const isSelected = selectedDateObj && thisDate.getTime() === selectedDateObj.getTime()
              const isCurrentDay = thisDate.getTime() === today.getTime()

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDate(dayNum)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center mx-auto cursor-pointer ${
                    isPast
                      ? 'text-text-muted/30 cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-white font-extrabold shadow-sm scale-105'
                      : isCurrentDay
                      ? 'border border-primary text-primary font-bold hover:bg-primary-light'
                      : 'text-text-primary hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-border/80 flex items-center justify-between text-[11px] text-text-muted">
            <span>Pilih tanggal bermain</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
