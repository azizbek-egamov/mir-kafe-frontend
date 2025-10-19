interface CornerDecorationProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export default function CornerDecoration({ position }: CornerDecorationProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`fixed ${positionClasses[position]} w-32 h-32 md:w-48 md:h-48 pointer-events-none z-0 opacity-60`}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
        {/* Traditional Chinese/Japanese corner pattern */}
        <path d="M 0 0 L 20 0 L 20 5 L 5 5 L 5 20 L 0 20 Z" fill="currentColor" />
        <path d="M 25 0 L 45 0 L 45 5 L 30 5 L 30 20 L 25 20 Z" fill="currentColor" />
        <path d="M 50 0 L 70 0 L 70 5 L 55 5 L 55 20 L 50 20 Z" fill="currentColor" />
        <path d="M 0 25 L 20 25 L 20 30 L 5 30 L 5 45 L 0 45 Z" fill="currentColor" />
        <path d="M 25 25 L 45 25 L 45 30 L 30 30 L 30 45 L 25 45 Z" fill="currentColor" />
        <path d="M 0 50 L 20 50 L 20 55 L 5 55 L 5 70 L 0 70 Z" fill="currentColor" />
      </svg>
    </div>
  )
}
