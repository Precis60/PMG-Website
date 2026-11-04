import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { business, type Service } from '@/data/site'

export function ServiceDialog({ service }: { service: Service | undefined }) {
  const navigate = useNavigate()

  return (
    <Dialog
      open={Boolean(service)}
      onOpenChange={(open) => {
        if (!open) navigate('/services')
      }}
    >
      {service ? (
        <DialogContent className="flex max-h-[min(92vh,46rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <div className="overflow-y-auto">
            <img
              src={service.image}
              alt={service.imageAlt}
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="grid gap-4 p-5 sm:p-6">
              <div>
                <DialogTitle className="font-heading text-2xl font-bold tracking-tight">{service.title}</DialogTitle>
                <DialogDescription className="mt-2 text-base text-foreground">{service.detail}</DialogDescription>
              </div>
              <div>
                <h3 className="text-sm font-medium">Includes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {service.note ? (
                <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{service.note}</p>
              ) : null}
              {service.sister ? (
                <p className="text-sm">
                  For control of lights or irrigation from your phone, see our sister business,{' '}
                  <a
                    href={business.sister.url}
                    className="text-eucalypt underline underline-offset-4"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {business.sister.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  .
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">Illustrative image. Not a photo of our work.</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-11 px-4">
                  <Link to={`/quote?service=${service.slug}`}>Ask for this in a quote</Link>
                </Button>
                {service.slug === 'lawn-care' ? (
                  <Button asChild variant="outline" className="h-11 bg-background px-4">
                    <Link to="/quote?service=lawn-care&estimate=1">Estimate your lawn</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
