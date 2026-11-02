import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './admin.css'

type Tab = 'arrivals' | 'questions' | 'facilities'

interface ArrivalRow {
  guest: string
  plate: string
  site: string
  checkedIn: boolean
  paid: boolean
}

interface QuestionRow {
  question: string
  lang: string
  answered: boolean
  escalatedToLine: boolean
}

interface FacilityRow {
  name: string
  status: 'live' | 'draft'
}

/** Static demo data matching the single seeded booking used across the guest flow (no backend yet). */
const ARRIVALS: ArrivalRow[] = [{ guest: '山田 太郎', plate: '品川 300 あ 12-34', site: 'B-07', checkedIn: true, paid: true }]

/** The two sample questions from the project's own demo script. */
const QUESTIONS: QuestionRow[] = [
  { question: '発電機は何時まで使える？', lang: 'JA', answered: true, escalatedToLine: false },
  { question: '近くの温泉は何時まで？', lang: 'JA', answered: true, escalatedToLine: false },
]

const FACILITIES: FacilityRow[] = [{ name: 'デモRVパーク', status: 'live' }]

const TABS: { id: Tab; label: string }[] = [
  { id: 'arrivals', label: "Today's arrivals" },
  { id: 'questions', label: 'Guest questions' },
  { id: 'facilities', label: 'Facilities' },
]

function ArrivalsPanel() {
  const checkedInCount = ARRIVALS.filter((a) => a.checkedIn).length
  const unpaidCount = ARRIVALS.filter((a) => !a.paid).length
  return (
    <div className="admin__panel">
      <div className="admin__stats">
        <div className="admin__stat">
          <p className="admin__stat-value">{ARRIVALS.length}</p>
          <p className="admin__stat-label">Arrivals today</p>
        </div>
        <div className="admin__stat">
          <p className="admin__stat-value">{checkedInCount}</p>
          <p className="admin__stat-label">Checked in</p>
        </div>
        <div className="admin__stat admin__stat--warn">
          <p className="admin__stat-value">{unpaidCount}</p>
          <p className="admin__stat-label">Unpaid</p>
        </div>
      </div>
      <table className="admin__table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Plate</th>
            <th>Site</th>
            <th>Check-in</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {ARRIVALS.map((row) => (
            <tr key={row.plate}>
              <td>{row.guest}</td>
              <td>{row.plate}</td>
              <td>{row.site}</td>
              <td>
                <span className={`admin__badge ${row.checkedIn ? 'admin__badge--ok' : 'admin__badge--wait'}`}>
                  {row.checkedIn ? 'Checked in' : 'Not yet'}
                </span>
              </td>
              <td>
                <span className={`admin__badge ${row.paid ? 'admin__badge--ok' : 'admin__badge--bad'}`}>{row.paid ? 'Paid' : 'Unpaid'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function QuestionsPanel() {
  return (
    <div className="admin__panel">
      <p className="admin__hint">Questions guests asked the AI guide, so the guide can be improved. Unanswered questions ping the operator on LINE.</p>
      <ul className="admin__questions">
        {QUESTIONS.map((q) => (
          <li key={q.question} className="admin__question">
            <div className="admin__question-text">
              <span className="admin__question-lang">{q.lang}</span>
              {q.question}
            </div>
            <span className={`admin__badge ${q.answered ? 'admin__badge--ok' : 'admin__badge--bad'}`}>
              {q.answered ? 'Answered' : 'Escalated to LINE'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FacilitiesPanel() {
  return (
    <div className="admin__panel">
      <p className="admin__hint">Each facility is a config plus its documents — add a new facility without development.</p>
      <ul className="admin__facilities">
        {FACILITIES.map((f) => (
          <li key={f.name} className="admin__facility">
            <span>{f.name}</span>
            <span className={`admin__badge ${f.status === 'live' ? 'admin__badge--ok' : 'admin__badge--wait'}`}>{f.status === 'live' ? 'Live' : 'Draft'}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary admin__add-facility">
        + Add facility
      </button>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('arrivals')

  return (
    <main className="admin">
      <nav className="admin__sidebar" aria-label="Admin sections">
        <h1 className="admin__title">Admin panel</h1>
        <div className="admin__sidebar-nav">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`admin__tab ${tab === id ? 'admin__tab--active' : ''}`}
              aria-current={tab === id ? 'page' : undefined}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="admin__back" onClick={() => navigate('/')}>
          Guest view
        </button>
      </nav>

      <div className="admin__content">
        {tab === 'arrivals' && <ArrivalsPanel />}
        {tab === 'questions' && <QuestionsPanel />}
        {tab === 'facilities' && <FacilitiesPanel />}
      </div>
    </main>
  )
}
