/*
  Videos for the Shorts strip on the home page.

  Shape is deliberately platform-tagged so Instagram reels can be added later without
  touching the component:

    { platform: "youtube",   id: "<video id>",  ... }          thumbnail derived from the id
    { platform: "instagram", url: "...", thumb: "<image url>" } thumbnail must be supplied

  Instagram gives no public thumbnail without an API token, and blocks iframe embedding
  of reels — so an instagram entry needs a `thumb` uploaded to Spaces and will open in a
  new tab rather than playing inline. The component already handles both cases.

  `frame` says which thumbnail exists for a YouTube entry and how to fit it in these
  9:16 cards. Omit it for an ordinary Short. Do not infer it from the URL: some
  /shorts/ videos have no vertical thumbnail at all.

    (omitted)     Short with a real vertical 1080x1920 "oardefault". Nothing to do.
    "wide-crop"   Short whose only thumbnail is YouTube's 16:9 composite — the true
                  vertical frame sits in the middle with darkened, zoomed copies of
                  itself either side. object-fit: cover crops exactly that centre
                  strip back out, so the card shows the original frame.
    "wide"        A genuine 16:9 upload. Cover would slice both edges off the actual
                  content, so it is contained over a blurred copy of itself instead.

  CATEGORIES is the order the filter chips appear in. Add a category here and tag an
  entry with it; nothing else needs to change.
*/

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "projects", label: "Projects" },
  // Investment and Market were separate chips holding three videos between them,
  // which is too thin a slice to be worth two tabs.
  { id: "investment", label: "Investment & Market" },
  { id: "events", label: "Events" },
  { id: "awards", label: "Awards & Recognition" },
];

const SHORTS = [
  {
    platform: "youtube",
    id: "oeGNOQIYeCg",
    title: "Tulip Monsella — worth the investment",
    category: "projects",
  },
  {
    platform: "youtube",
    id: "1UBFUnXoRkk",
    title: "Satya Levante, Dwarka Expressway",
    category: "investment",
  },
  {
    platform: "youtube",
    id: "iaQeCGHQ-aM",
    title: "Tulip Melrose, Southern Peripheral Road",
    category: "projects",
  },
  {
    platform: "youtube",
    id: "L0Ku4yTjgg0",
    title: "Tulip Crimson, Sector 70",
    category: "projects",
  },
  {
    platform: "youtube",
    id: "hfD5B40RXqg",
    title: "Your dollars go further in Gurgaon",
    category: "investment",
  },
  {
    platform: "youtube",
    id: "AArzfBwCHEM",
    title: "Gurgaon: ten years of transformation",
    category: "investment",
  },

  // ---------------------------------------------------------------- events
  {
    platform: "youtube",
    id: "hX8hpbBQj1c",
    title: "Inframantra Dream Homes Fest",
    category: "events",
  },
  {
    platform: "youtube",
    id: "B3PzR5bM6m8",
    title: "Sundowner at Tulip Monsella SkyHub",
    category: "events",
  },
  {
    platform: "youtube",
    id: "BHlnxifsTSo",
    title: "An exclusive preview of Experion",
    category: "events",
  },
  {
    platform: "youtube",
    id: "SIhSweKoLQk",
    title: "Recap 2025",
    category: "events",
  },
  {
    platform: "youtube",
    id: "aao-ukA3o1s",
    title: "Vatika Seven Elements, Gurgaon",
    category: "events",
  },

  // ---------------------------------------------------------------- awards
  {
    platform: "youtube",
    id: "CDD6E97bSQs",
    frame: "wide-crop",
    title: "Channel Partner of the Year 2026",
    category: "awards",
  },
  {
    platform: "youtube",
    id: "J6cAxoiPYTE",
    title: "Channel Partner of the Year 2025",
    category: "awards",
  },
  {
    platform: "youtube",
    id: "2M0wsSCIdxU",
    frame: "wide",
    title: "Leaders of Tomorrow Award 2024",
    category: "awards",
  },
];

export default SHORTS;
