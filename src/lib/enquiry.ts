import { business } from '@/data/site'

export type Enquiry = {
  name: string
  phone: string
  email: string
  suburb: string
  services: string[]
  preferredDate: string | null
  message: string
}

/**
 * Send a quote enquiry.
 *
 * Plug the body in later so it inserts one row into the Supabase
 * `enquiries` table (anon insert only, or an Edge Function). Suggested
 * columns: name, phone, email, suburb, services (text[]), preferred_date
 * (date, nullable), message, created_at. Do not select the row back.
 *
 * Return true when the enquiry is stored. Return false, or throw, and the
 * form opens a mailto to Jamie instead.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<boolean> {
  void enquiry
  return false
}

export function enquiryMailto(enquiry: Enquiry) {
  const subject = `Quote enquiry from ${enquiry.name}`
  const body = [
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email}`,
    `Suburb: ${enquiry.suburb}`,
    `Services: ${enquiry.services.join(', ')}`,
    `Preferred date: ${enquiry.preferredDate ?? 'Not specified'}`,
    '',
    enquiry.message || 'No message.',
  ].join('\n')

  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
