import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found | Precision Maintenance & Gardening" description="That page isn't on the Precision Maintenance & Gardening site." />
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="section-title">That page isn't here.</h1>
        <p className="mt-3 text-lg">Try the services list, or ask for a quote.</p>
        <p className="mt-6 flex flex-wrap gap-4">
          <Link className="font-medium text-eucalypt underline underline-offset-4" to="/">
            Home
          </Link>
          <Link className="font-medium text-eucalypt underline underline-offset-4" to="/services">
            Services
          </Link>
          <Link className="font-medium text-eucalypt underline underline-offset-4" to="/quote">
            Get a quote
          </Link>
        </p>
      </section>
    </>
  )
}
