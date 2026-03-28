import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1.5} />
        <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-glow" />
      </div>
      <p className="text-xl font-medium tracking-wider text-foreground/80 animate-fade-in-up">
        Yuklanmoqda...
      </p>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
