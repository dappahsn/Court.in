import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Layers } from 'lucide-react'
import SportIcon from './SportIcon'

const SPORT_OPTIONS = [
  {
    id: '',
    name: 'Semua Olahraga',
    caption: 'Semua venue & kategori',
    iconType: null,
    badge: 'Semua',
    color: 'bg-surface-container',
  },
  {
    id: 'FUTSAL',
    name: 'Futsal',
    caption: 'Vinyl & Interlock standar turnamen',
    iconType: 'FUTSAL',
    badge: 'Populer',
    color: 'bg-primary-light',
  },
  {
    id: 'BADMINTON',
    name: 'Badminton',
    caption: 'Karpet profesional standar BWF',
    iconType: 'BADMINTON',
    badge: 'Favorit',
    color: 'bg-primary-light',
  },
  {
    id: 'PADEL',
    name: 'Padel Tennis',
    caption: 'Kaca panoramik & rumput sintetis',
    iconType: 'PADEL',
    badge: 'Trending',
    color: 'bg-primary-light',
  },
]

export default function SportPicker({ value = '', onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedSport = SPORT_OPTIONS.find((s) => s.id === value) || SPORT_OPTIONS[0]

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
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

  const handleSelect = (sportId) => {
    onChange?.(sportId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
          isOpen ? 'bg-surface-container-low ring-2 ring-primary/20' : 'hover:bg-surface-container-low'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-2xs">
            {selectedSport.iconType ? (
              <SportIcon type={selectedSport.iconType} className="w-5 h-5" />
            ) : (
              <Layers size={18} />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-text-primary truncate block">
                {selectedSport.name}
              </span>
              {selectedSport.id && (
                <span className="text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.2 rounded-md hidden sm:inline-block">
                  {selectedSport.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted truncate block">
              {selectedSport.caption}
            </span>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-text-muted shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:left-0 sm:w-[320px] top-full mt-2 bg-surface rounded-2xl border border-border shadow-2xl p-2 z-[100] animate-slide-in backdrop-blur-md">
          <div className="px-3 py-2 border-b border-border/60">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Pilih Cabang Olahraga
            </span>
          </div>

          <div className="p-1 space-y-1 mt-1">
            {SPORT_OPTIONS.map((sport) => {
              const isSelected = value === sport.id

              return (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => handleSelect(sport.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-primary-light border border-primary/30 text-primary font-bold shadow-2xs'
                      : 'hover:bg-surface-container-low text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-text-secondary group-hover:bg-primary-light group-hover:text-primary'
                      }`}
                    >
                      {sport.iconType ? (
                        <SportIcon type={sport.iconType} className="w-5 h-5" />
                      ) : (
                        <Layers size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm block truncate ${
                            isSelected ? 'font-bold text-primary' : 'font-semibold text-text-primary'
                          }`}
                        >
                          {sport.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md font-medium bg-surface-container text-text-secondary">
                          {sport.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted block truncate mt-0.5">
                        {sport.caption}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 ml-2">
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
