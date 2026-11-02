import type { Lang } from '../lib/types'
import { t } from '../lib/i18n'

type Props = {
  sites: readonly string[]
  mine: string
  taken: ReadonlySet<string>
  lang: Lang
}

const COLUMNS = 6

function LegendItem({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${swatchClass}`} aria-hidden="true" />
      {label}
    </span>
  )
}

export function SiteMap({ sites, mine, taken, lang }: Props) {
  return (
    <figure className="rounded-2xl border border-edge bg-pine-100/60 p-3" aria-label={`${t(lang, 'yourSite')} ${mine}`}>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}>
        {sites.map((site) => {
          const isMine = site === mine
          const isTaken = taken.has(site)
          const tone = isMine
            ? 'step-pulse bg-lantern-700 text-white shadow-md scale-110 z-10'
            : isTaken
              ? 'bg-edge text-muted'
              : 'bg-card text-pine-700 border border-edge'
          return (
            <div key={site} className={`grid h-10 place-items-center rounded-md text-xs font-bold transition-transform ${tone}`}>
              {site}
            </div>
          )
        })}
      </div>
      <figcaption className="mt-3 flex items-center justify-center gap-2 rounded-md bg-pine-700 py-1.5 text-xs font-semibold tracking-wide text-pine-100">
        <span aria-hidden="true">▲</span>
        {t(lang, 'entrance')}
      </figcaption>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <LegendItem swatchClass="bg-lantern-700" label={t(lang, 'legendYours')} />
        <LegendItem swatchClass="bg-edge" label={t(lang, 'legendTaken')} />
        <LegendItem swatchClass="border border-pine-700/40 bg-card" label={t(lang, 'legendAvailable')} />
      </div>
    </figure>
  )
}
