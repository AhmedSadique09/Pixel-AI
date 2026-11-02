import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { LANGS, type Arrival, type Facility, type Lang } from '../lib/types'
import { pick, t } from '../lib/i18n'
import { useAppState } from '../lib/store'
import { acceptRules, checkOut } from '../lib/actions'
import { occupiedSites } from '../lib/match'
import { SiteMap } from './SiteMap'
import { GuideStep } from './GuideStep'
import { PaymentStep } from './PaymentStep'
import { LanguageSwitcher } from './LanguageSwitcher'
import { StepIndicator } from './StepIndicator'
import { WelcomeStep } from './WelcomeStep'
import { CheckinStep } from './CheckinStep'

/** A `?lang=ja` in the link (from the landing page) pre-selects the language. Every page load starts fresh — no step is remembered across a refresh. */
function readLang(fromLink: string | null): Lang | null {
  return LANGS.find((l) => l.code === fromLink)?.code ?? null
}

const primaryButton =
  'w-full rounded-xl bg-lantern-700 px-4 py-3.5 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

type ShellProps = {
  facility: Facility
  lang: Lang | null
  stepIndex: number
  onLangChange: (lang: Lang) => void
  children: ReactNode
}

function Shell({ facility, lang, stepIndex, onLangChange, children }: ShellProps) {
  const activeLang = lang ?? 'en'
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8">
      {lang && <LanguageSwitcher lang={lang} onChange={onLangChange} />}
      <header className="mb-6 pt-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lantern-700">PixelDrive</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight text-ink">{pick(facility.name, activeLang)}</h1>
        </div>
        {lang && stepIndex > 0 && <StepIndicator lang={lang} stepIndex={stepIndex} />}
      </header>
      <div className="rise-in flex-1">{children}</div>
    </main>
  )
}

type StepProps = { facility: Facility; arrival: Arrival; lang: Lang }

function RulesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  )
}

function RulesStep({ facility, arrival, lang }: StepProps) {
  const state = useAppState()
  const [isAgreed, setIsAgreed] = useState(false)
  const taken = occupiedSites(state.bookings[facility.id] ?? [], state.arrivals.filter((a) => a.facilityId === facility.id))
  taken.delete(arrival.site)

  return (
    <section className="space-y-4 pb-28">
      <div className="rounded-2xl border border-edge bg-card p-4">
        <h2 className="text-xl font-bold">{t(lang, 'hello', { name: arrival.name })}</h2>
        <p className="mt-1 text-sm font-semibold text-muted">
          {t(lang, 'yourSite')}: <span className="rounded-md bg-lantern-700 px-2 py-0.5 font-bold text-white">{arrival.site}</span>
        </p>
        <div className="mt-4">
          <SiteMap sites={facility.sites} mine={arrival.site} taken={taken} lang={lang} />
        </div>
      </div>

      <div className="rounded-2xl border border-edge bg-card p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted">
          <RulesIcon />
          {t(lang, 'rulesTitle')}
        </h3>
        <ul className="mt-3 space-y-2">
          {facility.rules.map((rule, index) => (
            <li key={rule.en} className="flex gap-3 rounded-xl bg-paper px-3 py-2.5 text-sm leading-relaxed">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lantern-soft text-[11px] font-bold text-pine-700">
                {index + 1}
              </span>
              <span>{pick(rule, lang)}</span>
            </li>
          ))}
        </ul>
      </div>

      {createPortal(
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-edge bg-paper/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto max-w-md space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-lantern-soft p-3 text-sm font-semibold">
              <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 accent-lantern" />
              {t(lang, 'rulesConfirm')}
            </label>
            <button type="button" disabled={!isAgreed} onClick={() => acceptRules(arrival.id)} className={primaryButton}>
              {t(lang, 'continue')}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}

function CheckedOutStep({ lang }: { lang: Lang }) {
  return (
    <section className="rise-in space-y-4 text-center">
      <div className="rounded-2xl bg-ok-soft p-6 text-pine-900">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok text-3xl text-white" aria-hidden="true">
          ✓
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t(lang, 'checkedOutTitle')}</h2>
        <p className="mt-1 text-sm text-pine-700">{t(lang, 'checkedOutHint')}</p>
      </div>
    </section>
  )
}

function stepIndexFor(lang: Lang | null, arrival: Arrival | null): number {
  if (!lang) return 0
  if (!arrival) return 1
  if (!arrival.rulesAcceptedAt) return 2
  if (!arrival.paymentStepDoneAt) return 3
  return 4
}

export function GuestApp({ facilityId }: { facilityId: string }) {
  const state = useAppState()
  const facility = state.facilities.find((f) => f.id === facilityId)
  const [searchParams] = useSearchParams()
  const [lang, setLang] = useState<Lang | null>(() => readLang(searchParams.get('lang')))
  const [arrivalId, setArrivalId] = useState<string | null>(null)

  if (!facility) {
    return <p className="p-8 text-center font-semibold">Facility not found.</p>
  }

  const arrival = state.arrivals.find((a) => a.id === arrivalId) ?? null
  const stepIndex = stepIndexFor(lang, arrival)

  const handleLang = (next: Lang) => {
    setLang(next)
  }

  const handleArrival = (next: Arrival) => {
    setArrivalId(next.id)
  }

  if (!lang) {
    return <WelcomeStep facility={facility} onPick={handleLang} />
  }

  if (!arrival) {
    return <CheckinStep facility={facility} lang={lang} onDone={handleArrival} onBack={() => setLang(null)} onLangChange={handleLang} />
  }

  const renderStep = (): ReactNode => {
    if (!arrival.rulesAcceptedAt) return <RulesStep facility={facility} arrival={arrival} lang={lang} />
    if (!arrival.paymentStepDoneAt) return <PaymentStep facility={facility} arrival={arrival} lang={lang} />
    if (arrival.checkedOutAt) return <CheckedOutStep lang={lang} />
    return <GuideStep facility={facility} arrival={arrival} lang={lang} onCheckOut={() => checkOut(arrival.id)} />
  }

  return (
    <Shell facility={facility} lang={lang} stepIndex={stepIndex} onLangChange={handleLang}>
      {renderStep()}
    </Shell>
  )
}
