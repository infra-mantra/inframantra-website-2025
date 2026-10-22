# Editing Guide — "How do I…?"

Plain recipes for common changes. Paths are from the repo root. After any change, run the
site locally (`npm run dev`, open http://localhost:3000) and check the page you touched.

---

## Home page hero

**Change a hero slide (name, price, BHK, location, link, photo)**

1. Open `components/home/heroProjects.js`. Each project is one object in `PROJECTS`.
2. Edit the text fields (price, BHK, location, slug).
3. Photos live in `public/banner/hero/`. Each photo has several sizes/formats (`.avif` + `.webp`,
   desktop and mobile widths). Replace **all** sizes with the same file names.
4. Bump `PHOTO_VERSION` at the top of `heroProjects.js` (e.g. `"?v=13"` → `"?v=14"`). This
   forces browsers/CDN to download the new photo instead of a cached one.

**Brand (first) slide** — `components/home/BrandSlide.jsx` (+ `BrandSlide.module.css`); its images
are `public/banner/hero/brand-*.avif/.webp`. The slider itself is `components/home/BannerVideo.jsx`.

---

## Search

| I want to…                                                                | Edit                                                                                                                                           |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Change the typing hints in the search box                                 | `SEARCH_HINTS` in `components/shared/search/useTypewriterHint.js`                                                                              |
| Change filter options (cities, BHK, budget, status, unit type)            | `components/shared/search/searchFilterConfig.js` (`CITIES`, `BHK_OPTIONS`, `BUDGET_OPTIONS`, `STATUS_OPTIONS`, `UNIT_OPTIONS`, `BUDGET_STEPS`) |
| Change "popular searches" chips                                           | `POPULAR_SEARCHES` in the same file                                                                                                            |
| Change how a typed sentence ("3 bhk in gurgaon under 2 cr") is understood | `components/shared/search/parseSearchSentence.js`                                                                                              |
| Change the projects suggested per city                                    | `components/shared/search/cityProjects.js`                                                                                                     |

## Add a city

1. `components/lib/cityUtils.js` — add it to `CITY_MAP` (all spellings → one name) and
   `AVAILABLE_CITIES`.
2. `components/shared/search/searchFilterConfig.js` — add it to `CITIES`.
3. Check the listing page works: `/property-listing/city/<city-name>` (data comes from the API).

---

## Colours and fonts

All brand colours, font sizes and spacing are CSS variables in **`styles/tokens.css`**
(loaded once from `pages/_app.js`). Change the variable there; do not hard-code new colours in
component CSS — use `var(--token-name)` instead.

## Phone / WhatsApp number

Edit **`components/lib/siteConfig.js`** (`PHONE_DIGITS`). New code should import from there.
A few older files still contain the number directly — find them with:

```
git grep -n "8698009900"
```

(at time of writing: `pages/_app.js`, `components/nri/StickySidebar.jsx`,
`components/tulip-event/StickySidebar.jsx`, `components/shared/PropertyChatbot.jsx`.)

## Services page (`/our-services`)

Text, lists and image names are at the top of `pages/our-services.js` (look for
"Page content"). Styles: `pages/our-services.module.css`. Images: `public/services/`
(each image has a small and large size in `.avif` + `.webp` — replace both).

## Developer logos (scrolling logo strip)

`components/shared/DeveloperShowcase.jsx` loads names + logos from the `/developer` API — add or
change a developer in the admin/CMS, not in code. Entries without a logo are skipped.

## Listing page ad

`components/property-listing/ListingAd.jsx` (+ `.module.css`). It reuses the hero projects from
`components/home/heroProjects.js`, so updating a hero project updates the ad too.

## Card buttons (Call / WhatsApp / Enquire on property cards)

Styles: `components/shared/CardButtons.module.css`. Used by
`components/property-listing/PropertyListingCard.jsx` and `PropertyListingCardMobile.jsx`.

## Turn off an animation

- Scroll "fade-in" reveal: `components/shared/useScrollReveal.js` (remove the hook call in the
  component, or return early in the hook).
- Hero/logo sliding: `components/home/BrandSlide.jsx`, `components/shared/DeveloperShowcase.jsx`.
- All animations already stop automatically for users with "reduce motion" turned on in their OS.

## Compare and Shortlist

- Compare: `components/compare/compareStore.js` (the saved list, kept in the browser's
  `localStorage`), `compareData.js` (which rows/fields are compared), `CompareToggle.jsx`
  (checkbox on cards), `CompareTray.jsx` (bottom bar). Page: `pages/compare.js`.
- Shortlist: `components/shared/shortlist/shortlistStore.js` (also `localStorage`),
  `HeartButton.jsx`, `ShortlistToast.jsx`. Page: `pages/shortlist.js`.

---

## CSS class names — important

`next.config.js` sets `WANT_HASH = false`, so CSS-module class names are **not** made unique.
`.title` in one file and `.title` in another **clash** across the whole site.
Rule: give every class in a new module a short file prefix, e.g. `ListingAd.module.css` uses
`laExpertCall`, `SiteVisitBanner` uses `sv-…`. Search the repo before inventing a new prefix.

---

## Run, check and build

```
npm install          # once
npm run dev          # local site at http://localhost:3000
npm run lint         # ESLint — must show 0 errors
npx prettier --write <file>   # format (settings in .prettierrc, width 100)
npm run build        # production build (run before pushing big changes)
npm run analyze      # build + bundle size report
```

## Measure page speed

- Chrome/Edge DevTools → **Lighthouse** tab → Mobile → Analyze (use `npm run build && npm start`,
  not the dev server — dev mode is always slow).
- Or https://pagespeed.web.dev for the live site.
