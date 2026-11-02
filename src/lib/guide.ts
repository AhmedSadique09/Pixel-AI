import type { DocChunk, Facility, Lang } from './types'
import { pick } from './i18n'

export interface GuideAnswer {
  text: string
  source: string
}

const MIN_DOC_SCORE = 2
const MIN_LATIN_TOKEN_LENGTH = 4
const STOP_WORDS = new Set(['what', 'when', 'where', 'which', 'with', 'that', 'this', 'there', 'have', 'does', 'from', 'until', 'time', 'about'])

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase()
}

/** Latin words plus CJK character pairs, so Japanese/Chinese/Korean match without a tokenizer. */
function tokenize(value: string): string[] {
  const text = normalize(value)
  const latin = (text.match(/[a-z0-9]+/g) ?? []).filter((w) => w.length >= MIN_LATIN_TOKEN_LENGTH && !STOP_WORDS.has(w))
  const cjkRuns = text.match(/[぀-ヿ㐀-鿿가-힯]+/g) ?? []
  const pairs = cjkRuns.flatMap((run) => Array.from({ length: Math.max(run.length - 1, 0) }, (_, i) => run.slice(i, i + 2)))
  return [...new Set([...latin, ...pairs])]
}

function bestDoc(docs: readonly DocChunk[], query: string): { doc: DocChunk; score: number } | null {
  const tokens = tokenize(query)
  const scored = docs.map((doc) => {
    const haystack = normalize(`${doc.title} ${doc.text}`)
    return { doc, score: tokens.filter((token) => haystack.includes(token)).length }
  })
  const best = scored.reduce<{ doc: DocChunk; score: number } | null>((top, item) => (!top || item.score > top.score ? item : top), null)
  return best && best.score >= MIN_DOC_SCORE ? best : null
}

/** Answers from the facility's own material only. Returns null when the documents do not cover the question. */
export function answerQuestion(facility: Facility, query: string, lang: Lang): GuideAnswer | null {
  const q = normalize(query)
  const faq = facility.faq.find((entry) => entry.keywords.some((keyword) => q.includes(normalize(keyword))))
  if (faq) return { text: pick(faq.answer, lang), source: faq.source }

  const hit = bestDoc(facility.docs, query)
  if (hit) return { text: hit.doc.text, source: `${facility.docName} · ${hit.doc.title}` }

  return null
}
