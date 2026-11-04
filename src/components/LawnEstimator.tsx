import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  bandLabel,
  sectionSqm,
  sectionState,
  summariseLawn,
  type LawnEstimate,
  type LawnSection,
  type LawnShape,
} from '@/lib/lawn'
import { cn } from 'cn'

/**
 * Lawn area from measurements the customer can do on a phone.
 * There is no satellite tracer. Esri World Imagery is not free for a
 * commercial site, Vicmap Basemaps charges a fee for a business website,
 * and free Sentinel-2 imagery is about 10 m per pixel, too coarse to
 * trace a lawn.
 */

const fieldClass = 'h-11 bg-background text-base md:text-base'

const shapes: { id: LawnShape; label: string }[] = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'triangle', label: 'Triangle' },
]

function blankSection(): LawnSection {
  return { id: crypto.randomUUID(), name: '', shape: 'rectangle', a: '', b: '' }
}

function shapeHint(shape: LawnShape): string {
  if (shape === 'circle') return 'The distance across the round part.'
  if (shape === 'triangle') return 'Base times height, then halved.'
  return 'Length times width.'
}

export function LawnEstimator({
  onEstimate,
  onUse,
}: {
  onEstimate: (estimate: LawnEstimate | null) => void
  onUse: (block: string) => void
}) {
  const [sections, setSections] = useState<LawnSection[]>(() => [blankSection()])
  const [added, setAdded] = useState(false)
  const summary = useMemo(() => summariseLawn(sections), [sections])

  useEffect(() => {
    onEstimate(summary.estimate)
  }, [summary.estimate, onEstimate])

  function update(id: string, patch: Partial<LawnSection>) {
    setAdded(false)
    setSections((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function remove(id: string) {
    setAdded(false)
    setSections((current) => {
      const next = current.filter((item) => item.id !== id)
      return next.length > 0 ? next : [blankSection()]
    })
  }

  const estimate = summary.estimate
  const canUse = estimate != null && !summary.blocking

  return (
    <section id="lawn-size" aria-labelledby="lawn-size-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-8">
      <h2 id="lawn-size-heading" className="font-heading text-2xl font-bold tracking-tight">
        Estimate your lawn
      </h2>
      <p className="mt-2 text-muted-foreground">Measure roughly, we'll confirm on site.</p>

      <ul className="mt-5 grid gap-4">
        {sections.map((section, index) => {
          const state = sectionState(section)
          const sqm = sectionSqm(section)
          const needsB = section.shape !== 'circle'
          const nameId = `lawn-name-${section.id}`
          const aId = `lawn-a-${section.id}`
          const bId = `lawn-b-${section.id}`
          return (
            <li key={section.id} className="rounded-xl border border-border bg-background p-3 sm:p-4">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor={nameId}>Name</Label>
                  <Input
                    id={nameId}
                    value={section.name}
                    placeholder={index === 0 ? 'Front lawn' : index === 1 ? 'Back lawn' : 'Side strip'}
                    autoComplete="off"
                    onChange={(event) => update(section.id, { name: event.target.value })}
                    className={fieldClass}
                  />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Shape</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {shapes.map((shape) => {
                      const selected = section.shape === shape.id
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => update(section.id, { shape: shape.id })}
                          className={cn(
                            'min-h-11 rounded-lg border px-2 text-sm font-medium',
                            selected ? 'border-eucalypt bg-secondary text-secondary-foreground' : 'border-input bg-card',
                          )}
                        >
                          {shape.label}
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{shapeHint(section.shape)}</p>
                </fieldset>
                <div className={cn('grid gap-3', needsB && 'grid-cols-2')}>
                  <div className="grid gap-2">
                    <Label htmlFor={aId}>
                      {section.shape === 'circle' ? 'Distance across (m)' : section.shape === 'triangle' ? 'Base (m)' : 'Length (m)'}
                    </Label>
                    <Input
                      id={aId}
                      inputMode="decimal"
                      autoComplete="off"
                      value={section.a}
                      onChange={(event) => update(section.id, { a: event.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  {needsB ? (
                    <div className="grid gap-2">
                      <Label htmlFor={bId}>{section.shape === 'triangle' ? 'Height (m)' : 'Width (m)'}</Label>
                      <Input
                        id={bId}
                        inputMode="decimal"
                        autoComplete="off"
                        value={section.b}
                        onChange={(event) => update(section.id, { b: event.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm" aria-live="polite">
                    {state === 'ready' && sqm != null ? (
                      <span className="font-medium">{sqm} m²</span>
                    ) : state === 'invalid' ? (
                      <span className="text-destructive">Enter a number above 0.</span>
                    ) : state === 'incomplete' ? (
                      <span className="text-muted-foreground">Enter the measurements.</span>
                    ) : (
                      <span className="text-muted-foreground">Area shows here.</span>
                    )}
                  </p>
                  <Button type="button" variant="outline" className="h-11 bg-card px-3" onClick={() => remove(section.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="mt-4 h-11 w-full bg-background"
        onClick={() => {
          setAdded(false)
          setSections((current) => [...current, blankSection()])
        }}
      >
        Add a section
      </Button>

      <div className="mt-5 rounded-xl bg-eucalypt px-4 py-4 text-primary-foreground" aria-live="polite">
        {estimate ? (
          <>
            <p className="text-sm">Total</p>
            <p className="font-heading text-4xl tracking-tight">{estimate.sqm} m²</p>
            <p className="mt-2 w-fit rounded-full bg-brass px-3 py-1 text-sm font-medium text-ink">{bandLabel(estimate.band)}</p>
          </>
        ) : (
          <>
            <p className="font-heading text-2xl tracking-tight">No total yet</p>
            <p className="mt-1 text-sm text-primary-foreground/90">Enter a length and a width.</p>
          </>
        )}
      </div>

      {summary.blocking ? <p className="mt-3 text-sm text-muted-foreground">Finish each section, or remove it.</p> : null}

      <Button
        type="button"
        className="mt-4 h-11 w-full px-5 sm:w-auto"
        disabled={!canUse}
        onClick={() => {
          if (!estimate) return
          setAdded(true)
          onUse(estimate.block)
        }}
      >
        Use this in my quote
      </Button>
      {added ? (
        <p role="status" className="mt-2 text-sm">
          Added to the message in the form.
        </p>
      ) : null}
    </section>
  )
}
