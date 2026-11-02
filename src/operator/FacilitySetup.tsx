import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Facility } from '../lib/types'
import { pick } from '../lib/i18n'
import { addFacility } from '../lib/actions'
import { buildFacility, guestUrl } from '../lib/facility'
import { SAMPLE_RULES_TEXT } from '../lib/seed'
import { QrImage } from '../components/QrImage'

const DEFAULT_FEE = 3000
const DEFAULT_SITES = 10
const MS_PER_SECOND = 1000

type Props = {
  facilities: readonly Facility[]
}

type Created = { facility: Facility; seconds: number }

const fieldClass = 'w-full rounded-lg border border-edge bg-white px-3 py-2 outline-none focus:border-lantern'

export function FacilitySetup({ facilities }: Props) {
  const [openedAt] = useState(() => Date.now())
  const [name, setName] = useState('')
  const [fee, setFee] = useState(DEFAULT_FEE)
  const [siteCount, setSiteCount] = useState(DEFAULT_SITES)
  const [docName, setDocName] = useState('rules.txt')
  const [text, setText] = useState('')
  const [created, setCreated] = useState<Created | null>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setDocName(file.name)
    setText(await file.text())
  }

  const loadSample = () => {
    setName('Yamabiko Forest RV Park')
    setDocName('Yamabiko Rules.pdf')
    setText(SAMPLE_RULES_TEXT)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const facility = buildFacility({ name: name.trim(), fee, siteCount, docName, text }, facilities.map((f) => f.id))
    addFacility(facility, [])
    setCreated({ facility, seconds: Math.max(1, Math.round((Date.now() - openedAt) / MS_PER_SECOND)) })
  }

  const canCreate = name.trim().length >= 2 && text.trim().length >= 20

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-edge bg-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Add a facility</h2>
            <p className="text-sm text-muted">Name + rules document. That is all a new park needs.</p>
          </div>
          <button type="button" onClick={loadSample} className="shrink-0 rounded-lg bg-lantern-soft px-3 py-2 text-sm font-bold text-pine-900 hover:brightness-95">
            Load sample park
          </button>
        </div>
        <label className="block text-sm font-semibold">
          Facility name
          <input value={name} onChange={(e) => setName(e.target.value)} className={`${fieldClass} mt-1`} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold">
            Fee (¥)
            <input type="number" min={0} value={fee} onChange={(e) => setFee(Number(e.target.value))} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">
            Number of sites
            <input type="number" min={1} max={60} value={siteCount} onChange={(e) => setSiteCount(Number(e.target.value))} className={`${fieldClass} mt-1`} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Rules document (.txt / .md)
          <input type="file" accept=".txt,.md,text/plain" onChange={handleFile} className="mt-1 block w-full text-sm" />
        </label>
        <label className="block text-sm font-semibold">
          …or paste the rules text
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className={`${fieldClass} mt-1 font-mono text-xs`} />
        </label>
        <p className="text-xs text-muted">This reads plain text. PDF text extraction is part of the pilot build.</p>
        <button type="submit" disabled={!canCreate} className="w-full rounded-xl bg-pine-900 px-4 py-3 font-bold text-white transition hover:bg-pine-700 disabled:opacity-40">
          Create facility and QR code
        </button>
      </form>

      <div className="space-y-4">
        {created && (
          <div className="rise-in rounded-2xl bg-pine-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-lantern">Live in {created.seconds} s</p>
            <h3 className="mt-1 text-2xl font-extrabold">{pick(created.facility.name, 'en')}</h3>
            <p className="mt-1 text-sm text-pine-100">{created.facility.docs.length} sections indexed · {created.facility.sites.length} sites</p>
            <div className="mt-4 flex items-center gap-4">
              <QrImage value={guestUrl(created.facility.id)} size={132} label={`QR code for ${pick(created.facility.name, 'en')}`} />
              <a href={guestUrl(created.facility.id)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-lantern-700 px-4 py-2 text-sm font-bold text-white hover:brightness-110">
                Open guest view
              </a>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-edge bg-card p-6">
          <h3 className="font-extrabold">Facilities in your network ({facilities.length})</h3>
          <ul className="mt-3 divide-y divide-edge">
            {facilities.map((facility) => (
              <li key={facility.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-bold">{pick(facility.name, 'en')}</p>
                  <p className="text-xs text-muted">{facility.docName} · {facility.sites.length} sites</p>
                </div>
                <a href={guestUrl(facility.id)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-lantern hover:underline">
                  Guest link ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
