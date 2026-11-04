import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  basicLawn,
  frequencyChoices,
  monthlyDiscountPercent,
  priceDisclaimer,
  sizeBands,
  type Frequency,
  type SizeBand,
} from '@/config/pricing'
import type { LawnEstimate } from '@/lib/lawn'
import { defaultHourText, parseHours, quotePreview, type ServiceRow } from '@/lib/price-quote'
import { cn } from 'cn'

const bandChoices: { id: SizeBand; label: string; hint: string }[] = [
  { id: 'small', label: sizeBands.small.label, hint: sizeBands.small.range },
  { id: 'medium', label: sizeBands.medium.label, hint: sizeBands.medium.range },
  { id: 'large', label: sizeBands.large.label, hint: sizeBands.large.range },
  { id: 'over', label: `Over ${sizeBands.large.maxSqm} m²`, hint: "We'll quote on site" },
]

function frequencyHint(id: Frequency): string {
  if (id === 'monthly') return `${monthlyDiscountPercent}% off the one-off lawn price`
  if (id === 'fortnightly') return 'Lower than the one-off lawn price'
  return 'A single visit'
}

function stepHours(value: string, delta: number): string {
  const current = parseHours(value) ?? 0
  const next = Math.min(40, Math.max(0.5, Math.round((current + delta) * 2) / 2))
  return String(next)
}

export function PriceBuilder({
  estimate,
  onSummary,
  onUse,
}: {
  estimate: LawnEstimate | null
  onSummary: (block: string) => void
  onUse: (block: string) => void
}) {
  const [band, setBand] = useState<SizeBand | null>(null)
  const [seenSqm, setSeenSqm] = useState<number | null>(null)
  const [frequency, setFrequency] = useState<Frequency>('one-off')
  const [basic, setBasic] = useState(false)
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [hoursText, setHoursText] = useState(defaultHourText)
  const [added, setAdded] = useState(false)

  if (estimate && estimate.sqm !== seenSqm) {
    setSeenSqm(estimate.sqm)
    setBand(estimate.band)
    setAdded(false)
  }

  const hours = useMemo(() => {
    const parsed: Record<string, number | null> = {}
    for (const [id, text] of Object.entries(hoursText)) parsed[id] = parseHours(text)
    return parsed
  }, [hoursText])

  const areaSqm = estimate && band === estimate.band ? estimate.sqm : null
  const quote = quotePreview({ band, areaSqm, frequency, basic, picked, hours })

  useEffect(() => {
    onSummary(quote.block)
  }, [quote.block, onSummary])

  function chooseBand(next: SizeBand) {
    setAdded(false)
    setBand(next)
  }

  function toggle(id: string, checked: boolean) {
    setAdded(false)
    if (id === basicLawn.id) {
      setBasic(checked)
      return
    }
    setPicked((current) => ({ ...current, [id]: checked }))
  }

  return (
    <section id="price-builder" aria-labelledby="price-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-8">
      <h2 id="price-heading" className="font-heading text-2xl font-bold tracking-tight">
        Build a price
      </h2>
      <p id="price-disclaimer" className="mt-2 text-muted-foreground">
        {priceDisclaimer}
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Lawn size</legend>
        {estimate && band === estimate.band ? (
          <p className="mt-1 text-sm text-muted-foreground">Using your estimate, {estimate.sqm} m².</p>
        ) : estimate ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Your sections add up to {estimate.sqm} m².{' '}
            <button type="button" className="font-medium text-eucalypt underline underline-offset-4" onClick={() => chooseBand(estimate.band)}>
              Use that size
            </button>
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">Pick a size, or measure the lawn above.</p>
        )}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {bandChoices.map((item) => {
            const selected = band === item.id
            return (
              <label
                key={item.id}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2',
                  selected ? 'border-eucalypt bg-secondary' : 'border-input bg-background',
                )}
              >
                <input
                  type="radio"
                  name="lawn-size-band"
                  className="size-5 accent-eucalypt"
                  checked={selected}
                  onChange={() => chooseBand(item.id)}
                />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-sm text-muted-foreground">{item.hint}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">How often</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {frequencyChoices.map((item) => {
            const selected = frequency === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAdded(false)
                  setFrequency(item.id)
                }}
                className={cn(
                  'min-h-11 rounded-xl border px-3 py-2 text-left',
                  selected ? 'border-eucalypt bg-secondary' : 'border-input bg-background',
                )}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-sm text-muted-foreground">{frequencyHint(item.id)}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Services</legend>
        <ul className="mt-2 grid gap-2">
          {quote.rows.map((row) => (
            <ServiceChoice
              key={row.id}
              row={row}
              hoursValue={hoursText[row.id] ?? ''}
              onToggle={(checked) => toggle(row.id, checked)}
              onHours={(value) => {
                setAdded(false)
                setHoursText((current) => ({ ...current, [row.id]: value }))
              }}
            />
          ))}
        </ul>
      </fieldset>

      <div className="mt-5 rounded-xl bg-eucalypt px-4 py-4 text-primary-foreground" aria-live="polite">
        {quote.totalCents != null ? (
          <>
            <p className="text-sm">{quote.perVisit ? 'Total per visit' : 'Total'}</p>
            <p className="font-heading text-4xl tracking-tight">{quote.totalLabel}</p>
          </>
        ) : quote.quotedReason ? (
          <>
            <p className="font-heading text-3xl tracking-tight">Quoted on site</p>
            <p className="mt-1 text-sm text-primary-foreground/90">{quote.quotedReason}</p>
          </>
        ) : (
          <>
            <p className="font-heading text-2xl tracking-tight">No total yet</p>
            <p className="mt-1 text-sm text-primary-foreground/90">Tick the services you want.</p>
          </>
        )}
        <p className="mt-2 text-sm text-primary-foreground/90">{priceDisclaimer}</p>
      </div>

      <Button
        type="button"
        className="mt-4 h-11 w-full px-5 sm:w-auto"
        disabled={!quote.hasSelection}
        onClick={() => {
          if (!quote.block) return
          setAdded(true)
          onUse(quote.block)
        }}
      >
        Use this price in my quote
      </Button>
      {added ? (
        <p role="status" className="mt-2 text-sm">
          Added to the message in the form.
        </p>
      ) : null}
    </section>
  )
}

function ServiceChoice({
  row,
  hoursValue,
  onToggle,
  onHours,
}: {
  row: ServiceRow
  hoursValue: string
  onToggle: (checked: boolean) => void
  onHours: (value: string) => void
}) {
  const inputId = `price-${row.id}`
  const hoursId = `price-hours-${row.id}`
  return (
    <li className="rounded-xl border border-input bg-background px-3 py-3">
      <div className="flex items-start gap-3">
        <Checkbox
          id={inputId}
          checked={row.selected}
          onCheckedChange={(value) => onToggle(value === true)}
          className="mt-1 size-5"
          aria-describedby="price-disclaimer"
        />
        <div className="min-w-0 flex-1">
          <Label htmlFor={inputId} className="cursor-pointer text-base font-medium">
            {row.label}
          </Label>
          {row.detail ? <p className="text-sm text-muted-foreground">{row.detail}</p> : null}
          {row.status ? (
            <p className={cn('text-sm', row.tone === 'save' ? 'font-medium text-eucalypt' : 'text-muted-foreground')}>{row.status}</p>
          ) : null}
        </div>
        <p className="shrink-0 text-right text-sm font-medium">
          <span className="sr-only">{priceDisclaimer} </span>
          {row.amountLabel}
        </p>
      </div>
      {row.hours && row.selected ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="size-11 rounded-md border border-input text-lg"
            aria-label={`Fewer hours for ${row.label}`}
            onClick={() => onHours(stepHours(hoursValue, -0.5))}
          >
            −
          </button>
          <input
            id={hoursId}
            inputMode="decimal"
            value={hoursValue}
            onChange={(event) => onHours(event.target.value)}
            aria-label={`Hours for ${row.label}`}
            className="h-11 w-20 rounded-md border border-input bg-card text-center text-base"
          />
          <span className="text-sm">hours</span>
          <button
            type="button"
            className="size-11 rounded-md border border-input text-lg"
            aria-label={`More hours for ${row.label}`}
            onClick={() => onHours(stepHours(hoursValue, 0.5))}
          >
            +
          </button>
        </div>
      ) : null}
    </li>
  )
}
