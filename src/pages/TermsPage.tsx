import { Seo } from '@/components/Seo'
import { business } from '@/data/site'

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms | Precision Maintenance & Gardening"
        description="Plain terms for quotes and garden work from Precision Maintenance & Gardening. No mains electrical or plumbing."
      />
      <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Terms.</h1>
        <div className="mt-6 space-y-4 leading-relaxed">
          <p>Nothing on this site is a price or a promise to start work. A quote covers the job we describe, and work starts when you accept it.</p>
          <h2 className="pt-2 text-xl">The work</h2>
          <p>
            We maintain gardens, install and repair garden irrigation, and fit low-voltage garden lighting. We do not do mains-voltage electrical work. We do not do plumbing, including mains connections and backflow.
          </p>
          <p>Large tree work is not ours. We'll say so and you can bring in a qualified crew.</p>
          <h2 className="pt-2 text-xl">Visits</h2>
          <p>You provide safe access. Weather can move a day. Jobs outside the core suburbs may include a travel fee, named before we book.</p>
          <h2 className="pt-2 text-xl">The law</h2>
          <p>
            Australian Consumer Law still applies. These terms don't limit rights that can't be limited. Questions go to {business.owner} at {business.email}.
          </p>
        </div>
      </article>
    </>
  )
}
