import type { Booking, DocChunk, Facility, Localized } from './types'

const MAX_RULES = 6
const MAX_RULE_LENGTH = 140
const SITES_PER_ROW = 6
const HEADING_PATTERN = /^(#{1,3}\s*|\d+[.)]\s+)/

/** The address a guest's QR code opens (hash routing keeps this static-host friendly). */
export function guestUrl(facilityId: string): string {
  return `${window.location.origin}${window.location.pathname}#/g/${facilityId}`
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'park'
}

/** Splits rules text into sections: a `# Heading` line starts a new one, otherwise blank lines do. */
export function chunkDocument(text: string): DocChunk[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const chunks: { title: string; body: string[] }[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (HEADING_PATTERN.test(line)) {
      chunks.push({ title: line.replace(HEADING_PATTERN, '').trim(), body: [] })
    } else if (line === '') {
      const last = chunks.at(-1)
      if (!last || last.body.length > 0) chunks.push({ title: '', body: [] })
    } else {
      if (chunks.length === 0) chunks.push({ title: '', body: [] })
      chunks[chunks.length - 1].body.push(line)
    }
  }

  return chunks
    .filter((c) => c.body.length > 0)
    .map((c, index) => ({
      id: `doc-${index + 1}`,
      title: c.title || `§${index + 1}`,
      text: c.body.join(' '),
    }))
}

function sameInEveryLanguage(text: string): Localized {
  return { ja: text, en: text, zh: text, ko: text }
}

function toRule(chunk: DocChunk): Localized {
  const text = chunk.text.length > MAX_RULE_LENGTH ? `${chunk.text.slice(0, MAX_RULE_LENGTH).trim()}…` : chunk.text
  return sameInEveryLanguage(`${chunk.title}: ${text}`)
}

export function makeSites(count: number): string[] {
  const rows = Math.ceil(count / SITES_PER_ROW)
  return Array.from({ length: count }, (_, i) => `${String.fromCharCode(65 + (i % rows))}${Math.floor(i / rows) + 1}`)
}

export interface NewFacilityInput {
  name: string
  fee: number
  siteCount: number
  docName: string
  text: string
}

export function buildFacility(input: NewFacilityInput, existingIds: readonly string[]): Facility {
  const baseId = slugify(input.name)
  const id = existingIds.includes(baseId) ? `${baseId}-${existingIds.length + 1}` : baseId
  const docs = chunkDocument(input.text)

  return {
    id,
    name: sameInEveryLanguage(input.name),
    fee: input.fee,
    sites: makeSites(input.siteCount),
    rules: docs.slice(0, MAX_RULES).map(toRule),
    faq: [],
    docName: input.docName,
    docs,
    suggestions: [],
    createdAt: Date.now(),
    isCustom: true,
  }
}

function parseBool(value: string): boolean {
  return ['true', 'yes', 'y', '1', 'paid', '済', '支払済'].includes(value.trim().toLowerCase())
}

/** CSV columns: name, plate, site, paid. A header row is detected and skipped. */
export function parseBookingsCsv(csv: string): Booking[] {
  const rows = csv
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim()))

  const dataRows = rows[0]?.[0]?.toLowerCase() === 'name' ? rows.slice(1) : rows

  return dataRows
    .filter((cells) => cells[0])
    .map((cells, index) => ({
      id: `u${Date.now().toString(36)}${index}`,
      guestName: cells[0],
      alias: '',
      plate: cells[1] ?? '',
      site: cells[2] ?? '',
      paid: parseBool(cells[3] ?? ''),
      nights: 1,
      guests: 1,
    }))
}
