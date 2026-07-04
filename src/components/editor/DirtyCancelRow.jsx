import { Button } from '@/components/ui/button'

export function DirtyCancelRow({ show, onDiscard, onDismiss, dark }) {
  if (!show) return null
  return (
    <>
      <span className={`text-[10px] ${dark ? 'text-yellow-300' : 'text-yellow-600'}`}>
        Nem mentett módosítások elvesznek.
      </span>
      <Button
        onClick={onDiscard}
        variant={dark ? 'ghost' : 'outline'}
        size="sm"
        className={`text-xs h-7 ${dark
          ? 'border border-red-400/50 text-red-300 hover:bg-red-500/20'
          : 'border-red-300 text-red-600 hover:bg-red-50'
        }`}
      >
        Elvetés
      </Button>
      <Button
        onClick={onDismiss}
        variant={dark ? 'ghost' : 'outline'}
        size="sm"
        className={`text-xs h-7 ${dark
          ? 'border border-white/30 text-white hover:bg-white/10'
          : ''
        }`}
      >
        Vissza
      </Button>
    </>
  )
}
