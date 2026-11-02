import { useState, type FormEvent } from 'react'
import type { Arrival, Booking, Facility, Lang } from '../lib/types'
import { pick, t, yen, stayDates } from '../lib/i18n'
import { useAppState } from '../lib/store'
import { checkIn } from '../lib/actions'
import { findBooking, nextFreeSite, occupiedSites } from '../lib/match'
import { GuestTopBar } from './GuestTopBar'
import { GuestStepper } from './GuestStepper'
import { PlateFields, JapanesePlatePreview } from './PlateFields'
import { plateQuery, EMPTY_PLATE, type PlateValue } from '../lib/plate'
import searchIcon from '../assets/icons/search.svg'
import searchXIcon from '../assets/icons/search-x.svg'
import infoIcon from '../assets/icons/info.svg'
import bulletIcon from '../assets/icons/bullet.svg'
import pencilIcon from '../assets/icons/pencil.svg'
import userIcon from '../assets/icons/user.svg'
import userFilledIcon from '../assets/icons/user-filled.svg'
import checkFilledIcon from '../assets/icons/check-filled.svg'
import tentIcon from '../assets/icons/tent.svg'
import messageIcon from '../assets/icons/message.svg'
import arrowRightIcon from '../assets/icons/arrow-right.svg'
import chevronRightDarkIcon from '../assets/icons/chevron-right-dark.svg'
import circleCheckIcon from '../assets/icons/circle-check.svg'
import userAvatarIcon from '../assets/icons/user-avatar.svg'
import carIcon from '../assets/icons/car.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import zapIcon from '../assets/icons/zap.svg'
import usersIcon from '../assets/icons/users.svg'
import yenIcon from '../assets/icons/yen.svg'

type View = 'plate' | 'found' | 'notFound' | 'name' | 'walkIn'

type Props = {
  facility: Facility
  lang: Lang
  onDone: (arrival: Arrival) => void
  onBack: () => void
  onLangChange: (lang: Lang) => void
}

const primaryButtonClass =
  'flex w-full items-center justify-center gap-2 rounded-2xl bg-lantern-700 px-5 py-4 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'

function ScreenShell({
  facility,
  lang,
  title,
  onBack,
  onLangChange,
  children,
  bottomBar,
}: {
  facility: Facility
  lang: Lang
  title: string
  onBack: () => void
  onLangChange: (lang: Lang) => void
  children: React.ReactNode
  bottomBar?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <GuestTopBar title={title} lang={lang} onBack={onBack} onLangChange={onLangChange} />
      <GuestStepper lang={lang} stepIndex={1} />
      <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-3">{children}</div>
      {bottomBar && <div className="border-t border-edge bg-card px-4 pb-8 pt-3">{bottomBar}</div>}
      <p className="sr-only">{pick(facility.name, lang)}</p>
    </div>
  )
}

export function CheckinStep({ facility, lang, onDone, onBack, onLangChange }: Props) {
  const state = useAppState()
  const [view, setView] = useState<View>('plate')
  const [plate, setPlate] = useState<PlateValue>(EMPTY_PLATE)
  const [nameQuery, setNameQuery] = useState('')
  const [walkInName, setWalkInName] = useState('')
  const [walkInPlate, setWalkInPlate] = useState<PlateValue>(EMPTY_PLATE)
  const [lastQuery, setLastQuery] = useState('')
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null)

  const bookings = state.bookings[facility.id] ?? []
  const arrivals = state.arrivals.filter((a) => a.facilityId === facility.id)
  const facilityName = pick(facility.name, lang)

  const attemptFind = (query: string) => {
    const takenIds = new Set(arrivals.flatMap((a) => (a.bookingId ? [a.bookingId] : [])))
    const booking = findBooking(bookings, query, takenIds)
    if (!booking) {
      setLastQuery(query)
      setView('notFound')
      return
    }
    setFoundBooking(booking)
    setView('found')
  }

  const confirmFoundBooking = () => {
    if (!foundBooking) return
    onDone(
      checkIn({
        facilityId: facility.id,
        bookingId: foundBooking.id,
        name: foundBooking.guestName,
        plate: foundBooking.plate,
        site: foundBooking.site,
        lang,
        prepaid: foundBooking.paid,
        fee: facility.fee,
      }),
    )
  }

  const handlePlateSearch = (event: FormEvent) => {
    event.preventDefault()
    attemptFind(plateQuery(plate))
  }

  const handleNameSearch = (event: FormEvent) => {
    event.preventDefault()
    attemptFind(nameQuery)
  }

  const handleWalkIn = (event: FormEvent) => {
    event.preventDefault()
    const used = occupiedSites(bookings, arrivals)
    onDone(
      checkIn({
        facilityId: facility.id,
        bookingId: null,
        name: walkInName.trim(),
        plate: plateQuery(walkInPlate),
        site: nextFreeSite(facility.sites, used),
        lang,
        prepaid: false,
        fee: facility.fee,
      }),
    )
  }

  if (view === 'found' && foundBooking) {
    const booking = foundBooking
    return (
      <ScreenShell
        facility={facility}
        lang={lang}
        title={facilityName}
        onBack={() => setView('plate')}
        onLangChange={onLangChange}
        bottomBar={
          <button type="button" onClick={confirmFoundBooking} className={primaryButtonClass}>
            {t(lang, 'confirmCheckIn')}
          </button>
        }
      >
        <div className="flex items-center gap-2.5 rounded-2xl bg-ok-soft px-3.5 py-3">
          <img src={circleCheckIcon} alt="" className="h-5 w-5" />
          <p className="text-[15px] font-bold leading-[1.55] text-ok">{t(lang, 'bookingFoundBanner')}</p>
        </div>

        <div className="flex flex-col rounded-[20px] border border-edge bg-card px-[18px] pb-1 pt-[18px]">
          <div className="flex items-center gap-3.5 pb-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lantern-soft">
              <img src={userAvatarIcon} alt="" className="h-[22px] w-[22px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="truncate text-[22px] font-bold leading-[1.4] tracking-[-0.11px] text-ink">
                {t(lang, 'bookingGuestName', { name: booking.guestName })}
              </p>
              <span className="flex w-fit items-center gap-1.5 rounded-md border border-edge bg-paper px-2.5 py-1">
                <img src={carIcon} alt="" className="h-3.5 w-3.5" />
                <span className="text-xs font-medium tracking-[0.024px] text-ink">{booking.plate}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-edge py-3.5">
            <span className="flex items-center gap-2 text-sm text-muted">
              <img src={calendarIcon} alt="" className="h-4 w-4" />
              {t(lang, 'bookingDateLabel')}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-right text-[15px] font-medium text-ink">{stayDates(lang, booking.nights)}</span>
              <span className="whitespace-nowrap rounded-full bg-paper px-2 py-0.5 text-xs font-medium text-muted">{t(lang, 'bookingNightsBadge', { n: booking.nights })}</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-edge py-3.5">
            <span className="flex items-center gap-2 text-sm text-muted">
              <img src={zapIcon} alt="" className="h-4 w-4" />
              {t(lang, 'bookingPlanLabel')}
            </span>
            <span className="text-[15px] font-medium text-ink">{t(lang, 'bookingPlanPower')}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-edge py-3.5">
            <span className="flex items-center gap-2 text-sm text-muted">
              <img src={usersIcon} alt="" className="h-4 w-4" />
              {t(lang, 'bookingGuestsLabel')}
            </span>
            <span className="text-[15px] font-medium text-ink">{t(lang, 'bookingGuestsValue', { n: booking.guests })}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-edge py-3.5">
            <span className="flex items-center gap-2 text-sm text-muted">
              <img src={yenIcon} alt="" className="h-4 w-4" />
              {t(lang, 'bookingFeeLabel')}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-ink">{yen(facility.fee)}</span>
              {!booking.paid && <span className="rounded-full bg-lantern-soft px-2 py-0.5 text-xs font-medium text-[#8a5a00]">{t(lang, 'bookingUnpaid')}</span>}
            </span>
          </div>
        </div>

        <button type="button" onClick={() => setView('plate')} className="text-center text-sm text-lantern-700">
          {t(lang, 'notMyBooking')}
        </button>
      </ScreenShell>
    )
  }

  if (view === 'walkIn') {
    const canSubmit = walkInName.trim().length >= 2
    return (
      <ScreenShell
        facility={facility}
        lang={lang}
        title={t(lang, 'walkInTitle')}
        onBack={() => setView('notFound')}
        onLangChange={onLangChange}
        bottomBar={
          <button type="submit" form="walk-in-form" disabled={!canSubmit} className={primaryButtonClass}>
            {t(lang, 'nextChooseSite')}
            <img src={arrowRightIcon} alt="" className="h-[18px] w-[18px]" />
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold leading-[1.4] tracking-[-0.11px] text-ink">{t(lang, 'walkInHeader')}</h1>
          <p className="text-[15px] leading-[1.65] text-muted">{t(lang, 'walkInHint')}</p>
        </div>
        <form id="walk-in-form" onSubmit={handleWalkIn} className="flex flex-col gap-[22px]">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-[0.024px] text-muted">{t(lang, 'yourName')}</span>
            <div className="flex h-[52px] items-center gap-2.5 rounded-xl border border-edge bg-card px-3.5">
              <img src={userFilledIcon} alt="" className="h-4 w-4 shrink-0" />
              <input
                value={walkInName}
                onChange={(event) => setWalkInName(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none"
              />
              {walkInName.trim().length >= 2 && <img src={checkFilledIcon} alt="" className="h-4 w-4 shrink-0" />}
            </div>
          </label>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium tracking-[0.024px] text-muted">{t(lang, 'plateFieldsLabel')}</span>
              <JapanesePlatePreview value={walkInPlate} size="mini" />
            </div>
            <PlateFields lang={lang} value={walkInPlate} onChange={setWalkInPlate} />
            <div className="flex items-start gap-1.5">
              <img src={infoIcon} alt="" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p className="flex-1 text-[13px] leading-[1.55] text-muted">{t(lang, 'plateUseHint')}</p>
            </div>
          </div>
        </form>
      </ScreenShell>
    )
  }

  if (view === 'notFound') {
    return (
      <ScreenShell
        facility={facility}
        lang={lang}
        title={facilityName}
        onBack={() => setView('plate')}
        onLangChange={onLangChange}
        bottomBar={
          <button type="button" onClick={() => setView('plate')} className="flex w-full items-center justify-center gap-2 py-1.5 text-[15px] font-medium text-lantern-700">
            <img src={messageIcon} alt="" className="h-[18px] w-[18px]" />
            {t(lang, 'contactOperator')}
          </button>
        }
      >
        <div className="flex flex-col items-start gap-2.5">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-lantern-soft">
            <img src={searchXIcon} alt="" className="h-[26px] w-[26px]" />
          </span>
          <h1 className="text-[22px] font-bold leading-[1.4] tracking-[-0.11px] text-ink">{t(lang, 'noBookingTitle')}</h1>
          <p className="text-[15px] leading-[1.65] text-muted">
            {t(lang, 'noBookingHint')} {lastQuery && <span className="font-semibold text-ink">"{lastQuery}"</span>}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-edge bg-card px-4 py-3.5">
          <p className="text-xs font-medium tracking-[0.024px] text-muted">{t(lang, 'noBookingReasonsTitle')}</p>
          {(['noBookingReason1', 'noBookingReason2', 'noBookingReason3'] as const).map((key) => (
            <div key={key} className="flex items-start gap-2.5">
              <img src={bulletIcon} alt="" className="mt-[5px] h-[14px] w-[5px] shrink-0" />
              <p className="flex-1 text-sm leading-[1.6] text-ink">{t(lang, key)}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setView('plate')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-edge bg-card px-2.5 py-3 text-sm text-ink transition hover:bg-paper"
          >
            <img src={pencilIcon} alt="" className="h-4 w-4" />
            {t(lang, 'editPlate')}
          </button>
          <button
            type="button"
            onClick={() => setView('name')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-edge bg-card px-2.5 py-3 text-sm text-ink transition hover:bg-paper"
          >
            <img src={userIcon} alt="" className="h-4 w-4" />
            {t(lang, 'searchByName')}
          </button>
        </div>

        <div className="flex flex-col gap-3.5 rounded-[20px] bg-pine-900 p-4.5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-night-raised">
              <img src={tentIcon} alt="" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[17px] font-bold leading-[1.45] text-white">{t(lang, 'walkInOfferTitle')}</p>
              <p className="text-[13px] leading-[1.55] text-ink-inverse-muted">{t(lang, 'walkInOfferHint')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setView('walkIn')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lantern px-5 py-[15px] text-base font-bold text-pine-900 transition hover:brightness-105 active:scale-[0.99]"
          >
            {t(lang, 'walkInOfferButton')}
            <img src={chevronRightDarkIcon} alt="" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </ScreenShell>
    )
  }

  if (view === 'name') {
    return (
      <ScreenShell
        facility={facility}
        lang={lang}
        title={facilityName}
        onBack={() => setView('notFound')}
        onLangChange={onLangChange}
        bottomBar={
          <button type="submit" form="name-search-form" disabled={nameQuery.trim().length < 2} className={primaryButtonClass}>
            <img src={searchIcon} alt="" className="h-[18px] w-[18px]" />
            {t(lang, 'searchByName')}
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold leading-[1.4] tracking-[-0.11px] text-ink">{t(lang, 'searchByName')}</h1>
        </div>
        <form id="name-search-form" onSubmit={handleNameSearch}>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-[0.024px] text-muted">{t(lang, 'yourName')}</span>
            <div className="flex h-[52px] items-center gap-2.5 rounded-xl border border-edge bg-card px-3.5">
              <img src={userFilledIcon} alt="" className="h-4 w-4 shrink-0" />
              <input
                value={nameQuery}
                onChange={(event) => setNameQuery(event.target.value)}
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none"
              />
            </div>
          </label>
        </form>
      </ScreenShell>
    )
  }

  const canSearchPlate = plateQuery(plate).replace(/\s/g, '').length >= 3

  return (
    <ScreenShell
      facility={facility}
      lang={lang}
      title={facilityName}
      onBack={onBack}
      onLangChange={onLangChange}
      bottomBar={
        <button type="submit" form="plate-search-form" disabled={!canSearchPlate} className={primaryButtonClass}>
          <img src={searchIcon} alt="" className="h-[18px] w-[18px]" />
          {t(lang, 'findBooking')}
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-bold leading-[1.4] tracking-[-0.11px] text-ink">{t(lang, 'checkinTitle')}</h1>
        <p className="text-[15px] leading-[1.65] text-muted">{t(lang, 'checkinHint')}</p>
      </div>

      <div className="flex w-full flex-col items-center gap-0 rounded-[18px] bg-[#eee9dd] py-4">
        <JapanesePlatePreview value={plate} size="large" />
      </div>

      <form id="plate-search-form" onSubmit={handlePlateSearch} className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.024px] text-muted">{t(lang, 'plateFieldsLabel')}</p>
        <PlateFields lang={lang} value={plate} onChange={setPlate} />
      </form>

      <div className="flex items-start gap-1.5">
        <img src={infoIcon} alt="" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p className="flex-1 text-[13px] leading-[1.55] text-muted">{t(lang, 'plateSearchHint')}</p>
      </div>
    </ScreenShell>
  )
}
