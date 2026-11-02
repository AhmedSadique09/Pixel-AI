export type Lang = 'ja' | 'en' | 'zh' | 'ko'

export const LANGS: readonly { code: Lang; label: string; native: string }[] = [
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ko', label: 'Korean', native: '한국어' },
]

export type Localized = Record<Lang, string>

export interface FaqEntry {
  id: string
  /** lowercase keywords in any language; a hit on any of them selects this entry */
  keywords: readonly string[]
  answer: Localized
  /** the facility document section the answer comes from */
  source: string
}

export interface DocChunk {
  id: string
  title: string
  text: string
}

export interface Facility {
  id: string
  name: Localized
  fee: number
  sites: readonly string[]
  rules: readonly Localized[]
  faq: readonly FaqEntry[]
  docName: string
  docs: readonly DocChunk[]
  suggestions: readonly Localized[]
  createdAt: number
  isCustom: boolean
}

export interface Booking {
  id: string
  guestName: string
  alias: string
  plate: string
  site: string
  paid: boolean
  nights: number
  guests: number
}

export type PaymentMethod = 'card' | 'paypay' | 'konbini' | 'wallet' | 'prepaid'

export interface Arrival {
  id: string
  facilityId: string
  bookingId: string | null
  name: string
  plate: string
  site: string
  lang: Lang
  walkIn: boolean
  checkedInAt: number
  rulesAcceptedAt: number | null
  paidAt: number | null
  amountPaid: number
  paymentMethod: PaymentMethod | null
  receiptNo: string | null
  /** set when the guest leaves the payment/receipt screen, which moves them on to the guide */
  paymentStepDoneAt: number | null
  /** set when the guest checks out; frees their site for a new arrival */
  checkedOutAt: number | null
}

export interface Question {
  id: string
  facilityId: string
  arrivalId: string | null
  guestName: string
  text: string
  lang: Lang
  at: number
  answered: boolean
  source: string | null
  escalatedAt: number | null
}

export interface AppState {
  version: number
  facilities: readonly Facility[]
  bookings: Readonly<Record<string, readonly Booking[]>>
  arrivals: readonly Arrival[]
  questions: readonly Question[]
}
