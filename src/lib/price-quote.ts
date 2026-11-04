import {
  addons,
  basicLawn,
  frequencyChoices,
  monthlyDiscountPercent,
  priceDisclaimer,
  sizeBands,
  type Frequency,
  type PricedBand,
  type SizeBand,
} from '@/config/pricing'
import { bandLabel } from '@/lib/lawn'

export type ServiceRow = {
  id: string
  label: string
  detail: string
  status: string
  tone: 'save' | 'plain'
  amountLabel: string
  amountCents: number | null
  selected: boolean
  blocksTotal: boolean
  hours: boolean
}

export type PriceInput = {
  band: SizeBand | null
  areaSqm: number | null
  frequency: Frequency
  basic: boolean
  picked: Readonly<Record<string, boolean>>
  hours: Readonly<Record<string, number | null>>
}

export type PriceQuote = {
  rows: ServiceRow[]
  totalCents: number | null
  totalLabel: string
  perVisit: boolean
  quotedReason: string
  hasSelection: boolean
  /** Body text for the quote message, without the "Indicative price" heading. */
  block: string
}

export function formatAud(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const rem = abs % 100
  const grouped = dollars.toLocaleString('en-AU')
  if (rem === 0) return `${sign}$${grouped}`
  return `${sign}$${grouped}.${String(rem).padStart(2, '0')}`
}

export function parseHours(value: string): number | null {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n <= 0 || n > 40) return null
  return n
}

export function defaultHourText(): Record<string, string> {
  const hours: Record<string, string> = {}
  for (const addon of addons) {
    if (addon.kind === 'hourly') hours[addon.id] = String(addon.defaultHours)
  }
  return hours
}

function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

function percentOff(cents: number, percent: number): number {
  return Math.round((cents * (100 - percent)) / 100)
}

function isPriced(band: SizeBand | null): band is PricedBand {
  return band === 'small' || band === 'medium' || band === 'large'
}

function lawnIsOver(areaSqm: number | null, band: SizeBand | null): boolean {
  if (areaSqm != null && areaSqm > sizeBands.large.maxSqm) return true
  return band === 'over'
}

function frequencyLabel(frequency: Frequency): string {
  return frequencyChoices.find((item) => item.id === frequency)?.label ?? frequency
}

type VisitPrice = {
  cents: number
  savingNote: string
}

function basicVisit(band: PricedBand, frequency: Frequency): VisitPrice {
  const list = dollarsToCents(basicLawn.oneOff[band])
  if (frequency === 'one-off') return { cents: list, savingNote: '' }

  const cents =
    frequency === 'fortnightly' ? dollarsToCents(basicLawn.fortnightly[band]) : percentOff(list, monthlyDiscountPercent)
  const saving = list - cents
  if (saving <= 0) return { cents, savingNote: '' }

  const against = `Save ${formatAud(saving)} on the one-off price (${formatAud(list)})`
  if (frequency === 'monthly') return { cents, savingNote: `${against}, ${monthlyDiscountPercent}% off.` }
  return { cents, savingNote: `${against}.` }
}

function onSiteRow(base: Omit<ServiceRow, 'amountLabel' | 'amountCents' | 'blocksTotal'>): ServiceRow {
  return { ...base, amountLabel: 'On site', amountCents: null, blocksTotal: base.selected }
}

function setSizeRow(
  base: Omit<ServiceRow, 'amountLabel' | 'amountCents' | 'blocksTotal' | 'status' | 'tone'>,
): ServiceRow {
  return {
    ...base,
    status: 'Choose a lawn size.',
    tone: 'plain',
    amountLabel: 'Set size',
    amountCents: null,
    blocksTotal: base.selected,
  }
}

export function quotePreview(input: PriceInput): PriceQuote {
  const over = lawnIsOver(input.areaSqm, input.band)
  const perVisit = input.frequency !== 'one-off'
  const rows: ServiceRow[] = []

  const basicLabel =
    !over && isPriced(input.band) ? `${basicLawn.name} (${sizeBands[input.band].label})` : basicLawn.name

  if (over) {
    rows.push(
      onSiteRow({
        id: basicLawn.id,
        label: basicLabel,
        detail: basicLawn.detail,
        status: '',
        tone: 'plain',
        selected: input.basic,
        hours: false,
      }),
    )
  } else if (!isPriced(input.band)) {
    rows.push(
      setSizeRow({
        id: basicLawn.id,
        label: basicLabel,
        detail: basicLawn.detail,
        selected: input.basic,
        hours: false,
      }),
    )
  } else {
    const visit = basicVisit(input.band, input.frequency)
    rows.push({
      id: basicLawn.id,
      label: basicLabel,
      detail: basicLawn.detail,
      status: visit.savingNote,
      tone: visit.savingNote ? 'save' : 'plain',
      amountLabel: formatAud(visit.cents),
      amountCents: visit.cents,
      selected: input.basic,
      blocksTotal: false,
      hours: false,
    })
  }

  for (const addon of addons) {
    if (!addon.enabled) continue
    const selected = input.picked[addon.id] === true

    if (addon.kind === 'flat') {
      const cents = dollarsToCents(addon.price)
      rows.push(
        over
          ? onSiteRow({
              id: addon.id,
              label: addon.name,
              detail: '',
              status: '',
              tone: 'plain',
              selected,
              hours: false,
            })
          : {
              id: addon.id,
              label: addon.name,
              detail: '',
              status: '',
              tone: 'plain',
              amountLabel: formatAud(cents),
              amountCents: cents,
              selected,
              blocksTotal: false,
              hours: false,
            },
      )
      continue
    }

    if (addon.kind === 'by-size') {
      if (over) {
        rows.push(
          onSiteRow({
            id: addon.id,
            label: addon.name,
            detail: 'Follows the lawn size.',
            status: '',
            tone: 'plain',
            selected,
            hours: false,
          }),
        )
        continue
      }
      if (!isPriced(input.band)) {
        rows.push(
          setSizeRow({
            id: addon.id,
            label: addon.name,
            detail: 'Follows the lawn size.',
            selected,
            hours: false,
          }),
        )
        continue
      }
      const cents = dollarsToCents(addon.prices[input.band])
      rows.push({
        id: addon.id,
        label: `${addon.name} (${sizeBands[input.band].label})`,
        detail: 'Follows the lawn size.',
        status: '',
        tone: 'plain',
        amountLabel: formatAud(cents),
        amountCents: cents,
        selected,
        blocksTotal: false,
        hours: false,
      })
      continue
    }

    if (addon.kind === 'capped') {
      const limit = addon.includedUpToSqm
      const detail = `Up to ${limit} m². Larger lawns are quoted on site.`
      if (over) {
        rows.push(
          onSiteRow({
            id: addon.id,
            label: addon.name,
            detail,
            status: '',
            tone: 'plain',
            selected,
            hours: false,
          }),
        )
        continue
      }
      if (input.areaSqm == null && !isPriced(input.band)) {
        rows.push(
          setSizeRow({
            id: addon.id,
            label: addon.name,
            detail,
            selected,
            hours: false,
          }),
        )
        continue
      }
      const band = input.band
      const tooBig = input.areaSqm != null ? input.areaSqm > limit : isPriced(band) && sizeBands[band].maxSqm > limit
      if (tooBig) {
        rows.push(
          onSiteRow({
            id: addon.id,
            label: addon.name,
            detail,
            status: '',
            tone: 'plain',
            selected,
            hours: false,
          }),
        )
        continue
      }
      const cents = dollarsToCents(addon.price)
      rows.push({
        id: addon.id,
        label: addon.name,
        detail,
        status: '',
        tone: 'plain',
        amountLabel: formatAud(cents),
        amountCents: cents,
        selected,
        blocksTotal: false,
        hours: false,
      })
      continue
    }

    if (addon.kind === 'hourly') {
      const rate = dollarsToCents(addon.hourly)
      const hours = input.hours[addon.id] ?? null
      const rateLabel = `${formatAud(rate)} an hour`
      if (over) {
        rows.push(
          onSiteRow({
            id: addon.id,
            label: addon.name,
            detail: 'Quoted on site.',
            status: selected && hours != null ? `About ${formatHours(hours)}.` : selected ? 'Enter the hours.' : '',
            tone: 'plain',
            selected,
            hours: true,
          }),
        )
        continue
      }
      if (addon.quotedOnSite) {
        const status = hours != null ? `About ${formatHours(hours)} at ${rateLabel}.` : 'Enter the hours.'
        rows.push(
          onSiteRow({
            id: addon.id,
            label: addon.name,
            detail: `${rateLabel}. Quoted on site.`,
            status: selected ? status : '',
            tone: 'plain',
            selected,
            hours: true,
          }),
        )
        continue
      }
      if (hours == null) {
        rows.push({
          id: addon.id,
          label: addon.name,
          detail: rateLabel,
          status: selected ? 'Enter the hours.' : '',
          tone: 'plain',
          amountLabel: `${formatAud(rate)}/hr`,
          amountCents: null,
          selected,
          blocksTotal: selected,
          hours: true,
        })
        continue
      }
      const cents = Math.round(hours * rate)
      rows.push({
        id: addon.id,
        label: addon.name,
        detail: `${formatHours(hours)} at ${rateLabel}`,
        status: '',
        tone: 'plain',
        amountLabel: formatAud(cents),
        amountCents: cents,
        selected,
        blocksTotal: false,
        hours: true,
      })
    }
  }

  const selectedRows = rows.filter((row) => row.selected)
  const hasSelection = selectedRows.length > 0
  let quotedReason = ''
  let totalCents: number | null = null

  if (over) {
    quotedReason = `${bandLabel('over')}.`
  } else if (hasSelection && selectedRows.some((row) => row.blocksTotal)) {
    const overgrown = selectedRows.find((row) => row.id === 'overgrown')
    const aeration = selectedRows.find((row) => row.id === 'aeration' && row.amountCents == null)
    const needsSize = selectedRows.some((row) => row.status === 'Choose a lawn size.')
    const needsHours = selectedRows.some((row) => row.status === 'Enter the hours.')
    if (overgrown) quotedReason = 'Overgrown first visit is quoted on site.'
    else if (aeration) {
      const cap = addons.find((item) => item.id === 'aeration')
      const limit = cap && cap.kind === 'capped' ? cap.includedUpToSqm : 0
      quotedReason = `Aeration on a lawn over ${limit} m² is quoted on site.`
    } else if (needsSize) quotedReason = 'Choose a lawn size to see a total.'
    else if (needsHours) quotedReason = 'Enter the hours to see a total.'
    else quotedReason = 'Quoted on site.'
  } else if (hasSelection) {
    totalCents = selectedRows.reduce((sum, row) => sum + (row.amountCents ?? 0), 0)
  }

  const totalLabel = totalCents == null ? '' : formatAud(totalCents)
  const block = hasSelection ? messageBlock(input, selectedRows, totalCents, quotedReason) : ''

  return { rows, totalCents, totalLabel, perVisit, quotedReason, hasSelection, block }
}

function formatHours(hours: number): string {
  return hours === 1 ? '1 hour' : `${hours} hours`
}

function messageBlock(
  input: PriceInput,
  selected: ServiceRow[],
  totalCents: number | null,
  quotedReason: string,
): string {
  const lines: string[] = [`Frequency: ${frequencyLabel(input.frequency)}.`]
  if (input.band === 'over') {
    const area = input.areaSqm != null ? `${input.areaSqm} m². ` : ''
    lines.push(`Size: ${area}${bandLabel('over')}.`)
  } else if (input.band) {
    const area = input.areaSqm != null ? `, ${input.areaSqm} m²` : ''
    lines.push(`Size: ${bandLabel(input.band)}${area}.`)
  }
  for (const row of selected) {
    if (row.amountCents == null) {
      const extra = row.status ? ` ${row.status}` : ''
      lines.push(`${row.label}: quoted on site.${extra}`)
    } else {
      const visit = input.frequency === 'one-off' ? '' : ' per visit'
      const save = row.status ? ` ${row.status}` : ''
      lines.push(`${row.label}: ${formatAud(row.amountCents)}${visit}.${save}`)
    }
  }
  if (totalCents != null) {
    const visit = input.frequency === 'one-off' ? '' : ' per visit'
    lines.push(`Total: ${formatAud(totalCents)}${visit}.`)
  } else {
    lines.push(`Total: quoted on site. ${quotedReason}`.trim())
  }
  lines.push(priceDisclaimer)
  return lines.join('\n')
}
