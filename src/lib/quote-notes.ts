export const lawnHeading = 'Lawn size'
export const priceHeading = 'Indicative price'

export type NotePatch = {
  seq: number
  lawn?: string
  price?: string
}

type NoteParts = {
  note: string
  lawn: string
  price: string
}

function headingAt(text: string, heading: string): number {
  const line = `${heading}\n`
  if (text.startsWith(line)) return 0
  const token = `\n\n${line}`
  const at = text.indexOf(token)
  return at === -1 ? -1 : at + 2
}

export function splitNotes(message: string): NoteParts {
  const text = message.replace(/\r\n/g, '\n').trim()
  const marks = [
    { key: 'lawn' as const, heading: lawnHeading },
    { key: 'price' as const, heading: priceHeading },
  ]
    .map((item) => ({ ...item, at: headingAt(text, item.heading) }))
    .filter((item) => item.at >= 0)
    .sort((a, b) => a.at - b.at)

  if (marks.length === 0) return { note: text, lawn: '', price: '' }

  const parts: NoteParts = {
    note: text.slice(0, marks[0].at).trim(),
    lawn: '',
    price: '',
  }

  marks.forEach((mark, index) => {
    const start = mark.at + mark.heading.length + 1
    const end = index + 1 < marks.length ? marks[index + 1].at : text.length
    parts[mark.key] = text.slice(start, end).trim()
  })

  return parts
}

export function joinNotes(parts: NoteParts): string {
  const chunks: string[] = []
  if (parts.note.trim()) chunks.push(parts.note.trim())
  if (parts.lawn.trim()) chunks.push(`${lawnHeading}\n${parts.lawn.trim()}`)
  if (parts.price.trim()) chunks.push(`${priceHeading}\n${parts.price.trim()}`)
  return chunks.join('\n\n')
}

/** Replace the generated lawn and price blocks. Customer notes above them stay put. */
export function mergeNotes(message: string, updates: { lawn?: string; price?: string }): string {
  const parts = splitNotes(message)
  if (updates.lawn !== undefined) parts.lawn = updates.lawn
  if (updates.price !== undefined) parts.price = updates.price
  return joinNotes(parts)
}
