import { Seo } from '@/components/Seo'
import { business } from '@/data/site'

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy | Precision Maintenance & Gardening"
        description="How Precision Maintenance & Gardening handles name, phone, email and job details from the quote form."
      />
      <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Privacy.</h1>
        <div className="mt-6 space-y-4 leading-relaxed">
          <p>
            {business.name} is run by {business.owner}. Contact {business.email} or {business.phoneDisplay} about anything on this page.
          </p>
          <h2 className="pt-2 text-xl">What the form collects</h2>
          <p>
            The quote form asks for your name, phone, email, suburb, the services you want, an optional date and an optional message.
            A hidden field is there to catch spam. If that field is filled in, the message is dropped.
          </p>
          <h2 className="pt-2 text-xl">How it is sent</h2>
          <p>
            This site does not store enquiries yet. Sending the form opens an email to us on your device. We use those details only to reply and quote the job.
          </p>
          <p>If we later store enquiries online, this page will be updated first.</p>
          <h2 className="pt-2 text-xl">Sharing</h2>
          <p>We keep these details so we can reply. We don't sell them. This site has no advertising trackers.</p>
          <h2 className="pt-2 text-xl">Deleting a message</h2>
          <p>Email {business.email} and ask. We'll delete what you sent us, unless we need to keep it for a legal reason.</p>
        </div>
      </article>
    </>
  )
}
