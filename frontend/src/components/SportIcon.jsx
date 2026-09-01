/**
 * Bespoke, handcrafted SVG sport logos/icons for Futsal, Badminton, and Padel.
 * Clean, modern, scalable, athletic geometry (no emojis, no AI distortion).
 */

export function FutsalIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Precision geometric futsal ball */}
      <circle cx="12" cy="12" r="9.5" />
      {/* Central pentagon (filled) */}
      <polygon points="12,7.5 15.5,10 14,14 10,14 8.5,10" fill="currentColor" />
      {/* Seam lines connecting outward */}
      <line x1="12" y1="7.5" x2="12" y2="2.5" />
      <line x1="15.5" y1="10" x2="20.5" y2="8" />
      <line x1="14" y1="14" x2="18.2" y2="18.2" />
      <line x1="10" y1="14" x2="5.8" y2="18.2" />
      <line x1="8.5" y1="10" x2="3.5" y2="8" />
    </svg>
  )
}

export function BadmintonIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Shuttlecock cork base */}
      <path
        d="M9.5 17.5C9.5 18.88 10.62 20 12 20C13.38 20 14.5 18.88 14.5 17.5L15 15H9L9.5 17.5Z"
        fill="currentColor"
      />
      {/* Shuttlecock feather skirt lines */}
      <path d="M9 15L5.5 5C5.5 5 8.5 4 12 4C15.5 4 18.5 5 18.5 5L15 15" />
      {/* Feather ribs */}
      <line x1="8.5" y1="5" x2="10.5" y2="15" />
      <line x1="12" y1="4" x2="12" y2="15" />
      <line x1="15.5" y1="5" x2="13.5" y2="15" />
      {/* Structural thread band */}
      <path d="M7 10C8.5 9.5 10.2 9.2 12 9.2C13.8 9.2 15.5 9.5 17 10" />
    </svg>
  )
}

export function PadelIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Authentic Padel racket head (perforated solid composite) */}
      <rect
        x="6"
        y="3"
        width="12"
        height="13"
        rx="6"
      />
      {/* Throat & ergonomic handle */}
      <path d="M10 16L9.5 21H14.5L14 16" />
      <line x1="9.5" y1="18.5" x2="14.5" y2="18.5" />
      {/* Signature padel racket perforated circular holes pattern */}
      <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11.5" r="1" fill="currentColor" stroke="none" />
      {/* Padel ball with seam */}
      <circle cx="19" cy="18" r="2.5" />
      <path d="M17.5 16.5C18.5 17 18.5 19 17.5 19.5" strokeWidth="1.2" />
    </svg>
  )
}

export default function SportIcon({ type, className = 'w-5 h-5', ...props }) {
  const normalized = (type || '').toUpperCase()
  if (normalized.includes('FUTSAL')) {
    return <FutsalIcon className={className} {...props} />
  }
  if (normalized.includes('BADMINTON')) {
    return <BadmintonIcon className={className} {...props} />
  }
  if (normalized.includes('PADEL')) {
    return <PadelIcon className={className} {...props} />
  }
  return <FutsalIcon className={className} {...props} />
}
