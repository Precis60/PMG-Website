import { sizeBands, type SizeBand } from '@/config/pricing'

export type LawnShape = 'rectangle' | 'circle' | 'triangle'

export type LawnSection = {
  id: string
  name: string
  shape: LawnShape
  a: string
  b: string
}

export type LawnEstimate = {
  sqm: number
  band: SizeBand
  /** Body text for the quote message, without the "Lawn size" heading. */
  block: string
}

export type SectionState = 'empty' | 'incomplete' | 'invalid' | 'ready'

export function parseMetres(value: string): number | null {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

export function bandForSqm(sqm: number): SizeBand {
  if (sqm <= sizeBands.small.maxSqm) return 'small'
  if (sqm <= sizeBands.medium.maxSqm) return 'medium'
  if (sqm <= sizeBands.large.maxSqm) return 'large'
  return 'over'
}

export function bandLabel(band: SizeBand): string {
  if (band === 'over') return `Over ${sizeBands.large.maxSqm} m², we'll quote on site`
  const item = sizeBands[band]
  return `${item.label} (${item.range})`
}

export function sectionSqm(section: LawnSection): number | null {
  const a = parseMetres(section.a)
  if (a == null) return null
  let raw: number
  if (section.shape === 'circle') {
    raw = Math.PI * (a / 2) ** 2
  } else {
    const b = parseMetres(section.b)
    if (b == null) return null
    raw = section.shape === 'rectangle' ? a * b : (a * b) / 2
  }
  if (!Number.isFinite(raw) || raw <= 0) return null
  const rounded = Math.round(raw)
  return rounded > 0 ? rounded : null
}

export function sectionState(section: LawnSection): SectionState {
  const needsB = section.shape !== 'circle'
  const aText = section.a.trim()
  const bText = section.b.trim()
  const any = section.name.trim().length > 0 || aText.length > 0 || (needsB && bText.length > 0)
  if (!any) return 'empty'
  if (sectionSqm(section) != null) return 'ready'
  const aBad = aText.length > 0 && parseMetres(section.a) == null
  const bBad = needsB && bText.length > 0 && parseMetres(section.b) == null
  if (aBad || bBad) return 'invalid'
  return 'incomplete'
}

function sectionLine(section: LawnSection, index: number, sqm: number): string {
  const name = section.name.trim() || `Section ${index + 1}`
  if (section.shape === 'circle') return `${name}: circle, ${section.a.trim()} m across = ${sqm} m²`
  if (section.shape === 'triangle') {
    return `${name}: triangle, ${section.a.trim()} m base × ${section.b.trim()} m height = ${sqm} m²`
  }
  return `${name}: ${section.a.trim()} m × ${section.b.trim()} m = ${sqm} m²`
}

export function summariseLawn(sections: LawnSection[]): { estimate: LawnEstimate | null; blocking: boolean } {
  let blocking = false
  let total = 0
  let ready = 0
  const lines: string[] = []

  sections.forEach((section, index) => {
    const state = sectionState(section)
    if (state === 'incomplete' || state === 'invalid') blocking = true
    if (state !== 'ready') return
    const sqm = sectionSqm(section)
    if (sqm == null) return
    ready += 1
    total += sqm
    lines.push(sectionLine(section, index, sqm))
  })

  if (ready === 0) return { estimate: null, blocking }

  const band = bandForSqm(total)
  const block = [
    `Total: ${total} m². ${bandLabel(band)}.`,
    ...lines,
    "Measure roughly, we'll confirm on site.",
  ].join('\n')

  return { estimate: { sqm: total, band, block }, blocking }
}
