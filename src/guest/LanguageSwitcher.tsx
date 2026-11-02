import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LANGS, type Lang } from '../lib/types'

type Props = {
  lang: Lang
  onChange: (lang: Lang) => void
}

/** Floating language pill, top-right of the screen. Shows only the active language; hover or tap reveals the rest. */
export function LanguageSwitcher({ lang, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0]
  const others = LANGS.filter((l) => l.code !== lang)

  const select = (next: Lang) => {
    onChange(next)
    setIsOpen(false)
  }

  return createPortal(
    <div
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      className="fixed right-4 top-4 z-50 flex flex-col items-end gap-1.5"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="rounded-full bg-lantern-700 px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
      >
        {active.code.toUpperCase()}
      </button>
      <div
        className={`flex flex-col items-end gap-1.5 transition-all duration-150 ${
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {others.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => select(l.code)}
            tabIndex={isOpen ? 0 : -1}
            className="rounded-full bg-pine-700 px-3 py-1.5 text-xs font-bold text-pine-100 shadow-md transition hover:bg-pine-800 hover:text-white active:scale-95"
          >
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
