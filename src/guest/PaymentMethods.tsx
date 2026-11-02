import { useState, type FormEvent } from 'react'
import type { Lang, PaymentMethod } from '../lib/types'
import { t, yen } from '../lib/i18n'
import { QrImage } from '../components/QrImage'

const PROCESSING_DELAY_MS = 1100
const OTP_LENGTH = 6
const MAX_CARD_DIGITS = 19
const MIN_CARD_DIGITS = 13
const KONBINI_STORES = ['7-Eleven', 'Lawson', 'FamilyMart', 'Ministop'] as const

export type FlowProps = {
  lang: Lang
  amount: number
  merchant: string
  onPaid: (method: PaymentMethod) => void
}

const inputClass = 'w-full rounded-xl border border-edge bg-card px-4 py-3 text-base outline-none focus:border-lantern'
const primaryButton =
  'w-full rounded-xl bg-lantern-700 px-4 py-3.5 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

const settle = (callback: () => void) => window.setTimeout(callback, PROCESSING_DELAY_MS)
const digitsOnly = (value: string) => value.replace(/\D/g, '')

function Processing({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-edge bg-card py-10" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-edge border-t-lantern" aria-hidden="true" />
      <p className="text-sm font-semibold text-muted">{t(lang, 'processing')}</p>
    </div>
  )
}

function formatCardNumber(value: string): string {
  return digitsOnly(value).slice(0, MAX_CARD_DIGITS).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function cardBrand(number: string): string | null {
  const digits = digitsOnly(number)
  if (/^4/.test(digits)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^35/.test(digits)) return 'JCB'
  if (/^3[47]/.test(digits)) return 'AMEX'
  if (/^3[06]/.test(digits)) return 'Diners'
  return null
}

type CardFields = { number: string; expiry: string; cvc: string; name: string }

function isValidCard({ number, expiry, cvc, name }: CardFields): boolean {
  const length = digitsOnly(number).length
  const month = Number(expiry.split('/')[0])
  return (
    length >= MIN_CARD_DIGITS &&
    length <= MAX_CARD_DIGITS &&
    expiry.length === 5 &&
    month >= 1 &&
    month <= 12 &&
    /^\d{3,4}$/.test(cvc) &&
    name.trim().length >= 2
  )
}

export function CardFlow({ lang, amount, onPaid }: FlowProps) {
  const [fields, setFields] = useState<CardFields>({ number: '', expiry: '', cvc: '', name: '' })
  const [stage, setStage] = useState<'form' | 'verify' | 'processing'>('form')
  const [hasError, setHasError] = useState(false)
  const [otp, setOtp] = useState('')
  const brand = cardBrand(fields.number)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValidCard(fields)) {
      setHasError(true)
      return
    }
    setHasError(false)
    setStage('verify')
  }

  const handleVerify = (event: FormEvent) => {
    event.preventDefault()
    setStage('processing')
    settle(() => onPaid('card'))
  }

  if (stage === 'processing') return <Processing lang={lang} />

  if (stage === 'verify') {
    return (
      <form onSubmit={handleVerify} className="rise-in space-y-4 rounded-2xl border-2 border-pine-700 bg-card p-5">
        <p className="text-lg font-extrabold">🔒 {t(lang, 'threeDsTitle')}</p>
        <p className="text-sm text-muted">{t(lang, 'threeDsHint')}</p>
        <input
          value={otp}
          onChange={(event) => setOtp(digitsOnly(event.target.value).slice(0, OTP_LENGTH))}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={t(lang, 'threeDsTitle')}
          className={`${inputClass} text-center font-mono text-2xl tracking-[0.5em]`}
        />
        <button type="submit" disabled={otp.length !== OTP_LENGTH} className={primaryButton}>
          {t(lang, 'verify')} · {yen(amount)}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-edge bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">{brand ?? 'VISA · Mastercard · JCB · AMEX'}</span>
      </div>
      <label className="block text-sm font-semibold">
        {t(lang, 'cardNumber')}
        <input
          value={fields.number}
          onChange={(event) => setFields({ ...fields, number: formatCardNumber(event.target.value) })}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          className={`${inputClass} mt-1 font-mono`}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">
          {t(lang, 'expiry')}
          <input
            value={fields.expiry}
            onChange={(event) => setFields({ ...fields, expiry: formatExpiry(event.target.value) })}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            className={`${inputClass} mt-1 font-mono`}
          />
        </label>
        <label className="block text-sm font-semibold">
          {t(lang, 'cvc')}
          <input
            value={fields.cvc}
            onChange={(event) => setFields({ ...fields, cvc: digitsOnly(event.target.value).slice(0, 4) })}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            className={`${inputClass} mt-1 font-mono`}
          />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        {t(lang, 'holderName')}
        <input
          value={fields.name}
          onChange={(event) => setFields({ ...fields, name: event.target.value.toUpperCase() })}
          autoComplete="cc-name"
          placeholder="TARO TANAKA"
          className={`${inputClass} mt-1`}
        />
      </label>
      {hasError && <p className="rounded-lg bg-bad-soft px-3 py-2 text-sm font-semibold text-bad">{t(lang, 'invalidInput')}</p>}
      <button type="submit" className={primaryButton}>
        {t(lang, 'payNow', { amount: yen(amount) })}
      </button>
    </form>
  )
}

export function PayPayFlow({ lang, amount, onPaid }: FlowProps) {
  const [stage, setStage] = useState<'start' | 'scan' | 'processing'>('start')

  const handleApprove = () => {
    setStage('processing')
    settle(() => onPaid('paypay'))
  }

  if (stage === 'processing') return <Processing lang={lang} />

  if (stage === 'scan') {
    return (
      <div className="rise-in space-y-4 rounded-2xl border-2 border-[#ff0033] bg-card p-5 text-center">
        <p className="text-sm font-semibold text-muted">{t(lang, 'paypayScan')}</p>
        <div className="inline-block rounded-xl bg-white p-2">
          <QrImage value={`paypay://payment?amount=${amount}`} size={160} label="PayPay QR" />
        </div>
        <p className="text-2xl font-extrabold">{yen(amount)}</p>
        <button type="button" onClick={handleApprove} className="w-full rounded-xl bg-[#ff0033] px-4 py-3.5 text-base font-bold text-white transition hover:brightness-95 active:scale-[0.98]">
          {t(lang, 'paypayApprove')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl border border-edge bg-card p-4">
      <button type="button" onClick={() => setStage('scan')} className="w-full rounded-xl bg-[#ff0033] px-4 py-4 text-lg font-extrabold text-white shadow-md transition hover:brightness-95 active:scale-[0.98]">
        {t(lang, 'paypayStart')}
      </button>
    </div>
  )
}

function newKonbiniCode(): string {
  const digits = String(Math.floor(Math.random() * 1e11)).padStart(11, '0')
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`
}

export function KonbiniFlow({ lang, amount, onPaid }: FlowProps) {
  const [store, setStore] = useState<(typeof KONBINI_STORES)[number]>(KONBINI_STORES[0])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const canIssue = name.trim().length >= 2 && digitsOnly(phone).length >= 10

  const handleIssue = (event: FormEvent) => {
    event.preventDefault()
    setCode(newKonbiniCode())
  }

  const handlePaid = () => {
    setIsProcessing(true)
    settle(() => onPaid('konbini'))
  }

  if (isProcessing) return <Processing lang={lang} />

  if (code) {
    return (
      <div className="rise-in space-y-4 rounded-2xl border-2 border-pine-700 bg-card p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-muted">{store}</p>
        <p className="text-xs font-semibold text-muted">{t(lang, 'konbiniCode')}</p>
        <p className="font-mono text-3xl font-extrabold tracking-wider">{code}</p>
        <p className="text-lg font-extrabold">{yen(amount)}</p>
        <p className="text-sm text-muted">{t(lang, 'konbiniHint')}</p>
        <button type="button" onClick={handlePaid} className={primaryButton}>
          {t(lang, 'konbiniPaid')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleIssue} className="space-y-3 rounded-2xl border border-edge bg-card p-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t(lang, 'konbiniStore')}</legend>
        <div className="grid grid-cols-2 gap-2">
          {KONBINI_STORES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStore(option)}
              aria-pressed={store === option}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${store === option ? 'border-lantern bg-lantern-soft' : 'border-edge bg-paper'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t(lang, 'yourName')} aria-label={t(lang, 'yourName')} className={inputClass} />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        inputMode="tel"
        placeholder="090-1234-5678"
        aria-label={t(lang, 'phoneNumber')}
        className={`${inputClass} font-mono`}
      />
      <button type="submit" disabled={!canIssue} className={primaryButton}>
        {t(lang, 'konbiniIssue')}
      </button>
    </form>
  )
}

type Wallet = 'Apple Pay' | 'Google Pay'

export function WalletFlow({ lang, amount, merchant, onPaid }: FlowProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = () => {
    setIsProcessing(true)
    settle(() => onPaid('wallet'))
  }

  if (isProcessing) return <Processing lang={lang} />

  if (wallet) {
    return (
      <div className="rise-in space-y-4 rounded-2xl border-2 border-ink bg-card p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-muted">{wallet}</p>
        <p className="font-semibold">{merchant}</p>
        <p className="text-3xl font-extrabold">{yen(amount)}</p>
        <button type="button" onClick={handleConfirm} className="w-full rounded-xl bg-ink px-4 py-3.5 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.98]">
          {t(lang, 'walletConfirm')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl border border-edge bg-card p-4">
      <button type="button" onClick={() => setWallet('Apple Pay')} className="w-full rounded-xl bg-black px-4 py-3.5 text-lg font-bold text-white transition hover:brightness-125 active:scale-[0.98]">
        Apple Pay
      </button>
      <button type="button" onClick={() => setWallet('Google Pay')} className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3.5 text-lg font-bold text-ink transition hover:bg-paper active:scale-[0.98]">
        Google Pay
      </button>
    </div>
  )
}
