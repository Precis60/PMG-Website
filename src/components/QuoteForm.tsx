import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { business, coreSuburbs, extendedSuburbs, serviceBySlug, services } from '@/data/site'
import { enquiryMailto, submitEnquiry, type Enquiry } from '@/lib/enquiry'

const fieldClass = 'h-11 bg-background text-base md:text-base'

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'suburb' | 'other' | 'services' | 'date' | 'message', string>>

function todayValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function validate(values: {
  name: string
  phone: string
  email: string
  suburb: string
  other: string
  selected: string[]
  date: string
  message: string
}): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your name.'
  const digits = values.phone.replace(/\D/g, '')
  if (digits.length < 8) errors.phone = 'Enter a phone number we can call.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (!values.suburb) errors.suburb = 'Choose a suburb.'
  if (values.suburb === 'Other' && values.other.trim().length < 2) errors.other = 'Tell us the suburb.'
  if (values.selected.length === 0) errors.services = 'Choose at least one service.'
  if (values.date && values.date < todayValue()) errors.date = 'Choose today or a later date.'
  if (values.message.length > 1500) errors.message = 'Keep the message under 1,500 characters.'
  return errors
}

export function QuoteForm({ preset }: { preset: string }) {
  const presetService = serviceBySlug(preset)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [suburb, setSuburb] = useState('')
  const [other, setOther] = useState('')
  const [selected, setSelected] = useState<string[]>(presetService ? [presetService.slug] : [])
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [phase, setPhase] = useState<'edit' | 'sending' | 'stored' | 'email'>('edit')
  const [mailto, setMailto] = useState('')
  const [sentName, setSentName] = useState('')

  function toggle(slug: string, checked: boolean) {
    setSelected((current) => {
      if (checked) return current.includes(slug) ? current : [...current, slug]
      return current.filter((item) => item !== slug)
    })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate({ name, phone, email, suburb, other, selected, date, message })
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      const id = first === 'services' ? 'service-garden-maintenance' : first === 'other' ? 'other-suburb' : first
      document.getElementById(id)?.focus()
      return
    }

    if (honeypot.trim()) {
      setSentName(name.trim())
      setPhase('stored')
      return
    }

    const enquiry: Enquiry = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      suburb: suburb === 'Other' ? other.trim() : suburb,
      services: services.filter((service) => selected.includes(service.slug)).map((service) => service.title),
      preferredDate: date || null,
      message: message.trim(),
    }

    setPhase('sending')
    let stored = false
    try {
      stored = await submitEnquiry(enquiry)
    } catch {
      stored = false
    }

    setSentName(enquiry.name)
    if (stored) {
      setPhase('stored')
      return
    }

    const href = enquiryMailto(enquiry)
    setMailto(href)
    setPhase('email')
    window.location.href = href
  }

  if (phase === 'stored') {
    return (
      <div role="status" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-2xl">Thanks, {sentName}.</h2>
        <p className="mt-2 text-muted-foreground">We'll be in touch about the job.</p>
      </div>
    )
  }

  if (phase === 'email') {
    return (
      <div role="status" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-2xl">Nearly there.</h2>
        <p className="mt-2 text-muted-foreground">
          Your email app should open with this enquiry. Send it to reach us. If it didn't open, use the button.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="h-11 px-4">
            <a href={mailto}>Open the email</a>
          </Button>
          <Button type="button" variant="outline" className="h-11 px-4" onClick={() => setPhase('edit')}>
            Edit the form
          </Button>
        </div>
      </div>
    )
  }

  const errorItems = Object.values(errors)

  return (
    <form className="relative rounded-2xl border border-border bg-card p-5 sm:p-8" onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted-foreground">
        Name, phone, email, suburb and at least one service are required. We use this only to reply.{' '}
        <Link className="text-eucalypt underline underline-offset-4" to="/privacy">
          Privacy
        </Link>
      </p>
      {presetService ? (
        <p className="mt-3 text-sm">We've ticked {presetService.title}. Change anything that isn't right.</p>
      ) : null}

      {errorItems.length > 0 ? (
        <div role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <p>Check these before sending:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClass}
            required
          />
          {errors.name ? (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={fieldClass}
            required
          />
          {errors.phone ? (
            <p id="phone-error" className="text-sm text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass}
            required
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="suburb">Suburb</Label>
          <select
            id="suburb"
            name="suburb"
            value={suburb}
            onChange={(event) => setSuburb(event.target.value)}
            aria-invalid={errors.suburb ? true : undefined}
            aria-describedby={errors.suburb ? 'suburb-error' : undefined}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            required
          >
            <option value="">Select a suburb</option>
            <optgroup label="Core">
              {coreSuburbs.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
            <optgroup label="Extended">
              {extendedSuburbs.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </optgroup>
            <option value="Other">Other</option>
          </select>
          {errors.suburb ? (
            <p id="suburb-error" className="text-sm text-destructive">
              {errors.suburb}
            </p>
          ) : null}
        </div>
        {suburb === 'Other' ? (
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="other-suburb">Which suburb?</Label>
            <Input
              id="other-suburb"
              name="other-suburb"
              value={other}
              onChange={(event) => setOther(event.target.value)}
              aria-invalid={errors.other ? true : undefined}
              aria-describedby={errors.other ? 'other-error' : undefined}
              className={fieldClass}
            />
            {errors.other ? (
              <p id="other-error" className="text-sm text-destructive">
                {errors.other}
              </p>
            ) : null}
          </div>
        ) : null}
        <fieldset
          className="grid gap-2 sm:col-span-2"
          aria-invalid={errors.services ? true : undefined}
          aria-describedby={errors.services ? 'services-error' : undefined}
        >
          <legend className="text-sm font-medium">Services</legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {services.map((service) => {
              const id = `service-${service.slug}`
              const checked = selected.includes(service.slug)
              return (
                <li key={service.slug}>
                  <div className="flex min-h-11 items-center gap-3 rounded-md border border-input bg-background px-3">
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(value) => toggle(service.slug, value === true)}
                      className="size-5"
                    />
                    <Label htmlFor={id} className="flex-1 cursor-pointer py-3 font-normal">
                      {service.title}
                    </Label>
                  </div>
                </li>
              )
            })}
          </ul>
          {errors.services ? (
            <p id="services-error" className="text-sm text-destructive">
              {errors.services}
            </p>
          ) : null}
        </fieldset>
        <div className="grid gap-2">
          <Label htmlFor="date">Preferred date</Label>
          <Input
            id="date"
            name="preferred-date"
            type="date"
            min={todayValue()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? 'date-error' : 'date-hint'}
            className={fieldClass}
          />
          <p id="date-hint" className="text-sm text-muted-foreground">
            Optional.
          </p>
          {errors.date ? (
            <p id="date-error" className="text-sm text-destructive">
              {errors.date}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            maxLength={1500}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-error' : 'message-hint'}
            className="min-h-32 bg-background text-base md:text-base"
          />
          <p id="message-hint" className="text-sm text-muted-foreground">
            Optional. Access notes, what you want done.
          </p>
          {errors.message ? (
            <p id="message-error" className="text-sm text-destructive">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="pmg_hp">Leave this empty</label>
        <input
          id="pmg_hp"
          name="pmg_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <Button type="submit" className="mt-6 h-11 px-5" disabled={phase === 'sending'}>
        {phase === 'sending' ? 'Sending…' : 'Send enquiry'}
      </Button>
      <p className="mt-3 text-sm text-muted-foreground">
        Or call {business.owner} on{' '}
        <a className="text-eucalypt underline underline-offset-4" href={`tel:${business.phoneTel}`}>
          {business.phoneDisplay}
        </a>
        .
      </p>
    </form>
  )
}
