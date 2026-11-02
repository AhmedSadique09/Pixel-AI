import { useState, type ReactNode } from 'react'
import type { Arrival, Facility, Lang, PaymentMethod } from '../lib/types'
import { pick, t, yen, type MessageKey } from '../lib/i18n'
import { completePaymentStep, markPaid } from '../lib/actions'
import { CardFlow, KonbiniFlow, PayPayFlow, WalletFlow, type FlowProps } from './PaymentMethods'

const CONSUMPTION_TAX_RATE = 0.1

type MethodId = Exclude<PaymentMethod, 'prepaid'>

const METHODS: readonly { id: MethodId; label: MessageKey; icon: string; Flow: (props: FlowProps) => ReactNode }[] = [
  { id: 'card', label: 'methodCard', icon: '💳', Flow: CardFlow },
  { id: 'paypay', label: 'methodPayPay', icon: '📲', Flow: PayPayFlow },
  { id: 'konbini', label: 'methodKonbini', icon: '🏪', Flow: KonbiniFlow },
  { id: 'wallet', label: 'methodWallet', icon: '📱', Flow: WalletFlow },
]

/** Tax contained in a tax-inclusive price (Japanese prices are shown 税込). */
const taxIncluded = (amount: number) => Math.round(amount - amount / (1 + CONSUMPTION_TAX_RATE))

type Props = { facility: Facility; arrival: Arrival; lang: Lang }

function Receipt({ facility, arrival, lang }: Props) {
  const method = METHODS.find((m) => m.id === arrival.paymentMethod)
  const rows: [string, string][] = [
    [t(lang, 'payMethods'), method ? t(lang, method.label) : t(lang, 'prepaidNote')],
    [t(lang, 'yourSite'), arrival.site],
  ]
  if (arrival.receiptNo) rows.push([t(lang, 'receiptNo'), arrival.receiptNo])

  return (
    <section className="space-y-4">
      <div className="rise-in rounded-2xl bg-ok-soft p-6 text-center text-pine-900">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok text-3xl text-white" aria-hidden="true">
          ✓
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t(lang, 'receiptTitle')}</h2>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">{yen(arrival.amountPaid)}</p>
        <p className="text-xs font-semibold text-pine-700">
          {t(lang, 'taxIncluded')} {t(lang, 'taxNote', { tax: yen(taxIncluded(arrival.amountPaid)) })}
        </p>
      </div>
      <dl className="divide-y divide-edge rounded-2xl border border-edge bg-card text-sm">
        <div className="px-4 py-3 font-bold">{pick(facility.name, lang)}</div>
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 px-4 py-3">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={() => completePaymentStep(arrival.id)}
        className="w-full rounded-xl bg-lantern-700 px-4 py-3.5 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
      >
        {t(lang, 'toGuide')}
      </button>
    </section>
  )
}

export function PaymentStep({ facility, arrival, lang }: Props) {
  const [selected, setSelected] = useState<MethodId>('card')

  if (arrival.paidAt) return <Receipt facility={facility} arrival={arrival} lang={lang} />

  const active = METHODS.find((m) => m.id === selected) ?? METHODS[0]
  const handlePaid = (method: PaymentMethod) => markPaid(arrival.id, facility.fee, method)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{t(lang, 'payTitle')}</h2>
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <p className="text-sm text-pine-100">
          {pick(facility.name, lang)} · {arrival.site}
        </p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">
          {yen(facility.fee)} <span className="text-base font-bold text-pine-100">{t(lang, 'taxIncluded')}</span>
        </p>
        <p className="text-xs text-pine-100">{t(lang, 'taxNote', { tax: yen(taxIncluded(facility.fee)) })}</p>
      </div>

      <h3 className="text-sm font-bold uppercase tracking-wider text-muted">{t(lang, 'payMethods')}</h3>
      <div className="grid grid-cols-2 gap-2">
        {METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelected(method.id)}
            aria-pressed={method.id === active.id}
            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left text-sm font-bold transition ${
              method.id === active.id ? 'border-lantern bg-lantern-soft' : 'border-edge bg-card hover:border-lantern/60'
            }`}
          >
            <span aria-hidden="true" className="text-lg">
              {method.icon}
            </span>
            {t(lang, method.label)}
          </button>
        ))}
      </div>

      <active.Flow key={active.id} lang={lang} amount={facility.fee} merchant={pick(facility.name, lang)} onPaid={handlePaid} />
    </section>
  )
}
