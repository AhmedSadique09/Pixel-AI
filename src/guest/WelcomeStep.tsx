import { LANGS, type Facility, type Lang } from '../lib/types'
import { pick, t } from '../lib/i18n'
import moonIcon from '../assets/icons/moon.svg'
import clockIcon from '../assets/icons/clock.svg'
import smartphoneIcon from '../assets/icons/smartphone.svg'
import sparklesIcon from '../assets/icons/sparkles.svg'
import checkIcon from '../assets/icons/check.svg'
import chevronRightIcon from '../assets/icons/chevron-right.svg'
import nightLandscape from '../assets/illustrations/night-landscape.svg'

/** The language the hero copy itself is shown in before the guest has picked one. */
const HERO_LANG: Lang = 'ja'

type Props = {
  facility: Facility
  onPick: (lang: Lang) => void
}

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-night-raised px-2.5 py-1.5">
      <img src={icon} alt="" className="h-3.5 w-3.5" />
      <span className="whitespace-nowrap text-xs font-medium tracking-[0.02px] text-white">{label}</span>
    </span>
  )
}

export function WelcomeStep({ facility, onPick }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-pine-900">
      <div className="flex flex-col gap-5 px-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lantern">
            <img src={moonIcon} alt="" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[17px] font-bold leading-[1.45] text-white">{pick(facility.name, HERO_LANG)}</p>
            <p className="text-[13px] leading-[1.55] text-ink-inverse-muted">{t(HERO_LANG, 'welcomeTagline')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-[0.024px] text-lantern">{t(HERO_LANG, 'welcomeEyebrow')}</p>
          <h1 className="text-[28px] font-bold leading-[1.4] tracking-[-0.28px] text-white">
            <span className="block">{t(HERO_LANG, 'welcomeHeadingLine1')}</span>
            <span className="block">{t(HERO_LANG, 'welcomeHeadingLine2')}</span>
          </h1>
          <p className="text-[15px] leading-[1.65] text-ink-inverse-muted">{t(HERO_LANG, 'welcomeSubtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill icon={clockIcon} label={t(HERO_LANG, 'pillFast')} />
          <Pill icon={smartphoneIcon} label={t(HERO_LANG, 'pillNoApp')} />
          <Pill icon={sparklesIcon} label={t(HERO_LANG, 'pillAiGuide')} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <img src={nightLandscape} alt="" className="h-24 w-full" />
      </div>

      <div className="flex flex-col gap-2 rounded-t-[28px] bg-paper px-5 pb-8 pt-6">
        <h2 className="text-[17px] font-bold leading-[1.45] text-ink">{t(HERO_LANG, 'chooseLang')}</h2>
        <div className="h-1" />
        {LANGS.map((l) => {
          const isDefault = l.code === HERO_LANG
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => onPick(l.code)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.98] ${
                isDefault ? 'border-lantern-700 bg-card' : 'border-edge bg-card hover:border-lantern-700/60'
              }`}
            >
              <span className="flex-1">
                <span className="block text-[17px] font-bold leading-[1.45] text-ink">{l.native}</span>
                <span className="block text-[13px] leading-[1.55] text-muted">{l.label}</span>
              </span>
              {isDefault ? (
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lantern-700">
                  <img src={checkIcon} alt="" className="h-3.5 w-3.5" />
                </span>
              ) : (
                <img src={chevronRightIcon} alt="" className="h-5 w-5 shrink-0" />
              )}
            </button>
          )
        })}
        <p className="mt-1 text-center text-[13px] leading-[1.55] text-muted">Powered by PixelDrive</p>
      </div>
    </div>
  )
}
