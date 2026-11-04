import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LawnEstimator } from '@/components/LawnEstimator'
import { PriceBuilder } from '@/components/PriceBuilder'
import { QuoteForm } from '@/components/QuoteForm'
import { Seo } from '@/components/Seo'
import { business, coreSuburbs } from '@/data/site'
import type { LawnEstimate } from '@/lib/lawn'
import type { NotePatch } from '@/lib/quote-notes'

function focusMessage() {
  const el = document.getElementById('message')
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  el.focus({ preventScroll: true })
}

export function QuotePage() {
  const [params] = useSearchParams()
  const preset = params.get('service') ?? ''
  const [estimate, setEstimate] = useState<LawnEstimate | null>(null)
  const [priceBlock, setPriceBlock] = useState('')
  const [patch, setPatch] = useState<NotePatch | null>(null)
  const [patchSeq, setPatchSeq] = useState(0)

  useEffect(() => {
    if (params.get('estimate') !== '1') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('lawn-size')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [params])

  function apply(next: { lawn?: string; price?: string }) {
    const seq = patchSeq + 1
    setPatchSeq(seq)
    setPatch({ seq, ...next })
    window.setTimeout(focusMessage, 0)
  }

  return (
    <>
      <Seo
        title="Get a quote | Precision Maintenance & Gardening"
        description="Ask Jamie Anderson for a garden, irrigation or low-voltage lighting quote in Yarraville and the inner west. Estimate your lawn on this page."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Get a quote.</h1>
        <p className="mt-3 max-w-xl text-lg">Tell us the suburb and the job. We'll come back with a time to look.</p>
        <p className="mt-2 max-w-xl text-muted-foreground">Estimate the lawn and build a price first, if you want to.</p>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="grid gap-8">
            <LawnEstimator onEstimate={setEstimate} onUse={(block) => apply({ lawn: block })} />
            <PriceBuilder estimate={estimate} onSummary={setPriceBlock} onUse={(block) => apply({ price: block })} />
            <QuoteForm
              key={preset || 'new'}
              preset={preset}
              patch={patch}
              blocks={{ lawn: estimate?.block ?? '', price: priceBlock }}
            />
          </div>
          <aside className="rounded-2xl border border-border bg-secondary p-5 text-sm">
            <h2 className="font-heading text-lg">Or call</h2>
            <p className="mt-2">{business.owner}</p>
            <p className="mt-1">
              <a className="font-medium text-eucalypt underline underline-offset-4" href={`tel:${business.phoneTel}`}>
                {business.phoneDisplay}
              </a>
            </p>
            <p className="mt-1">
              <a className="underline underline-offset-4" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </p>
            <p className="mt-4 text-muted-foreground">Core suburbs: {coreSuburbs.join(', ')}.</p>
          </aside>
        </div>
      </section>
    </>
  )
}
