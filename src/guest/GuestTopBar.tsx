import { useEffect, useRef, useState } from 'react'
import { LANGS, type Lang } from '../lib/types'
import chevronLeftIcon from '../assets/icons/chevron-left.svg'
import globeIcon from '../assets/icons/globe.svg'

type Props = {
  title: string
  lang: Lang
  onBack: () => void
  onLangChange: (lang: Lang) => void
}

export function GuestTopBar({ title, lang, onBack, onLangChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge bg-card transition hover:bg-paper active:scale-95"
      >
        <img src={chevronLeftIcon} alt="" className="h-5 w-5" />
      </button>
      <p className="flex-1 truncate text-center text-[17px] font-bold leading-[1.45] text-ink">{title}</p>
      <div ref={containerRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 rounded-full border border-edge bg-card px-3 py-[7px] transition hover:border-lantern-700/60"
        >
          <img src={globeIcon} alt="" className="h-4 w-4" />
          <span className="whitespace-nowrap text-xs font-medium tracking-[0.024px] text-ink">{active.native}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full z-20 mt-1.5 flex flex-col gap-1 rounded-xl border border-edge bg-card p-1.5 shadow-lg">
            {LANGS.filter((l) => l.code !== lang).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  onLangChange(l.code)
                  setIsOpen(false)
                }}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-paper"
              >
                {l.native}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
