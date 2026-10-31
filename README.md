# Precision Maintenance & Gardening

Static marketing site for Precision Maintenance & Gardening, a Yarraville garden business: maintenance, irrigation and low-voltage garden lighting.

The future domain is [precisiongardening.com.au](https://precisiongardening.com.au). It is not registered yet, so this repo has no `CNAME`.

## Develop

```bash
npm install
npm run dev
```

The dev server is [http://127.0.0.1:4327](http://127.0.0.1:4327). Routes use a hash (`/#/services`) so the site can sit on any static host.

## Build

```bash
npm run build
npm run preview
```

`npm run build` typechecks, then writes `dist/`.

### Base path

Asset URLs follow Vite's `base`. The Pages workflow sets `VITE_BASE_PATH=/PMG-Website/` so the site works at `https://precis60.github.io/PMG-Website/`.

Local check of that build:

```bash
VITE_BASE_PATH=/PMG-Website/ npm run build
VITE_BASE_PATH=/PMG-Website/ npm run preview -- --host 127.0.0.1 --port 4331
```

Then open `http://127.0.0.1:4331/PMG-Website/`. Routes stay on the hash (`/#/services`). The production build copies `index.html` to `404.html` so GitHub Pages can still load the app for an unknown path.

## Deploy to GitHub Pages

Push to `main`. [`.github/workflows/pages.yml`](.github/workflows/pages.yml) enables Pages, builds with base `/PMG-Website/`, and deploys `dist/`.

If the first run cannot turn Pages on, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

### Custom domain

Do not add a `CNAME` until `precisiongardening.com.au` is registered. When it is:

1. In the workflow, set `VITE_BASE_PATH` to `/`.
2. Point the domain at the host.
3. Open Graph and LocalBusiness URLs in `index.html` already use `https://precisiongardening.com.au/`.

There is no ABN on the site. Street address is omitted on purpose. LocalBusiness JSON-LD uses Yarraville, VIC only.

## Quote form

`src/lib/enquiry.ts` exports `submitEnquiry`. The form always calls it.

- Return `true` when the enquiry is stored.
- Return `false`, or throw, and the form opens a mailto to jamie@projects-consultant.com.

There is no backend yet, so it returns `false`. A later change should insert one row into a Supabase `enquiries` table (anon insert only, or an Edge Function) and must not select the row back. Do not put a service-role key in this site.

The form includes a honeypot field (`pmg_hp`). If it is filled, the form shows thanks and sends nothing.

## Brand

- Eucalypt `#1F4D3A`, Brass `#C9A227`, Sandstone `#F5F3EE`, Charcoal `#23272A`, Sage `#A8BFA3`
- Headings: Manrope 700. Body: Inter.
- Logo, favicon and `public/og.jpg` use the approved PMG monogram.

## Photo credits

Pictures are illustrative. Authors and licences are on `/#/photo-credits`. CC BY and CC BY-SA images are cropped. The lighting card is an original illustration, not a photograph of a job.
