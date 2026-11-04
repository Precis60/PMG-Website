import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { ServiceDialog } from '@/components/ServiceDialog'
import { serviceBySlug, services } from '@/data/site'

export function ServicesPage() {
  const { slug } = useParams()
  const service = serviceBySlug(slug)
  const title = service
    ? `${service.title} | Precision Maintenance & Gardening`
    : 'Services | Precision Maintenance & Gardening'

  return (
    <>
      <Seo
        title={title}
        description="Garden maintenance, lawn care, hedging, clean-ups, mulching, irrigation, low-voltage lighting and regular plans."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="section-title">What we take on.</h1>
        <p className="mt-3 max-w-xl text-lg">Maintenance, irrigation and low-voltage lighting. Tap a card for the detail.</p>
        {slug && !service ? (
          <p role="status" className="mt-4 text-sm">
            That service isn't listed.{' '}
            <Link className="text-eucalypt underline underline-offset-4" to="/services">
              Back to the cards.
            </Link>
          </p>
        ) : null}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, index) => (
            <li key={item.slug} className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
              <Link
                to={`/services/${item.slug}`}
                className={`flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalypt ${item.slug === 'lawn-care' ? 'rounded-t-2xl' : 'rounded-2xl'}`}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1200}
                  height={900}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                  className="aspect-[4/3] w-full rounded-t-2xl object-cover"
                />
                <span className="flex flex-1 flex-col p-4">
                  <h2 className="text-xl">{item.title}</h2>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</span>
                  <span className="mt-4 text-sm font-medium text-eucalypt">Details</span>
                </span>
              </Link>
              {item.slug === 'lawn-care' ? (
                <Link
                  to="/quote?service=lawn-care&estimate=1"
                  className="inline-flex min-h-11 items-center rounded-b-2xl border-t border-border px-4 text-sm font-medium text-eucalypt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalypt"
                >
                  Estimate your lawn
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <ServiceDialog service={service} />
    </>
  )
}
