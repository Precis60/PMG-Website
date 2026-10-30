import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { heroImage, highlights } from '@/data/site'

export function HomePage() {
  return (
    <>
      <Seo
        title="Precision Maintenance & Gardening | Yarraville"
        description="Garden maintenance, irrigation and low-voltage lighting in Yarraville and Melbourne's inner west. Quotes from Jamie Anderson."
      />
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 sm:px-6 sm:pt-16">
        <p className="text-sm font-medium tracking-[0.16em] text-eucalypt uppercase">Yarraville and the inner west</p>
        <h1 className="display mt-3 max-w-4xl text-balance">Tidy gardens, smart water, good light.</h1>
        <p className="mt-4 max-w-xl text-lg">Done properly, first time.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-11 px-5">
            <Link to="/quote">Get a quote</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 bg-background px-5">
            <Link to="/services">Our services</Link>
          </Button>
        </div>
        <figure className="mt-10">
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            fetchPriority="high"
            decoding="async"
            className="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          <figcaption className="mt-2 text-sm text-muted-foreground">Illustrative photograph.</figcaption>
        </figure>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="work-heading">
        <h2 id="work-heading" className="section-title">
          Gardens, water and light.
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <li key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-medium text-eucalypt">{item.number}</p>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.text}</p>
              <Link to={item.to} className="mt-4 inline-flex min-h-11 items-center font-medium text-eucalypt underline-offset-4 hover:underline">
                Read the detail
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-eucalypt px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">Tell us the job.</h2>
          <p className="mt-3 max-w-lg text-primary-foreground/90">A quote starts with the suburb and what you want done.</p>
          <Button asChild className="mt-6 h-11 bg-background px-5 text-primary hover:bg-white">
            <Link to="/quote">Get a quote</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
