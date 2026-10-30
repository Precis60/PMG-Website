import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { business } from '@/data/site'

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | Precision Maintenance & Gardening"
        description="Call or email Jamie Anderson at Precision Maintenance & Gardening. 0413 729 663."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Contact Jamie.</h1>
        <p className="mt-3 max-w-xl text-lg">Call, email, or send a quote request.</p>
        <dl className="mt-8 max-w-md space-y-4 text-lg">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd>{business.owner}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Phone</dt>
            <dd>
              <a className="text-eucalypt underline underline-offset-4" href={`tel:${business.phoneTel}`}>
                {business.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd>
              <a className="underline underline-offset-4" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-8">
          <Link className="font-medium text-eucalypt underline underline-offset-4" to="/quote">
            Get a quote
          </Link>
        </p>
      </section>
    </>
  )
}
