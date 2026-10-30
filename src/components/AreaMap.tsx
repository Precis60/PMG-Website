type Place = {
  name: string
  x: number
  y: number
  kind: 'core' | 'extended'
}

const places: Place[] = [
  { name: 'Braybrook', x: 210, y: 122, kind: 'extended' },
  { name: 'Maribyrnong', x: 546, y: 48, kind: 'extended' },
  { name: 'Maidstone', x: 374, y: 116, kind: 'extended' },
  { name: 'Tottenham', x: 274, y: 220, kind: 'extended' },
  { name: 'West Footscray', x: 401, y: 208, kind: 'core' },
  { name: 'Footscray', x: 610, y: 226, kind: 'core' },
  { name: 'Brooklyn', x: 110, y: 337, kind: 'extended' },
  { name: 'Kingsville', x: 419, y: 282, kind: 'core' },
  { name: 'Seddon', x: 556, y: 263, kind: 'core' },
  { name: 'Yarraville', x: 519, y: 325, kind: 'core' },
  { name: 'Altona North', x: 137, y: 435, kind: 'extended' },
  { name: 'South Kingsville', x: 365, y: 398, kind: 'core' },
  { name: 'Spotswood', x: 483, y: 417, kind: 'core' },
  { name: 'Newport', x: 456, y: 497, kind: 'extended' },
  { name: 'Williamstown North', x: 510, y: 564, kind: 'extended' },
  { name: 'Williamstown', x: 592, y: 632, kind: 'extended' },
]

function labelFor(place: Place) {
  if (place.name === 'South Kingsville') return { x: place.x - 16, y: place.y + 4, anchor: 'end' as const }
  if (place.name === 'Maribyrnong') return { x: place.x, y: place.y + 24, anchor: 'middle' as const }
  if (place.name === 'Footscray' || place.name === 'Williamstown' || place.name === 'Williamstown North') {
    return { x: place.x, y: place.y - 16, anchor: 'middle' as const }
  }
  return { x: place.x + 16, y: place.y + 4, anchor: 'start' as const }
}

export function AreaMap() {
  return (
    <figure>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <svg viewBox="0 0 720 680" className="h-auto min-w-[640px] w-full" aria-hidden="true">
          <rect width="720" height="680" fill="#F5F3EE" />
          {places.map((place) => {
            const radius = place.name === 'Yarraville' ? 11 : 7
            const label = labelFor(place)
            return (
              <g key={place.name}>
                {place.kind === 'core' ? (
                  <circle cx={place.x} cy={place.y} r={radius} fill="#1F4D3A" />
                ) : (
                  <circle cx={place.x} cy={place.y} r={radius} fill="#F5F3EE" stroke="#1F4D3A" strokeWidth="2" />
                )}
                {place.name === 'Yarraville' ? (
                  <circle cx={place.x} cy={place.y} r="16" fill="none" stroke="#C9A227" strokeWidth="2" />
                ) : null}
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor}
                  fill="#23272A"
                  fontFamily="Inter Variable, Inter, sans-serif"
                  fontSize="14"
                >
                  {place.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        Schematic only, not to scale. The brass ring marks Yarraville, the centre of the core area. Filled dots are
        core suburbs. Open dots are extended.
      </figcaption>
    </figure>
  )
}
