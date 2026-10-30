import { Seo } from '@/components/Seo'
import { photoCredits } from '@/data/site'

export function CreditsPage() {
  return (
    <>
      <Seo
        title="Photo credits | Precision Maintenance & Gardening"
        description="Sources and licences for the illustrative photographs on this site."
      />
      <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="section-title">Photo credits.</h1>
        <p className="mt-3 text-lg">These pictures show the kind of work. They are not jobs we have done.</p>
        <ul className="mt-6 space-y-4">
          {photoCredits.map((credit) => (
            <li key={credit.id}>
              <p className="font-medium">{credit.use}</p>
              <p className="text-sm text-muted-foreground">
                {credit.author}. {credit.license}. {credit.changes}{' '}
                <a className="text-eucalypt underline underline-offset-4" href={credit.href} rel="noopener noreferrer" target="_blank">
                  Source
                  <span className="sr-only"> for {credit.use} (opens in a new tab)</span>
                </a>
              </p>
            </li>
          ))}
        </ul>
      </article>
    </>
  )
}
