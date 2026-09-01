import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { SORT_OPTIONS } from '../data/sortOptions'

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const activeOption = SORT_OPTIONS.find((opt) => opt.id === value) || SORT_OPTIONS[0]
  const ActiveIcon = activeOption.icon

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
          isOpen
            ? 'bg-surface border-primary ring-2 ring-primary/20 text-primary shadow-xs'
            : 'bg-surface-container-low border-border text-text-primary hover:bg-surface hover:border-text-muted/30'
        }`}
      >
        <ActiveIcon size={15} className="text-primary shrink-0" />
        <span className="truncate max-w-[130px] sm:max-w-none">{activeOption.label}</span>
        <ChevronDown
          size={15}
          className={`text-text-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-2xl border border-border shadow-2xl p-1.5 z-50 animate-slide-in backdrop-blur-md"
        >
          <div className="px-3 py-2 border-b border-border/80 mb-1">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Urutkan Lapangan
            </span>
          </div>

          <div className="space-y-1">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.id === value
              const OptIcon = opt.icon

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-light text-primary font-bold shadow-2xs border border-primary/30'
                      : 'hover:bg-surface-container-low text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-surface-container text-text-secondary'
                      }`}
                    >
                      <OptIcon size={15} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm block truncate">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-text-muted block truncate font-normal">
                        {opt.desc}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
