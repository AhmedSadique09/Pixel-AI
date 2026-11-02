import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Arrival, Facility, Lang } from '../lib/types'
import { pick, t, yen } from '../lib/i18n'
import { answerQuestion } from '../lib/guide'
import { escalateQuestion, logQuestion } from '../lib/actions'

type Message = {
  id: string
  from: 'guest' | 'guide'
  text: string
  source: string | null
  questionId: string | null
  isEscalated: boolean
  isUnanswered: boolean
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

type ChatPanelProps = {
  facility: Facility
  arrival: Arrival
  lang: Lang
  isOpen: boolean
  onClose: () => void
}

function GuideChatPanel({ facility, arrival, lang, isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 300)
    return () => window.clearTimeout(id)
  }, [isOpen])

  const ask = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const answer = answerQuestion(facility, trimmed, lang)
    const question = logQuestion({
      facilityId: facility.id,
      arrivalId: arrival.id,
      guestName: arrival.name,
      text: trimmed,
      lang,
      source: answer?.source ?? null,
    })
    const guestMessage: Message = { id: `${question.id}-g`, from: 'guest', text: trimmed, source: null, questionId: null, isEscalated: false, isUnanswered: false }
    const guideMessage: Message = {
      id: `${question.id}-a`,
      from: 'guide',
      text: answer?.text ?? t(lang, 'noAnswer'),
      source: answer?.source ?? null,
      questionId: question.id,
      isEscalated: false,
      isUnanswered: answer === null,
    }
    setMessages((current) => [...current, guestMessage, guideMessage])
    setDraft('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    ask(draft)
  }

  const handleEscalate = (message: Message) => {
    if (!message.questionId) return
    escalateQuestion(message.questionId)
    setMessages((current) => current.map((m) => (m.id === message.id ? { ...m, isEscalated: true } : m)))
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t(lang, 'close')}
        onClick={onClose}
        className={`chat-backdrop absolute inset-0 bg-ink/50 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'guideTitle')}
        className={`chat-panel absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-start justify-between gap-3 bg-pine-900 px-4 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lantern">{t(lang, 'guideTitle')}</p>
            <p className="mt-1 text-xs text-pine-100">{t(lang, 'guideIntro')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(lang, 'close')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-pine-700 text-white transition hover:bg-pine-800"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <ol className="space-y-3" aria-live="polite">
            {messages.map((message) => (
              <li key={message.id} className={`rise-in flex ${message.from === 'guest' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.from === 'guest' ? 'rounded-br-sm bg-pine-700 text-white' : 'rounded-bl-sm border border-edge bg-card'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.source && (
                    <p className="mt-2 rounded-md bg-lantern-soft px-2 py-1 text-xs font-semibold text-pine-900">
                      {t(lang, 'source')}: {message.source}
                    </p>
                  )}
                  {message.isUnanswered && (
                    <div className="mt-3">
                      {message.isEscalated ? (
                        <p className="rounded-md bg-line/15 px-2 py-1.5 text-xs font-semibold text-pine-900">✓ {t(lang, 'operatorPinged')}</p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEscalate(message)}
                          className="w-full rounded-lg bg-line px-3 py-2 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98]"
                        >
                          {t(lang, 'askOperator')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {messages.length === 0 && facility.suggestions.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{t(lang, 'tryAsking')}</p>
              <div className="flex flex-wrap gap-2">
                {facility.suggestions.map((suggestion) => {
                  const label = pick(suggestion, lang)
                  return (
                    <button
                      key={suggestion.en}
                      type="button"
                      onClick={() => ask(label)}
                      className="rounded-full border border-edge bg-card px-3 py-2 text-left text-sm font-medium transition hover:border-lantern hover:bg-lantern-soft"
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-edge bg-card p-3">
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t(lang, 'askPlaceholder')}
            aria-label={t(lang, 'askPlaceholder')}
            className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 outline-none"
          />
          <button type="submit" className="rounded-xl bg-lantern-700 px-4 py-2 font-bold text-white transition hover:brightness-110 active:scale-95">
            {t(lang, 'send')}
          </button>
        </form>
      </div>
    </div>
  )
}

type Props = {
  facility: Facility
  arrival: Arrival
  lang: Lang
  onCheckOut: () => void
}

const CHAT_TRANSITION_MS = 300

export function GuideStep({ facility, arrival, lang, onCheckOut }: Props) {
  const [isPanelMounted, setIsPanelMounted] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

  const openChat = () => {
    window.clearTimeout(closeTimerRef.current)
    setIsPanelMounted(true)
    requestAnimationFrame(() => setIsPanelOpen(true))
  }

  const closeChat = () => {
    setIsPanelOpen(false)
    closeTimerRef.current = window.setTimeout(() => {
      setIsPanelMounted(false)
      launcherRef.current?.focus()
    }, CHAT_TRANSITION_MS)
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-ok-soft p-4 text-pine-900">
        <p className="flex items-center gap-2 text-sm font-bold">
          <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" />
          {t(lang, 'allSet')} · {t(lang, 'yourSite')} {arrival.site}
        </p>
        <p className="mt-1 text-xs text-pine-700">
          {t(lang, 'paid')} {yen(arrival.amountPaid)}
        </p>
        <button
          type="button"
          onClick={onCheckOut}
          className="mt-3 w-full rounded-lg border border-pine-700/30 bg-card px-3 py-2 text-sm font-bold text-pine-900 transition hover:bg-paper active:scale-[0.98]"
        >
          {t(lang, 'checkOutButton')}
        </button>
      </div>

      {createPortal(
        <>
          <button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-haspopup="dialog"
            aria-expanded={isPanelOpen}
            aria-label={t(lang, 'chatLauncher')}
            className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-lantern-700 text-white shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <ChatIcon />
          </button>
          {isPanelMounted && <GuideChatPanel facility={facility} arrival={arrival} lang={lang} isOpen={isPanelOpen} onClose={closeChat} />}
        </>,
        document.body,
      )}
    </section>
  )
}
