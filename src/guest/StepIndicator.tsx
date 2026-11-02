import type { Lang } from '../lib/types'
import { t, type MessageKey } from '../lib/i18n'

const STEPS: readonly MessageKey[] = ['stepCheckin', 'stepRules', 'stepPay', 'stepGuide']

type Props = {
  lang: Lang
  /** 1-based index of the current step (0 hides the indicator entirely). */
  stepIndex: number
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function StepIndicator({ lang, stepIndex }: Props) {
  return (
    <ol className="mt-4 mx-auto flex w-fit items-start" aria-label={t(lang, 'steps', { n: stepIndex, total: STEPS.length })}>
      {STEPS.flatMap((key, index) => {
        const isCompleted = index < stepIndex - 1
        const isCurrent = index === stepIndex - 1
        const nodes = [
          <li key={key} className="flex flex-col items-center gap-1.5">
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold transition-all duration-300 ${
                isCompleted
                  ? 'border-lantern bg-lantern text-white'
                  : isCurrent
                    ? 'step-pulse scale-110 border-lantern bg-lantern text-white'
                    : 'border-edge bg-card text-pine-700/50'
              }`}
            >
              {isCompleted ? <CheckIcon /> : index + 1}
            </span>
            <span className={`block w-16 text-center text-[11px] font-semibold transition-colors duration-300 ${isCurrent ? 'text-ink' : 'text-muted'}`}>
              {t(lang, key)}
            </span>
          </li>,
          index < STEPS.length - 1 ? (
            <li key={`${key}-line`} aria-hidden="true" className="mt-[11px] h-0.5 w-8 overflow-hidden rounded-full bg-edge">
              <div className={`h-full rounded-full bg-lantern transition-all duration-500 ease-out ${isCompleted ? 'w-full' : 'w-0'}`} />
            </li>
          ) : null,
        ]
        return nodes
      })}
    </ol>
  )
}
