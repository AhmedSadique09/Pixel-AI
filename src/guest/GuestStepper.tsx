import type { Lang } from '../lib/types'
import { t, type MessageKey } from '../lib/i18n'

const STEPS: readonly MessageKey[] = ['stepConfirm', 'stepRules', 'stepPay']

type Props = {
  lang: Lang
  /** 1-based index of the current step (1..STEPS.length). */
  stepIndex: number
}

export function GuestStepper({ lang, stepIndex }: Props) {
  return (
    <div className="flex gap-2 px-5 pb-3 pt-1" aria-label={t(lang, 'steps', { n: stepIndex, total: STEPS.length })}>
      {STEPS.map((key, index) => {
        const isDone = index < stepIndex
        return (
          <div key={key} className="flex flex-1 flex-col gap-1.5">
            <div className={`h-1 rounded-full transition-colors duration-300 ${isDone ? 'bg-lantern-700' : 'bg-edge'}`} />
            <div className={`flex items-center gap-1 whitespace-nowrap text-xs tracking-[0.024px] ${isDone ? 'text-lantern-700' : 'text-muted'}`}>
              <span className="font-medium">{index + 1}</span>
              <span className={isDone ? 'font-bold' : 'font-medium'}>{t(lang, key)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
