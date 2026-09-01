import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

export default function TimePicker({
  value = '07:00',
  onChange,
  label,
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef(null)

  // Derive hour & minute directly from value (avoids unnecessary effects)
  const parts = (value || '07:00').split(':')
  const selectedHour = parts[0] || '07'
  const selectedMinute = parts[1] || '00'

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
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

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutesList = ['00', '15', '30', '45']

  const handleSelectTime = (timeStr) => {
    onChange(timeStr)
    setIsOpen(false)
  }

  const handleCustomTime = (h, m) => {
    onChange(`${h}:${m}`)
  }

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low border rounded-xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
          isOpen
            ? 'border-primary bg-surface ring-2 ring-primary/20 text-text-primary'
            : 'border-border text-text-primary hover:bg-surface hover:border-text-muted/30'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-primary shrink-0" />
          <span className="font-mono tracking-wider">{value} WIB</span>
        </div>

        <ChevronDown
          size={15}
          className={`text-text-muted shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-surface rounded-2xl border border-border shadow-2xl p-4 z-50 animate-slide-in backdrop-blur-md space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Pilih Jam Operasional
            </span>
            <span className="text-xs font-bold text-primary font-mono">{value} WIB</span>
          </div>

          {/* Quick Presets Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-text-muted block">Preset Cepat:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['07:00', '08:00', '15:00', '22:00', '23:00', '00:00'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectTime(preset)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    value === preset
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-text-primary'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Hour & Minute Dual Wheel / Scroll */}
          <div className="pt-2 border-t border-border/80">
            <span className="text-[10px] font-semibold text-text-muted block mb-1.5">Kustom Jam & Menit:</span>
            <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-2.5 rounded-xl border border-border">
              {/* Hours Column */}
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase block text-center mb-1">
                  Jam
                </span>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {hoursList.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleCustomTime(h, selectedMinute)}
                      className={`w-full py-1 rounded-lg text-xs font-mono text-center font-semibold transition-colors cursor-pointer ${
                        selectedHour === h
                          ? 'bg-primary text-white font-bold'
                          : 'hover:bg-surface text-text-primary'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase block text-center mb-1">
                  Menit
                </span>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {minutesList.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleCustomTime(selectedHour, m)}
                      className={`w-full py-1.5 rounded-lg text-xs font-mono text-center font-semibold transition-colors cursor-pointer ${
                        selectedMinute === m
                          ? 'bg-primary text-white font-bold'
                          : 'hover:bg-surface text-text-primary'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Done Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      )}
    </div>
  )
}
