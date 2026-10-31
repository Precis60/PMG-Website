import cleanup from '@/assets/photos/cleanup.jpg'
import hedging from '@/assets/photos/hedging.jpg'
import hero from '@/assets/photos/hero.jpg'
import irrigation from '@/assets/photos/irrigation.jpg'
import lawn from '@/assets/photos/lawn.jpg'
import lighting from '@/assets/photos/lighting.jpg'
import maintenance from '@/assets/photos/maintenance.jpg'
import outdoor from '@/assets/photos/outdoor.jpg'
import planting from '@/assets/photos/planting.jpg'
import plans from '@/assets/photos/plans.jpg'

export const business = {
  name: 'Precision Maintenance & Gardening',
  shortName: 'PMG',
  url: 'https://precisiongardening.com.au',
  phoneDisplay: '0413 729 663',
  phoneTel: '+61413729663',
  email: 'jamie@projects-consultant.com',
  owner: 'Jamie Anderson',
  facebook: 'https://www.facebook.com/profile.php?id=61595705055354',
  locality: 'Yarraville',
  region: 'VIC',
  country: 'AU',
  sister: {
    name: 'Precision Cabling & Automation',
    url: 'https://precisioncabling.com.au',
  },
} as const

export const logoUrl = `${import.meta.env.BASE_URL}logo.png`

export const heroImage = {
  src: hero,
  alt: 'Illustrative photo of a gravel path between trimmed flowering hedges.',
  width: 1600,
  height: 1000,
}

export type Service = {
  slug: string
  title: string
  summary: string
  detail: string
  includes: string[]
  note?: string
  sister?: boolean
  image: string
  imageAlt: string
  creditId: string
}

export const services: Service[] = [
  {
    slug: 'garden-maintenance',
    title: 'Garden maintenance',
    summary: 'Regular visits that keep the garden looking kept.',
    detail:
      'We weed, edge and tidy beds so the place stays under control. Book a one-off, or a fortnightly or monthly round.',
    includes: ['Weeding and bed tidy', 'Edges and blow-down', 'Light pruning'],
    image: maintenance,
    imageAlt: 'Illustrative photo of a trimmed hedge beside a mown lawn and flower border.',
    creditId: 'maintenance',
  },
  {
    slug: 'lawn-care',
    title: 'Lawn care',
    summary: 'Mowing and edges, finished so the lawn looks intentional.',
    detail:
      'We mow, edge and clear the clippings. The aim is a clean line, not just a shorter lawn.',
    includes: ['Mowing', 'Edging', 'Clippings cleared'],
    image: lawn,
    imageAlt: 'Illustrative photo of a close, even lawn.',
    creditId: 'lawn',
  },
  {
    slug: 'hedging-pruning',
    title: 'Hedging and pruning',
    summary: 'Hedges shaped and shrubs cut back so they sit right in the garden.',
    detail:
      'We trim hedges and prune shrubs so they stay healthy and in bounds. Large tree work is passed on.',
    includes: ['Hedge trimming', 'Shrub pruning', 'Shaping'],
    note: "We're not arborists. Big trees go to a qualified tree crew.",
    image: hedging,
    imageAlt: 'Illustrative photo of closely clipped hedges.',
    creditId: 'hedging',
  },
  {
    slug: 'garden-clean-ups',
    title: 'Garden clean-ups',
    summary: 'Overgrown corners and green waste cleared back to a usable garden.',
    detail:
      'When a garden has got away, we cut it back, clear the green waste and leave it usable again.',
    includes: ['Overgrowth cut back', 'Green waste removed', 'Paths and beds opened up'],
    image: cleanup,
    imageAlt: 'Illustrative photo of an overgrown garden with fallen branches and leaf litter.',
    creditId: 'cleanup',
  },
  {
    slug: 'mulching-planting',
    title: 'Mulching and planting',
    summary: 'Mulch and new plants, put in so beds hold water and look finished.',
    detail: 'We prepare beds, spread mulch and plant. You get a finished bed, not a pile of bags.',
    includes: ['Bed prep', 'Mulching', 'Planting'],
    image: planting,
    imageAlt: 'Illustrative photo of hands planting a seedling in soil.',
    creditId: 'planting',
  },
  {
    slug: 'irrigation',
    title: 'Irrigation install and repair',
    summary: 'Drippers, sprays and timers, installed or repaired.',
    detail:
      'We fit and fix garden irrigation: drippers, sprays and simple timers. Mains plumbing and backflow stay with a plumber.',
    includes: ['New garden lines', 'Repairs and heads', 'Timer setup'],
    note: "Not plumbing. We don't connect to the mains or work on backflow.",
    image: irrigation,
    imageAlt: 'Illustrative photo of a black drip-irrigation line on garden soil.',
    creditId: 'irrigation',
  },
  {
    slug: 'garden-lighting',
    title: 'Low-voltage garden lighting',
    summary: 'Path lights and uplights on low voltage, for a warm evening garden.',
    detail:
      'We fit 12-volt path lights and uplights. Anything on the mains needs a licensed electrician.',
    includes: ['Path lights', 'Tree and bed uplights', 'Low-voltage transformers'],
    note: "Low voltage only. We don't do mains electrical work.",
    sister: true,
    image: lighting,
    imageAlt: 'Illustration of warm path lights along a garden path at dusk.',
    creditId: 'lighting',
  },
  {
    slug: 'maintenance-plans',
    title: 'Regular maintenance plans',
    summary: 'A fortnightly or monthly visit so the garden does not get away.',
    detail: 'We agree the jobs and the rhythm, then turn up. You do not have to rebook every time.',
    includes: ['Agreed task list', 'Fortnightly or monthly', 'One person to call'],
    image: plans,
    imageAlt: 'Illustrative photo of a kept lawn enclosed by a trimmed hedge.',
    creditId: 'plans',
  },
  {
    slug: 'other-outdoor',
    title: 'Other outdoor jobs',
    summary: 'Small outdoor jobs that sit beside the garden work.',
    detail: "If it belongs with the garden, ask. If it doesn't, we'll say so before anyone wastes a trip.",
    includes: ['Odd outdoor jobs', 'Alongside a booked visit'],
    image: outdoor,
    imageAlt: 'Illustrative photo of someone watering a vegetable garden.',
    creditId: 'outdoor',
  },
]

export function serviceBySlug(slug: string | undefined) {
  if (!slug) return undefined
  return services.find((service) => service.slug === slug)
}

export const highlights = [
  {
    number: '01',
    title: 'Gardens',
    text: 'Maintenance, lawns, hedges, clean-ups and planting.',
    to: '/services/garden-maintenance',
  },
  {
    number: '02',
    title: 'Water',
    text: 'Irrigation installed and repaired. Garden lines only, not plumbing.',
    to: '/services/irrigation',
  },
  {
    number: '03',
    title: 'Light',
    text: 'Low-voltage path and garden lights. Not mains electrical.',
    to: '/services/garden-lighting',
  },
] as const

export const coreSuburbs = [
  'Yarraville',
  'Seddon',
  'Kingsville',
  'South Kingsville',
  'Spotswood',
  'Footscray',
  'West Footscray',
] as const

export const extendedSuburbs = [
  { name: 'Maidstone', note: '' },
  { name: 'Tottenham', note: '' },
  { name: 'Braybrook', note: '' },
  { name: 'Maribyrnong', note: '' },
  { name: 'Newport', note: '' },
  { name: 'Williamstown', note: '' },
  { name: 'Williamstown North', note: '' },
  { name: 'Altona North', note: '' },
  { name: 'Brooklyn', note: 'Mostly industrial. Fine for commercial grounds.' },
] as const

export const allSuburbNames = [
  ...coreSuburbs,
  ...extendedSuburbs.map((suburb) => suburb.name),
]

export const nav = [
  { to: '/services', label: 'Services' },
  { to: '/service-area', label: 'Service area' },
  { to: '/contact', label: 'Contact' },
] as const

export type PhotoCredit = {
  id: string
  use: string
  author: string
  license: string
  href: string
  changes: string
}

export const photoCredits: PhotoCredit[] = [
  {
    id: 'hero',
    use: 'Home hero',
    author: 'Unsplash',
    license: 'Unsplash Licence',
    href: 'https://unsplash.com/photos/1585320806297',
    changes: 'Cropped',
  },
  {
    id: 'maintenance',
    use: 'Garden maintenance',
    author: 'Confidence24',
    license: 'CC BY-SA 4.0',
    href: 'https://commons.wikimedia.org/wiki/File:Garden_landscape.jpg',
    changes: 'Cropped and compressed',
  },
  {
    id: 'lawn',
    use: 'Lawn care',
    author: 'Pexels',
    license: 'Pexels Licence',
    href: 'https://www.pexels.com/photo/580900/',
    changes: 'Cropped',
  },
  {
    id: 'hedging',
    use: 'Hedging and pruning',
    author: 'I. Sáček, senior',
    license: 'CC0',
    href: 'https://commons.wikimedia.org/wiki/File:Hedge_box_trimmed.JPG',
    changes: 'Cropped and compressed',
  },
  {
    id: 'cleanup',
    use: 'Garden clean-ups',
    author: 'Mr Ignavy',
    license: 'CC BY-SA 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:An_overgrown_garden_-_geograph.org.uk_-_7409929.jpg',
    changes: 'Cropped and compressed',
  },
  {
    id: 'planting',
    use: 'Mulching and planting',
    author: 'Pexels',
    license: 'Pexels Licence',
    href: 'https://www.pexels.com/photo/4207909/',
    changes: 'Cropped',
  },
  {
    id: 'irrigation',
    use: 'Irrigation',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:Drip_irrigation_system_installed_in_a_garden_for_efficient_water_management_during_summer.jpg',
    changes: 'Cropped and compressed',
  },
  {
    id: 'lighting',
    use: 'Low-voltage garden lighting',
    author: 'Precision Maintenance & Gardening',
    license: 'Original illustration',
    href: 'https://precisiongardening.com.au/',
    changes: 'Drawn for this site. Not a photograph of a job.',
  },
  {
    id: 'plans',
    use: 'Regular maintenance plans',
    author: 'Sebastian Ballard',
    license: 'CC BY-SA 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:Trim_hedge,_neat_lawn_and_a_bench_-_geograph.org.uk_-_1538832.jpg',
    changes: 'Cropped and compressed',
  },
  {
    id: 'outdoor',
    use: 'Other outdoor jobs',
    author: 'Pexels',
    license: 'Pexels Licence',
    href: 'https://www.pexels.com/photo/4750270/',
    changes: 'Cropped',
  },
]
