# Architecture

Next.js 13 (**pages router**), plain CSS + CSS Modules, no TypeScript. For step-by-step edits see
`docs/EDITING_GUIDE.md`.

## Folder map

```
pages/                 one file = one URL (pages/about-us.js → /about-us)
  _app.js              site-wide layout: header, footer, global CSS, floating contact buttons
  _document.js         <html>/<head> shell (fonts, preloads)
  api/google-reviews.js  server route: /api/google-reviews (Google reviews, cached)
  property/…           property detail pages
  property-listing/[type]/[name].js   listing pages (/property-listing/city/gurgaon, /search/…)
  compare.js, shortlist.js, our-services.js, about-us.js, …
components/
  home/                home page sections (hero, search, premium picks, reviews, shorts…)
  property-listing/    listing page cards, filters, ad, details modal
  property-detail/     property page sections (gallery, config, map, FAQ, EMI…)
  compare/             compare feature (store + toggle + tray)
  shared/              reused everywhere: search/, shortlist/, skeleton/, forms/, MapFacade,
                       DeveloperShowcase, BottomCta, LazyOnVisible, useScrollReveal
  lib/                 API helpers and config: ajax.js, ajax1.js, propertyApi.js, cityUtils.js,
                       siteConfig.js (phone/WhatsApp), FormApi.jsx
  layout/              Header, Footer, mobile navigation
styles/                global CSS; tokens.css = design tokens (colours, fonts, spacing)
public/                images/fonts served as-is (public/banner/hero, public/services, public/maps)
docs/                  this file + EDITING_GUIDE.md
```

## Page → main components

| URL                              | Page file                                 | Main components                                                                                                                                                                                                             |
| -------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                              | `pages/index.js`                          | `home/BannerVideo` + `BrandSlide` (hero), `home/search/SearchOptions`, `home/premium-picks/*`, `home/localities/*`, `home/services/*`, `home/reviews/*`, `home/testimonials/*`, `home/shorts/*`, `shared/DeveloperShowcase` |
| `/property-listing/city/gurgaon` | `pages/property-listing/[type]/[name].js` | `property-listing/PropertyListingCard(Mobile)`, `CardExtras`, `ListingAd`, `ListingDetailsModal`, `content/AboutSection`, compare + shortlist buttons                                                                       |
| `/property/<slug>`               | `pages/property/…`                        | `property-detail/*` (`PropertyMediaGallery`, `Config`, `Developer`, `SiteVisitBanner`, `Faq`…), `shared/MapFacade`                                                                                                          |
| `/our-services`                  | `pages/our-services.js`                   | self-contained page + `shared/BottomCta`                                                                                                                                                                                    |
| `/about-us`                      | `pages/about-us.js`                       | `components/about/*`                                                                                                                                                                                                        |
| `/compare`                       | `pages/compare.js`                        | `components/compare/*`                                                                                                                                                                                                      |
| `/shortlist`                     | `pages/shortlist.js`                      | `components/shared/shortlist/*`                                                                                                                                                                                             |

## Data flow

- **Main API**: `https://apitest.inframantra.com/api/v1` (`apiUrl1` in `next.config.js`), called via
  `components/lib/ajax1.js` (`Ajax1({ url: "/suggest", … })`). Older code uses `ajax.js` with
  `apiUrl` (`https://api.inframantra.com/api`).
  - `/property/citywise/<city>` — listing data (`components/lib/propertyApi.js`)
  - `/suggest` — search-box suggestions while typing (`shared/search/SearchAutocomplete.jsx`)
  - `/search` — search results for the listing page
  - `/developer` — developer names + logos (About page, `DeveloperShowcase`)
  - enquiry forms post leads through `components/lib/FormApi.jsx` / `shared/forms/*`
- **Blog/news**: WordPress at `https://cms.inframantra.com/wp-json/wp/v2/posts`.
- **Google reviews**: `/api/google-reviews` (server route); static fallback in
  `components/home/reviews/googleReviews.js`.
- **Browser-only state**: compare list and shortlist are saved in `localStorage` (no server).

## Shared systems

- **Design tokens** — `styles/tokens.css`. Use `var(--…)` for colours/fonts.
- **Skeletons** (loading placeholders) — `components/shared/skeleton/Skeleton.jsx`; home-page
  specific ones in `components/home/HomeSkeletons.jsx`.
- **Scroll reveal** — `components/shared/useScrollReveal.js` (fade-in on scroll; respects reduced motion).
- **Lazy sections** — `components/shared/LazyOnVisible.jsx` renders a section only when near screen.
- **Compare** — `components/compare/compareStore.js` is a tiny store; any component can read/
  toggle it. `CompareTray` shows the bottom bar.
- **Shortlist** — `components/shared/shortlist/shortlistStore.js` + `HeartButton`.
- **MapFacade** — `components/shared/MapFacade.jsx` shows a static map image
  (`public/maps/`) and only loads the real Google Map on click (saves page weight).
- **Card buttons** — `components/shared/CardButtons.module.css`, shared by listing cards.
- **Contact details** — `components/lib/siteConfig.js`.

## Conventions

- **Prettier**: `.prettierrc` — printWidth 100, double quotes, semicolons, CRLF line endings.
- **ESLint**: `npm run lint` must report 0 errors.
- **CSS class prefixes**: CSS-module names are _not hashed_ (`WANT_HASH = false` in
  `next.config.js`), so every class is effectively global. Prefix classes per file
  (e.g. `la…` in ListingAd, `sv-…` in SiteVisitBanner) to avoid clashes.
- **Comments**: each feature file starts with a short block saying what it does, where it is
  used and which file to edit for common changes. Keep it updated when you change behaviour.
- **Images**: provide `.avif` + `.webp` at 2 sizes; bump a `?v=` version when replacing a file
  with the same name.
