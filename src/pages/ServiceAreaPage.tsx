import { Link } from 'react-router-dom'
import { AreaMap } from '@/components/AreaMap'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { coreSuburbs, extendedSuburbs } from '@/data/site'

export function ServiceAreaPage() {
  return (
    <>
      <Seo
        title="Service area | Precision Maintenance & Gardening"
        description="Garden work in Yarraville, Seddon, Kingsville, South Kingsville, Spotswood, Footscray, West Footscray and nearby inner-west suburbs."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Yarraville and the inner west.</h1>
        <p className="mt-3 max-w-xl text-lg">Core suburbs first. Extended suburbs by arrangement, sometimes with a travel fee.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <AreaMap />
          <div className="grid gap-8">
            <div>
              <h2 className="text-xl">Core suburbs</h2>
              <ul className="mt-3 space-y-2">
                {coreSuburbs.map((suburb) => (
                  <li key={suburb}>{suburb}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl">Extended suburbs</h2>
              <ul className="mt-3 space-y-2">
                {extendedSuburbs.map((suburb) => (
                  <li key={suburb.name}>
                    {suburb.name}
                    {suburb.note ? <span className="mt-0.5 block text-sm text-muted-foreground">{suburb.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          Jobs past the core suburbs may include a travel fee. We'll say so before we book.
        </p>
        <Button asChild className="mt-6 h-11 px-5">
          <Link to="/quote">Get a quote</Link>
        </Button>
      </section>
    </>
  )
}
