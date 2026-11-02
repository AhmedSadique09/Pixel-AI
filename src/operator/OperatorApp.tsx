import { useState, type ChangeEvent, type ReactNode } from 'react'
import { LANGS, type Arrival, type Booking, type Facility, type PaymentMethod, type Question } from '../lib/types'
import { pick, yen } from '../lib/i18n'
import { useAppState, resetSampleData } from '../lib/store'
import { replaceBookings } from '../lib/actions'
import { parseBookingsCsv } from '../lib/facility'
import { DEFAULT_FACILITY_ID } from '../lib/seed'
import { FacilitySetup } from './FacilitySetup'

type Tab = 'today' | 'questions' | 'facilities'

const TABS: readonly { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'questions', label: 'Guest questions' },
  { id: 'facilities', label: 'Facilities' },
]

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: 'Card',
  paypay: 'PayPay',
  konbini: 'Konbini',
  wallet: 'Apple/Google Pay',
  prepaid: 'Prepaid',
}

const time = (ms: number) => new Date(ms).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

type Row = { key: string; name: string; plate: string; site: string; isWalkIn: boolean; isPrepaid: boolean; arrival: Arrival | null }

function buildRows(bookings: readonly Booking[], arrivals: readonly Arrival[]): Row[] {
  const fromBookings = bookings.map((b) => ({
    key: b.id,
    name: b.guestName,
    plate: b.plate,
    site: b.site,
    isWalkIn: false,
    isPrepaid: b.paid,
    arrival: arrivals.find((a) => a.bookingId === b.id) ?? null,
  }))
  const walkIns = arrivals
    .filter((a) => a.bookingId === null)
    .map((a) => ({ key: a.id, name: a.name, plate: a.plate, site: a.site, isWalkIn: true, isPrepaid: false, arrival: a }))
  return [...walkIns, ...fromBookings]
}

function Badge({ tone, children }: { tone: 'ok' | 'bad' | 'wait' | 'info'; children: ReactNode }) {
  const styles = { ok: 'bg-ok-soft text-ok', bad: 'bg-bad-soft text-bad', wait: 'bg-edge text-muted', info: 'bg-lantern-soft text-pine-900' }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[tone]}`}>{children}</span>
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-edge bg-card p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-4xl font-extrabold ${tone}`}>{value}</p>
    </div>
  )
}

function ArrivalsTable({ rows, fee }: { rows: readonly Row[]; fee: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-edge bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-edge text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Plate</th>
            <th className="px-4 py-3">Site</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Payment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="rise-in border-b border-edge/60 last:border-0">
              <td className="px-4 py-3 font-bold">
                {row.name} {row.isWalkIn && <Badge tone="info">walk-in</Badge>}
              </td>
              <td className="px-4 py-3 text-muted">{row.plate || '—'}</td>
              <td className="px-4 py-3 font-bold">{row.site}</td>
              <td className="px-4 py-3">
                {row.arrival ? (
                  <>
                    <Badge tone={row.arrival.checkedOutAt ? 'wait' : 'ok'}>{row.arrival.checkedOutAt ? 'Checked out' : 'Checked in'}</Badge>{' '}
                    <span className="text-xs text-muted">{time(row.arrival.checkedInAt)} · {LANGS.find((l) => l.code === row.arrival?.lang)?.native}</span>
                  </>
                ) : (
                  <Badge tone="wait">Not yet</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                {row.arrival?.paidAt ? (
                  <Badge tone="ok">Paid {yen(row.arrival.amountPaid)} · {METHOD_LABEL[row.arrival.paymentMethod ?? 'prepaid']}</Badge>
                ) : row.arrival ? (
                  <Badge tone="bad">Unpaid {yen(fee)}</Badge>
                ) : (
                  <Badge tone="wait">{row.isPrepaid ? 'Prepaid' : 'Due on arrival'}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LinePhone({ alerts }: { alerts: readonly Question[] }) {
  return (
    <aside className="overflow-hidden rounded-[28px] border-4 border-pine-900 bg-[#8fb4d0] shadow-xl" aria-label="Operator LINE">
      <div className="flex items-center gap-2 bg-line px-4 py-3 text-white">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-line">L</span>
        <div>
          <p className="text-sm font-extrabold leading-none">PixelDrive Bot</p>
          <p className="text-[11px] opacity-90">Operator LINE</p>
        </div>
      </div>
      <ul className="min-h-56 space-y-3 p-3">
        {alerts.length === 0 && <li className="pt-16 text-center text-sm font-semibold text-pine-900/70">No alerts yet</li>}
        {[...alerts].reverse().map((alert) => (
          <li key={alert.id} className="rise-in max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm shadow">
            <p className="text-xs font-bold text-bad">⚠ Guide could not answer</p>
            <p className="mt-0.5"><b>{alert.guestName}</b> asked:</p>
            <p className="mt-0.5 italic">“{alert.text}”</p>
            <p className="mt-1 text-right text-[11px] text-muted">{time(alert.escalatedAt ?? alert.at)}</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function QuestionsTable({ questions }: { questions: readonly Question[] }) {
  if (questions.length === 0) return <p className="rounded-2xl border border-edge bg-card p-8 text-center text-muted">No questions yet. They appear here live as guests ask.</p>
  return (
    <div className="overflow-x-auto rounded-2xl border border-edge bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-edge text-xs uppercase tracking-wider text-muted">
          <tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Guest</th><th className="px-4 py-3">Question</th><th className="px-4 py-3">Result</th></tr>
        </thead>
        <tbody>
          {[...questions].reverse().map((q) => (
            <tr key={q.id} className="rise-in border-b border-edge/60 last:border-0">
              <td className="px-4 py-3 text-muted">{time(q.at)}</td>
              <td className="px-4 py-3 font-bold">{q.guestName} <span className="text-xs font-semibold text-muted">{q.lang.toUpperCase()}</span></td>
              <td className="px-4 py-3">{q.text}</td>
              <td className="px-4 py-3">
                {q.answered ? <Badge tone="ok">Answered</Badge> : q.escalatedAt ? <Badge tone="info">Sent to LINE</Badge> : <Badge tone="bad">Needs a document</Badge>}
                {q.source && <p className="mt-1 text-xs text-muted">{q.source}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Today({ facility, bookings, arrivals, questions }: { facility: Facility; bookings: readonly Booking[]; arrivals: readonly Arrival[]; questions: readonly Question[] }) {
  const rows = buildRows(bookings, arrivals)
  const paidCount = arrivals.filter((a) => a.paidAt).length

  const handleCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    replaceBookings(facility.id, parseBookingsCsv(await file.text()))
    event.target.value = ''
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Expected" value={bookings.length} tone="text-pine-900" />
        <Stat label="Checked in" value={arrivals.length} tone="text-ok" />
        <Stat label="Paid" value={paidCount} tone="text-ok" />
        <Stat label="Unpaid on site" value={arrivals.length - paidCount} tone="text-bad" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Today’s arrivals</h2>
            <label className="cursor-pointer rounded-lg border border-edge bg-card px-3 py-2 text-sm font-bold hover:border-lantern">
              Upload booking list (CSV)
              <input type="file" accept=".csv,text/csv" onChange={handleCsv} className="sr-only" />
            </label>
          </div>
          <ArrivalsTable rows={rows} fee={facility.fee} />
        </div>
        <LinePhone alerts={questions.filter((q) => q.escalatedAt !== null)} />
      </div>
    </div>
  )
}

export function OperatorApp() {
  const state = useAppState()
  const [tab, setTab] = useState<Tab>('today')
  const [selectedId, setSelectedId] = useState(DEFAULT_FACILITY_ID)
  const facility = state.facilities.find((f) => f.id === selectedId) ?? state.facilities[0]
  const arrivals = state.arrivals.filter((a) => a.facilityId === facility.id)
  const questions = state.questions.filter((q) => q.facilityId === facility.id)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
      <nav className="bg-pine-900 p-4 text-pine-100 lg:min-h-screen" aria-label="Operator">
        <p className="px-2 pb-4 text-lg font-extrabold text-white">PixelDrive <span className="text-lantern">Ops</span></p>
        <ul className="flex gap-1 lg:flex-col">
          {TABS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold ${tab === item.id ? 'bg-pine-700 text-white' : 'hover:bg-pine-800'}`}
              >
                {item.label}
                {item.id === 'questions' && questions.length > 0 && <span className="rounded-full bg-lantern-700 px-2 text-xs text-white">{questions.length}</span>}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={resetSampleData} className="mt-6 w-full rounded-lg border border-pine-700 px-3 py-2 text-xs font-bold hover:bg-pine-800">Reset data</button>
      </nav>
      <main className="p-4 sm:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{pick(facility.name, 'en')}</h1>
            <p className="flex items-center gap-2 text-sm text-muted"><span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" /> Live · updates as guests check in</p>
          </div>
          <select value={facility.id} onChange={(e) => setSelectedId(e.target.value)} aria-label="Facility" className="rounded-lg border border-edge bg-card px-3 py-2 text-sm font-bold">
            {state.facilities.map((f) => <option key={f.id} value={f.id}>{pick(f.name, 'en')}</option>)}
          </select>
        </header>
        {tab === 'today' && <Today facility={facility} bookings={state.bookings[facility.id] ?? []} arrivals={arrivals} questions={questions} />}
        {tab === 'questions' && <QuestionsTable questions={questions} />}
        {tab === 'facilities' && <FacilitySetup facilities={state.facilities} />}
      </main>
    </div>
  )
}
