import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react'

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// Static years list from 2020 down to 1940
const CURRENT_YEAR = new Date().getFullYear()
const MAX_ALLOWED_YEAR = CURRENT_YEAR - 5
const YEARS_LIST = Array.from({ length: MAX_ALLOWED_YEAR - 1940 + 1 }, (_, i) => MAX_ALLOWED_YEAR - i)

export default function BirthDatePicker({ value, onChange, hasError = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState('DAYS') // 'DAYS' | 'MONTHS' | 'YEARS'
  const containerRef = useRef(null)

  // Parse initial selected value (expected YYYY-MM-DD)
  const parsedDate = useMemo(() => {
    if (!value) return null
    const parts = value.split('-')
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      return isNaN(d.getTime()) ? null : d
    }
    return null
  }, [value])

  const defaultYear = CURRENT_YEAR - 20 // Default view to ~20 years ago (e.g. 2006)

  const [viewYear, setViewYear] = useState(() => (parsedDate ? parsedDate.getFullYear() : defaultYear))
  const [viewMonth, setViewMonth] = useState(() => (parsedDate ? parsedDate.getMonth() : 0))

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setViewMode('DAYS')
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setViewMode('DAYS')
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

  // Calculate days for the calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()

  // Navigation
  const prevMonth = (e) => {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = (e) => {
    e.stopPropagation()
    if (viewYear >= MAX_ALLOWED_YEAR && viewMonth >= 11) return

    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const selectDate = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const isoString = `${viewYear}-${formattedMonth}-${formattedDay}`
    onChange(isoString)
    setIsOpen(false)
    setViewMode('DAYS')
  }

  const handleOpen = () => {
    if (parsedDate) {
      setViewYear(parsedDate.getFullYear())
      setViewMonth(parsedDate.getMonth())
    }
    setIsOpen(!isOpen)
  }

  // Display text formatted
  const displayLabel = useMemo(() => {
    if (!parsedDate) return 'Pilih Tanggal Lahir'
    const day = parsedDate.getDate()
    const month = MONTH_NAMES[parsedDate.getMonth()]
    const year = parsedDate.getFullYear()
    return `${day} ${month} ${year}`
  }, [parsedDate])

  const today = new Date()

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button / Input Style */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full pl-10 pr-4 py-2.5 bg-surface-container-low border rounded-xl text-sm flex items-center justify-between text-left transition-all cursor-pointer ${
          hasError
            ? 'border-danger/80 focus:border-danger bg-danger/5 ring-1 ring-danger/20 text-text-primary'
            : isOpen
            ? 'border-primary ring-2 ring-primary/20 bg-surface text-text-primary'
            : 'border-border hover:border-primary/50 text-text-primary'
        }`}
      >
        <Calendar
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
            parsedDate ? 'text-primary' : 'text-text-muted'
          }`}
          size={16}
        />
        <span className={parsedDate ? 'font-semibold text-text-primary' : 'text-text-muted/70 font-normal'}>
          {displayLabel}
        </span>
        <ChevronDown
          size={15}
          className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
        />
      </button>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-surface rounded-2xl border border-border shadow-2xl p-4 z-50 animate-slide-in space-y-3">
          {/* Header Nav / Selectors */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-border">
            {/* Quick Month & Year Header Switchers */}
            <div className="flex items-center gap-1.5">
              {/* Month Trigger */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'MONTHS' ? 'DAYS' : 'MONTHS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  viewMode === 'MONTHS'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container hover:bg-surface-container-high text-text-primary'
                }`}
              >
                <span>{MONTH_NAMES[viewMonth]}</span>
                <ChevronDown size={12} />
              </button>

              {/* Year Trigger */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'YEARS' ? 'DAYS' : 'YEARS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  viewMode === 'YEARS'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container hover:bg-surface-container-high text-text-primary'
                }`}
              >
                <span>{viewYear}</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Prev / Next Month Arrows */}
            {viewMode === 'DAYS' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  title="Bulan sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  title="Bulan berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* ── 1. MONTH SELECTOR GRID ── */}
          {viewMode === 'MONTHS' && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {MONTH_SHORT.map((mName, idx) => {
                const isSelected = viewMonth === idx
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      setViewMonth(idx)
                      setViewMode('DAYS')
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-low hover:bg-primary-light hover:text-primary text-text-primary'
                    }`}
                  >
                    {MONTH_NAMES[idx]}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── 2. YEAR SELECTOR GRID ── */}
          {viewMode === 'YEARS' && (
            <div className="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-1 py-1 scrollbar-thin">
              {YEARS_LIST.map((yr) => {
                const isSelected = viewYear === yr
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setViewYear(yr)
                      setViewMode('DAYS')
                    }}
                    className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'hover:bg-primary-light hover:text-primary text-text-primary'
                    }`}
                  >
                    {yr}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── 3. STANDARD DAY CALENDAR GRID ── */}
          {viewMode === 'DAYS' && (
            <div className="space-y-1.5">
              {/* Day of Week Header */}
              <div className="grid grid-cols-7 text-center">
                {DAY_NAMES.map((d, i) => (
                  <span
                    key={d}
                    className={`text-[10px] font-bold uppercase ${
                      i === 0 ? 'text-rose-500' : 'text-text-muted'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-8 h-8" />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1
                  const isSelected =
                    parsedDate &&
                    parsedDate.getFullYear() === viewYear &&
                    parsedDate.getMonth() === viewMonth &&
                    parsedDate.getDate() === dayNum

                  const isToday =
                    today.getFullYear() === viewYear &&
                    today.getMonth() === viewMonth &&
                    today.getDate() === dayNum

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => selectDate(dayNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer mx-auto ${
                        isSelected
                          ? 'bg-primary text-white font-bold shadow-md scale-105'
                          : isToday
                          ? 'border border-primary text-primary font-bold hover:bg-primary-light'
                          : 'text-text-primary hover:bg-primary-light hover:text-primary'
                      }`}
                    >
                      {dayNum}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Popover Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setViewMode('DAYS')
              }}
              className="text-text-muted hover:text-text-primary font-medium px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
            {value && (
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Check size={12} />
                <span>Terpilih</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
