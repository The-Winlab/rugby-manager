interface RugbyLogoProps {
  size?: number
  className?: string
}

export default function RugbyLogo({ size = 48, className }: RugbyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="80" height="80" rx="20" fill="#00D68F" />
      <line x1="18" y1="70" x2="62" y2="70" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="27" y1="70" x2="27" y2="54" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="53" y1="70" x2="53" y2="54" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="27" y1="54" x2="53" y2="54" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="27" y1="54" x2="27" y2="10" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="53" y1="54" x2="53" y2="10" stroke="#0F1923" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="40" cy="30" rx="8" ry="5.5" fill="#0F1923" transform="rotate(-15 40 30)" />
      <line x1="35.5" y1="27.5" x2="44.5" y2="32.5" stroke="#00D68F" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
