/**
 * Indicative quote prices for the Get a quote page.
 *
 * Every amount is Australian dollars, ex-GST. The page labels each price
 * "indicative, ex-GST, confirmed on site". Change the numbers here.
 * Do not copy prices into components or into the enquiry code.
 *
 * Monthly and fortnightly discounts apply to the basic lawn service only.
 * Add-on amounts stay the same for every frequency.
 */

/** Shown beside prices on the page and copied into the quote message. */
export const priceDisclaimer = 'Indicative, ex-GST, confirmed on site.'

/**
 * Lawn size bands. The top of each band is inclusive: 100 m² is Small,
 * 250 m² is Medium, 500 m² is Large. Anything above Large is quoted on site
 * and the page shows no dollar total.
 */
export const sizeBands = {
  small: { label: 'Small', maxSqm: 100, range: 'up to 100 m²' },
  medium: { label: 'Medium', maxSqm: 250, range: '100–250 m²' },
  large: { label: 'Large', maxSqm: 500, range: '250–500 m²' },
} as const

export type PricedBand = keyof typeof sizeBands
export type SizeBand = PricedBand | 'over'

export const frequencyChoices = [
  { id: 'one-off', label: 'One-off' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'fortnightly', label: 'Fortnightly' },
] as const

export type Frequency = (typeof frequencyChoices)[number]['id']

/**
 * Basic lawn service: mow, whipper-snip the edges, blow down the paths.
 * Amounts are per visit.
 *
 * `oneOff` is a single visit.
 * A monthly visit is that price minus `monthlyDiscountPercent`.
 * `fortnightly` is the lower recurring price. The page shows the gap
 * between `fortnightly` and `oneOff` as the saving. Do not take the
 * monthly percent off the fortnightly price as well.
 */
export const basicLawn = {
  id: 'basic-lawn',
  name: 'Basic lawn service',
  detail: 'Mow, whipper-snip edges, blow down paths',
  oneOff: { small: 60, medium: 85, large: 120 },
  fortnightly: { small: 50, medium: 70, large: 100 },
} as const

/** Percent off the one-off basic lawn price when the visit is monthly. */
export const monthlyDiscountPercent = 5

type FlatAddon = {
  kind: 'flat'
  id: string
  name: string
  /** Dollars per visit. */
  price: number
  enabled: boolean
}

type SizedAddon = {
  kind: 'by-size'
  id: string
  name: string
  /** Dollars per visit for each lawn band. */
  prices: { small: number; medium: number; large: number }
  enabled: boolean
}

type CappedAddon = {
  kind: 'capped'
  id: string
  name: string
  /** Dollars per visit while the lawn is within includedUpToSqm. */
  price: number
  /** Above this area the line is quoted on site and the total is hidden. */
  includedUpToSqm: number
  enabled: boolean
}

type HourlyAddon = {
  kind: 'hourly'
  id: string
  name: string
  /** Dollars per hour. */
  hourly: number
  defaultHours: number
  /**
   * True: the hours are a guide only. The line is quoted on site and
   * the page shows no dollar total.
   */
  quotedOnSite: boolean
  enabled: boolean
}

type UnavailableAddon = {
  kind: 'unavailable'
  id: string
  name: string
  enabled: false
  note: string
}

export type Addon = FlatAddon | SizedAddon | CappedAddon | HourlyAddon | UnavailableAddon

/**
 * Extra lines under the basic lawn service.
 * `enabled: false` hides the line from customers.
 * Add a flat extra by copying a `kind: 'flat'` block and changing the price.
 */
export const addons = [
  {
    kind: 'flat',
    id: 'clippings',
    name: 'Take clippings away',
    price: 10,
    enabled: true,
  },
  {
    kind: 'flat',
    id: 'hard-edging',
    name: 'Hard edging',
    price: 20,
    enabled: true,
  },
  {
    kind: 'by-size',
    id: 'fertilise',
    name: 'Granular fertilise',
    prices: { small: 50, medium: 70, large: 90 },
    enabled: true,
  },
  {
    kind: 'capped',
    id: 'aeration',
    name: 'Aeration',
    price: 120,
    includedUpToSqm: 150,
    enabled: true,
  },
  {
    kind: 'hourly',
    id: 'tidy',
    name: 'Leaf and garden tidy-up',
    hourly: 55,
    defaultHours: 1,
    quotedOnSite: false,
    enabled: true,
  },
  {
    kind: 'hourly',
    id: 'overgrown',
    name: 'Overgrown first visit',
    hourly: 55,
    defaultHours: 1,
    quotedOnSite: true,
    enabled: true,
  },
  {
    // The owner is not licensed to apply herbicide yet.
    // Leave enabled: false so the line stays off the quote page.
    kind: 'unavailable',
    id: 'weed-spraying',
    name: 'Weed spraying',
    enabled: false,
    note: 'Hidden until the owner is licensed to spray weeds.',
  },
] as const satisfies readonly Addon[]
