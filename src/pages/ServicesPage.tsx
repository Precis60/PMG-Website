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
            <li key={item.slug}>
              <Link
                to={`/services/${item.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalypt"
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1200}
                  height={900}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="flex flex-1 flex-col p-4">
                  <h2 className="text-xl">{item.title}</h2>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</span>
                  <span className="mt-4 text-sm font-medium text-eucalypt">Details</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ServiceDialog service={service} />
    </>
  )
}
