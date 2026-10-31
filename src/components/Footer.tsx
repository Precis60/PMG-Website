import { Link } from 'react-router-dom'
import { business, logoUrl } from '@/data/site'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border bg-eucalypt text-primary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logoUrl} alt="" width={56} height={56} className="size-14" />
          <p className="font-heading mt-3 text-lg leading-tight">{business.name}</p>
          <p className="mt-2 max-w-xs text-sm text-primary-foreground/85">
            Garden maintenance, irrigation and low-voltage lighting. Yarraville and Melbourne's inner west.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-wide text-primary-foreground/70">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{business.owner}</li>
            <li>
              <a className="underline-offset-4 hover:underline" href={`tel:${business.phoneTel}`}>
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </li>
            <li>
              <a
                className="underline-offset-4 hover:underline"
                href={business.facebook}
                rel="noopener noreferrer"
                target="_blank"
              >
                Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-wide text-primary-foreground/70">On this site</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="underline-offset-4 hover:underline" to="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="underline-offset-4 hover:underline" to="/service-area">
                Service area
              </Link>
            </li>
            <li>
              <Link className="underline-offset-4 hover:underline" to="/quote">
                Get a quote
              </Link>
            </li>
            <li>
              <Link className="underline-offset-4 hover:underline" to="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="underline-offset-4 hover:underline" to="/terms">
                Terms
              </Link>
            </li>
            <li>
              <Link className="underline-offset-4 hover:underline" to="/photo-credits">
                Photo credits
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-primary-foreground/80 sm:px-6">
          <p>
            Sister business:{' '}
            <a
              href={business.sister.url}
              className="underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              {business.sister.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p>Photographs are illustrative, not photos of our jobs.</p>
          <p>© {year} {business.name}</p>
        </div>
      </div>
    </footer>
  )
}
