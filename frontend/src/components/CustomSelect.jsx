import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih opsi...',
  label,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // Normalize options to [{ value, label, desc, icon }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) }
    }
    return {
      value: opt.value ?? opt.id,
      label: opt.label ?? opt.name ?? String(opt.value),
      desc: opt.desc,
      icon: opt.icon,
    }
  })

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)
  const SelectedIcon = selectedOption?.icon

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
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

  return (
    <div className={`relative ${className}`} ref={selectRef}>
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low border rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
          isOpen
            ? 'border-primary bg-surface ring-2 ring-primary/20 text-text-primary'
            : 'border-border text-text-primary hover:bg-surface hover:border-text-muted/30'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {SelectedIcon && (
            <div className="w-5 h-5 flex items-center justify-center shrink-0 text-primary">
              {typeof SelectedIcon === 'function' ? (
                <SelectedIcon size={16} className="text-primary shrink-0" />
              ) : (
                SelectedIcon
              )}
            </div>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={15}
          className={`text-text-muted shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-border shadow-2xl p-1.5 z-50 animate-slide-in backdrop-blur-md max-h-60 overflow-y-auto ${menuClassName}`}
        >
          <div className="space-y-1">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value
              const OptIcon = opt.icon

              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-light text-primary font-bold shadow-2xs border border-primary/30'
                      : 'hover:bg-surface-container-low text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {OptIcon && (
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-primary text-white [&_svg]:text-white [&_svg]:stroke-white [&_svg_*]:text-white [&_svg_*]:stroke-white'
                            : 'bg-primary-light text-primary [&_svg]:text-primary'
                        }`}
                      >
                        {typeof OptIcon === 'function' ? <OptIcon size={15} /> : OptIcon}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm block truncate">
                        {opt.label}
                      </span>
                      {opt.desc && (
                        <span className="text-[10px] text-text-muted block truncate font-normal">
                          {opt.desc}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                      <Check size={11} strokeWidth={3} />
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
