import type { Arrival, Booking, Facility, Lang, PaymentMethod, Question } from './types'
import { update } from './store'

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export interface CheckInInput {
  facilityId: string
  bookingId: string | null
  name: string
  plate: string
  site: string
  lang: Lang
  /** true when the booking was already paid before arrival */
  prepaid: boolean
  fee: number
}

export function checkIn(input: CheckInInput): Arrival {
  const now = Date.now()
  const arrival: Arrival = {
    id: newId('arr'),
    facilityId: input.facilityId,
    bookingId: input.bookingId,
    name: input.name,
    plate: input.plate,
    site: input.site,
    lang: input.lang,
    walkIn: input.bookingId === null,
    checkedInAt: now,
    rulesAcceptedAt: null,
    paidAt: input.prepaid ? now : null,
    amountPaid: input.prepaid ? input.fee : 0,
    paymentMethod: input.prepaid ? 'prepaid' : null,
    receiptNo: null,
    paymentStepDoneAt: null,
    checkedOutAt: null,
  }
  update((s) => ({ ...s, arrivals: [...s.arrivals, arrival] }))
  return arrival
}

function patchArrival(arrivalId: string, patch: Partial<Arrival>): void {
  update((s) => ({
    ...s,
    arrivals: s.arrivals.map((a) => (a.id === arrivalId ? { ...a, ...patch } : a)),
  }))
}

export function acceptRules(arrivalId: string): void {
  patchArrival(arrivalId, { rulesAcceptedAt: Date.now() })
}

export function markPaid(arrivalId: string, amount: number, method: PaymentMethod): void {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const receiptNo = `PD-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`
  patchArrival(arrivalId, { paidAt: Date.now(), amountPaid: amount, paymentMethod: method, receiptNo })
}

/** Guest pressed "continue" on the receipt: show the guide next. */
export function completePaymentStep(arrivalId: string): void {
  patchArrival(arrivalId, { paymentStepDoneAt: Date.now() })
}

/** Guest pressed "check out": frees their site for a new arrival. */
export function checkOut(arrivalId: string): void {
  patchArrival(arrivalId, { checkedOutAt: Date.now() })
}

export interface QuestionInput {
  facilityId: string
  arrivalId: string | null
  guestName: string
  text: string
  lang: Lang
  source: string | null
}

export function logQuestion(input: QuestionInput): Question {
  const question: Question = {
    id: newId('q'),
    ...input,
    at: Date.now(),
    answered: input.source !== null,
    escalatedAt: null,
  }
  update((s) => ({ ...s, questions: [...s.questions, question] }))
  return question
}

/** Guest pressed "ask the operator": the dashboard shows it as a LINE message. */
export function escalateQuestion(questionId: string): void {
  update((s) => ({
    ...s,
    questions: s.questions.map((q) => (q.id === questionId ? { ...q, escalatedAt: Date.now() } : q)),
  }))
}

export function addFacility(facility: Facility, bookings: readonly Booking[]): void {
  update((s) => ({
    ...s,
    facilities: [...s.facilities, facility],
    bookings: { ...s.bookings, [facility.id]: bookings },
  }))
}

export function replaceBookings(facilityId: string, bookings: readonly Booking[]): void {
  update((s) => ({ ...s, bookings: { ...s.bookings, [facilityId]: bookings } }))
}
