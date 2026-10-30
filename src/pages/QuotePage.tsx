import { useSearchParams } from 'react-router-dom'
import { QuoteForm } from '@/components/QuoteForm'
import { Seo } from '@/components/Seo'
import { business, coreSuburbs } from '@/data/site'

export function QuotePage() {
  const [params] = useSearchParams()
  const preset = params.get('service') ?? ''

  return (
    <>
      <Seo
        title="Get a quote | Precision Maintenance & Gardening"
        description="Ask Jamie Anderson for a garden, irrigation or low-voltage lighting quote in Yarraville and the inner west."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Get a quote.</h1>
        <p className="mt-3 max-w-xl text-lg">Tell us the suburb and the job. We'll come back with a time to look.</p>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <QuoteForm key={preset || 'new'} preset={preset} />
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
