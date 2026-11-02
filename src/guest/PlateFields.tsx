import type { Lang } from '../lib/types'
import { t } from '../lib/i18n'
import type { PlateValue } from '../lib/plate'
import plateBoltIcon from '../assets/icons/plate-bolt.svg'

const fieldInputClass =
  'flex h-[52px] w-full items-center rounded-xl border border-edge bg-card px-3.5 text-[17px] font-bold text-ink outline-none transition focus:border-2 focus:border-lantern-700 focus:px-[13px]'

type FieldsProps = {
  lang: Lang
  value: PlateValue
  onChange: (next: PlateValue) => void
}

export function PlateFields({ lang, value, onChange }: FieldsProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex gap-2.5">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] text-muted">{t(lang, 'plateRegion')}</span>
          <input value={value.region} onChange={(e) => onChange({ ...value, region: e.target.value })} className={fieldInputClass} />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] text-muted">{t(lang, 'plateClass')}</span>
          <input value={value.classNum} onChange={(e) => onChange({ ...value, classNum: e.target.value })} inputMode="numeric" className={fieldInputClass} />
        </label>
      </div>
      <div className="flex gap-2.5">
        <label className="flex w-[96px] shrink-0 flex-col gap-1.5">
          <span className="text-[13px] text-muted">{t(lang, 'plateHiragana')}</span>
          <input value={value.kana} onChange={(e) => onChange({ ...value, kana: e.target.value })} className={fieldInputClass} />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] text-muted">{t(lang, 'plateSerial')}</span>
          <input value={value.serial} onChange={(e) => onChange({ ...value, serial: e.target.value })} inputMode="numeric" className={fieldInputClass} />
        </label>
      </div>
    </div>
  )
}

type PreviewProps = {
  value: PlateValue
  size: 'large' | 'mini'
}

export function JapanesePlatePreview({ value, size }: PreviewProps) {
  const isLarge = size === 'large'
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md border-[#1c6638] bg-white text-[#1c6638] ${
        isLarge ? 'h-[116px] w-[232px] border-[3px] shadow-md' : 'h-14 w-28 border-2'
      }`}
    >
      {isLarge && (
        <>
          <img src={plateBoltIcon} alt="" className="absolute left-[23px] top-[11px] h-[7px] w-[7px]" />
          <img src={plateBoltIcon} alt="" className="absolute right-[23px] top-[11px] h-[7px] w-[7px]" />
        </>
      )}
      <div className="flex h-full flex-col items-center justify-center gap-0.5 px-1">
        <p className={`font-bold leading-none ${isLarge ? 'text-[22px]' : 'text-[11px]'}`}>
          {value.region || '—'} {value.classNum || '—'}
        </p>
        <div className="flex items-end gap-1">
          <span className={`font-bold leading-none ${isLarge ? 'text-2xl' : 'text-xs'}`}>{value.kana || '—'}</span>
          <span className={`font-black leading-none ${isLarge ? 'text-[46px]' : 'text-xl'}`}>{value.serial || '--·--'}</span>
        </div>
      </div>
    </div>
  )
}
