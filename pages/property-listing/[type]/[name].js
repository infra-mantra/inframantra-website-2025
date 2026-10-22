import React, { useState, useEffect, useRef, startTransition } from "react";
// Developer logo coverflow. Imported normally (server-rendered shell with a fixed-height
// stage = no layout shift); it fetches the logos itself only when scrolled near.
import DeveloperShowcase from "../../../components/shared/DeveloperShowcase.jsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import PropertyCardSkeleton, {
  FeaturedSkeleton,
  FaqSkeleton,
  ContentSkeleton,
  ListingPageSkeleton,
} from "../../../components/property-listing/PropertyCardSkeleton.jsx";
import pll from "../listingLayout.module.css";
import { optimizedSrc } from "../../../components/lib/imageUrl.js";
import AppliedFilters from "../../../components/property-listing/content/AppliedFilters.jsx";
import ListingAd, {
  ExpertStrip,
  pickAdProjects,
} from "../../../components/property-listing/ListingAd.jsx";
// import { cityNames } from '../../../components/property-listing/dropDownMenuConstants.js';
// Lazy load components
const PropertyListingCard = dynamic(
  () => import("../../../components/property-listing/PropertyListingCard.jsx")
);
const ListingFilters = dynamic(
  () => import("../../../components/property-listing/search/ListingFilters.jsx")
);
const SearchBar = dynamic(
  () => import("../../../components/property-listing/search/SearchBar.jsx")
);
const PropertyListingCardMobile = dynamic(
  () => import("../../../components/property-listing/PropertyListingCardMobile.jsx")
);
const CustomBackdrop = dynamic(() => import("../../../components/shared/Backdrop.jsx"));
const Wrapper = dynamic(() => import("../../../components/shared/Wrapper.jsx"));
const FaqSection = dynamic(
  () => import("../../../components/property-listing/content/FaqSection.jsx")
);
const Content = dynamic(
  () => import("../../../components/property-listing/content/AboutSection.jsx")
);
const PropertyPageFloatingContact = dynamic(
  () => import("../../../components/property-detail/PropertyPageFloatingContact.jsx")
);
// "Read more" dialog: only downloaded the first time someone opens it
const ListingDetailsModal = dynamic(
  () => import("../../../components/property-listing/ListingDetailsModal.jsx"),
  { ssr: false }
);
const PremiumProperty = dynamic(
  () => import("../../../components/property-listing/PremiumProperty.jsx")
);

const PAGE_SIZE = 10; // results per page (kept in sync with the backend `limit`)

/*
  Multi-select places: ?cities=gurgaon,pune&localities=new-gurgaon,dwarka-expressway
  on the current route. `cities` are whole cities, `localities` single localities
  (a city with some localities picked is NOT also in `cities`).

  API: /search accepts ?city=a,b (whole cities, one request). It ignores any
  locality filter, so each locality is its own q=<slug> request; the results are
  merged, de-duplicated by slug, sorted and paginated here. Capped at MULTI_CAP.
*/
const MULTI_CAP = 200;
const csvParam = (v) =>
  typeof v === "string" && v.trim()
    ? v
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];
const readSelection = (query) => ({
  cities: csvParam(query.cities),
  localities: csvParam(query.localities),
});
const placeName = (slug) =>
  String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
const joinNames = (names) =>
  names.length <= 1
    ? names[0] || ""
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;

// Mid-list "Featured project" ad: after the 6th card on desktop / 4th on phones,
// then every 12 cards after that on longer lists.
const AD_FIRST = { desktop: 6, mobile: 4 };
const AD_EVERY = 12;
// "Talk to an expert" strip after this many cards (or at the end of a shorter page).
const EXPERT_AFTER = 9;

// Server-side twin of the component's buildSearchQuery for the default view
// (unfiltered, page 1, relevance). getStaticProps cannot see query-string
// filters, so it seeds exactly this case — the one crawlers and cold visitors
// land on. Filtered URLs still fetch on the client, as before.
/*
  Configuration listings — /property-listing/configuration/<slug>.

  These reuse this page rather than having one of their own: same cards, filters,
  sort and pagination. The only difference is scope. A location listing searches
  for a place name; a configuration listing searches the whole index and filters
  on the layout, so it uses the backend q=property-in-india branch.

  `filter` is the value sent as ?configuration=. The backend expands a bare integer
  to include its .5 variant, so "3" matches both 3 and 3.5 BHK — which is why 3 BHK
  legitimately lists a 3.5/4.5/5.5 BHK project. "Penthouse" is not numeric and is
  matched verbatim against configurationForSearch.
*/
export const CONFIGURATIONS = {
  "2-bhk": {
    filter: "2",
    label: "2 BHK",
    range: "2 & 2.5 BHK",
    heading: "2 & 2.5 BHK Flats & Apartments",
    seoName: "2 BHK Flats",
  },
  "3-bhk": {
    filter: "3",
    label: "3 BHK",
    range: "3 & 3.5 BHK",
    heading: "3 & 3.5 BHK Flats & Apartments",
    seoName: "3 BHK Flats",
  },
  "4-bhk": {
    filter: "4",
    label: "4 BHK",
    range: "4 & 4.5 BHK",
    heading: "4 & 4.5 BHK Flats & Apartments",
    seoName: "4 BHK Flats",
  },
  "5-bhk": {
    filter: "5",
    label: "5 BHK",
    range: "5 & 5.5 BHK",
    heading: "5 & 5.5 BHK Flats & Apartments",
    seoName: "5 BHK Flats",
  },
  penthouse: {
    filter: "Penthouse",
    label: "Penthouse",
    // Singular: the copy reads "${range} properties", and "Penthouses properties"
    // was ungrammatical. The heading and the footer link keep the plural.
    range: "Penthouse",
    heading: "Luxury Penthouses",
    seoName: "Luxury Penthouses",
  },
};

// Title/description/heading for a configuration listing. Kept here rather than in
// the CONFIGURATIONS map because the copy interpolates the live result count, the
// same way the location branches below do.
const configurationCopy = (slug, total) => {
  const cfg = CONFIGURATIONS[slug];
  if (!cfg) return null;
  return {
    // The visible heading names both layouts a page actually covers, because the
    // backend expands a bare integer to include its .5 variant — a 3 BHK page really
    // does list 3.5 BHK projects, and saying so up front avoids it reading as a bug.
    heading: cfg.heading,
    // The title deliberately does NOT carry the range. People search '3 BHK flats',
    // not '3 & 3.5 BHK flats', and the extra characters push it past the ~60 Google
    // will render. The nuance belongs on the page, not in the result snippet.
    title: `${cfg.seoName} in Gurgaon & Delhi NCR | INFRAMANTRA`,
    description: `Explore ${total}+ ${cfg.range} properties for sale across Gurgaon and Delhi NCR on Inframantra. Compare prices, floor plans, possession status and amenities.`,
    keyword: `${cfg.label} flats, ${cfg.label} apartments, ${cfg.label} in Gurgaon, ${cfg.label} in Delhi NCR`,
    content: `Browse ${total} ${cfg.range} properties listed with Inframantra across Gurgaon and Delhi NCR. Every project here is RERA-registered, and the listings cover a range of budgets, possession timelines and locations. Use the filters to narrow by price, project status or unit type, and compare floor plans and amenities side by side before you shortlist.`,
  };
};

/*
  Title/description for a location listing, derived on the server.

  The effect inside the component builds the same strings, but it only runs on the
  client and depends on state that fetchStats fills in after mount — so the server
  HTML for every city, locality and subLocality page went out with <title></title>,
  an empty description and no og:title. getStaticProps already has the first hit,
  which carries the city/locality/state names, so the copy can be resolved there.
*/
const locationCopy = (typeVal, hit, total) => {
  if (!hit) return null;
  const city = hit.city?.name || "";
  const state = hit.state?.name || "";
  const locality = hit.locality?.name || "";
  const sublocality = hit.subLocality?.name || "";

  let area = "";
  let parentArea = "";
  if (typeVal === "state" && state) area = state;
  else if (typeVal === "city" && city) {
    area = city;
    parentArea = state;
  } else if (typeVal === "locality" && locality) {
    area = locality;
    parentArea = city;
  } else if (typeVal === "subLocality" && sublocality) {
    area = sublocality;
    parentArea = [locality, city].filter(Boolean).join(", ");
  }
  if (!area) return null;

  const where = parentArea ? `${area}, ${parentArea}` : area;
  return {
    title: `Properties in ${where} | Real Estate in ${area}`,
    description: `Find ${total}+ properties for sale in ${where} on Inframantra. Explore ${area} property options including 2BHK to 5BHK apartments and penthouses.`,
    keyword: `Properties in ${where}, property for sale in ${where}, real estate ${area}`,
  };
};

// Sets the q / configuration pair that scopes a search to this URL. Callers apply
// the sidebar filters afterwards, so a configuration chosen there overwrites the
// page default rather than fighting it.
/*
  Does this property match a configuration page?

  Parses the CMS configuration string the same way the indexer does: strip BHK,
  split on /, and read each part as a number where it is one. "2/3/4 BHK/Penthouse"
  becomes [2, 3, 4, "Penthouse"].

  A bare integer also matches its .5 variant, which is what the backend does when
  it expands "3" to ["3", "3.5"] — so a 3 BHK page legitimately lists a 3.5 BHK
  project, and the two sides agree on what belongs where.
*/
const matchesConfiguration = (configuration, filter) => {
  if (!filter) return true;
  const parts = String(configuration || "")
    .replace(/BHK/gi, "")
    .split("/")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (isNaN(parseFloat(x)) ? x.toLowerCase() : parseFloat(x)));

  const n = parseFloat(filter);
  if (isNaN(n)) return parts.includes(String(filter).toLowerCase());
  return parts.includes(n) || parts.includes(n + 0.5);
};

// Applied wherever a configuration page reads a list, so the page never claims one
// layout while showing another.
const applyConfigurationNet = (hits, typeVal, nameVal, selected) => {
  // Mirror buildSearchQuery exactly: a configuration picked in the sidebar
  // overwrites the page default, so filtering by the page value while the request
  // asked for the sidebar one returned the wrong set — /configuration/2-bhk?config=1
  // showed 2 BHK properties under a 1 BHK selection.
  //
  // Also covers location pages: a city listing with a configuration filter hits the
  // same undeployed backend and was equally unfiltered.
  const active = selected?.length
    ? selected
    : typeVal === "configuration" && CONFIGURATIONS[nameVal]
      ? [CONFIGURATIONS[nameVal].filter]
      : [];

  if (!active.length) return hits;
  return hits.filter((h) => active.some((c) => matchesConfiguration(h?.configuration, c)));
};

const applyScope = (p, typeVal, nameVal) => {
  const cfg = typeVal === "configuration" ? CONFIGURATIONS[nameVal] : null;
  if (cfg) {
    // A configuration page searches the whole index. Cities picked in the
    // sidebar narrow it through the ?city= filter (see buildSearchQuery), so
    // several cities can be combined.
    p.set("q", "property-in-india");
    p.set("configuration", cfg.filter);
  } else {
    p.set("q", nameVal);
    // The search page matches place names AND project/developer names together;
    // otherwise "vatika" found only the Jaipur sub-locality and missed the
    // Vatika projects in Gurgaon. Location pages keep strict place matching.
    if (typeVal === "search") p.set("mode", "search");
  }
};

const initialSearchQuery = (typeVal, nameVal) => {
  const p = new URLSearchParams();
  applyScope(p, typeVal, nameVal);
  p.set("page", 1);
  p.set("limit", PAGE_SIZE);
  // Project to the card fields; see the backend CARD_SOURCE list. Cuts each hit
  // from ~13 KB to ~1 KB by dropping localityGuide/amenities/faqs/floorPlan,
  // none of which the listing renders.
  p.set("fields", "card");
  return p.toString();
};

const PropertyListingPage = ({
  initialHits = null,
  initialTotal = 0,
  initialQuery = "",
  initialSeo = null,
  // Server-fetched /search?stats=1 for this location (see getStaticProps). Seeding
  // these stops the stat chips, price range and sidebar city list from popping in
  // after hydration and pushing the cards / filter sections down (desktop CLS).
  initialStats = null,
  // /location-tree states, fetched server-side so the sidebar's Location section is
  // in the HTML instead of a skeleton that collapses ~140px when the tree arrives.
  initialTree = null,
}) => {
  const router = useRouter();
  const { type, name } = router.query;
  const nameLc = (typeof name === "string" ? name : "").toLowerCase(); // city/search term is always lowercase

  const [isDesktop, setIsDesktop] = useState(true);
  // Desktop-first defaults so the desktop branch renders with the correct (row,
  // sticky-filter) layout on first paint — avoids the "mobile layout flashes on
  // desktop until refresh" mislayout on client-side navigation. The effect below
  // corrects to mobile when the viewport is actually narrow.
  const [isMobile, setIsMobile] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(initialTotal);

  // Seeded from getStaticProps so the cards are in the SSR HTML. Previously this
  // started empty and the first render had no results at all: LCP waited on the
  // JS bundle, hydration and a /search round trip before a single card existed.
  const [propertyData, setPropertyData] = useState(initialHits || []);
  // Only start in the loading state when there is nothing to show yet, so the
  // seeded cards are never replaced by a skeleton on first paint.
  const [loading, setLoading] = useState(!initialHits);
  // true while a filter click is moving to another listing URL (e.g. removing a
  // city chip, Clear all) — shows "Updating results…" so the click feels instant
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    const start = (url) => url.startsWith("/property-listing") && setNavigating(true);
    const done = () => setNavigating(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events]);
  const updating = loading || navigating;

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [detailsProp, setDetailsProp] = useState(null); // card "Read more" dialog
  const [selectedPropertyName, setSelectedPropertyName] = useState("");
  // filters + sort + page now drive backend fetches (no client-side filtering/slicing)
  const [filters, setFilters] = useState({
    status: [],
    unitType: [],
    configuration: [],
    // Only used on configuration pages, where a city narrows the page rather
    // than navigating away from it.
    city: [],
    priceRange: [null, null],
  });
  const [sort, setSort] = useState("relevance");
  const [premiumProperties, setPremiumProperties] = useState([]);
  const [openClosefilter, setOpenCloseFilter] = useState(false);
  const [city, setCity] = useState(initialHits?.[0]?.city?.name || "");
  const [locality, setLocality] = useState(initialHits?.[0]?.locality?.name || "");
  const [sublocality, setSubLocality] = useState(initialHits?.[0]?.subLocality?.name || "");
  // Seeded from the first server hit (same source fetchStats uses) so the H1 and
  // breadcrumb are complete in the server HTML instead of growing after a fetch.
  const [state, setState] = useState(initialHits?.[0]?.state?.name || "");
  const [readyToMove, setReadyToMove] = useState(initialStats?.readyToMove || 0);
  const [highRise, setHighRise] = useState(initialStats?.highRise || 0);

  // Cities in the current listing with counts — drives the sidebar city filter
  const [cityOptions, setCityOptions] = useState(
    Array.isArray(initialStats?.cities) ? initialStats.cities : []
  );
  // Bumped when filters change from outside the sidebar (the applied-filter
  // chips), so the sidebar re-reads its ticks from `filters`.
  const [filterSyncKey, setFilterSyncKey] = useState(0);

  const [minPrice, setMinPrice] = useState(initialStats?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialStats?.maxPrice || 0);

  // Seeded from getStaticProps for configuration listings. The effect below only
  // runs on the client, so location listings ship <title></title> in their server
  // HTML and fill it in after hydration. These pages exist to be found, so their
  // copy — which needs no fetched data beyond the count getStaticProps already
  // has — is resolved on the server instead.
  const [title, setTitle] = useState(initialSeo?.title || "");
  const [metadescription, setMetaDescription] = useState(initialSeo?.description || "");
  const [keyword, setKeyword] = useState(initialSeo?.keyword || "");

  const contentRef = useRef(null);
  const filterRef = useRef(null);
  const divRef = useRef(null);
  const [height, setHeight] = useState(0);
  // Desktop filter column scrolls on its own; show a "More filters" cue until the
  // user reaches its end (people didn't realise there was more below).
  const [filterMoreBelow, setFilterMoreBelow] = useState(false);
  // Multi-select places from the URL (empty on plain single-place pages)
  const selection = readSelection(router.query);
  const isMulti = selection.cities.length + selection.localities.length > 0;
  const selKey = `${selection.cities.join(",")}|${selection.localities.join(",")}`;
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  const lastQueryRef = useRef(""); // guards against duplicate consecutive list fetches (double loading)
  const initKeyRef = useRef(""); // ensures the per-location initial load runs exactly once

  // ✅ Detect screen size
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769);
      setIsMobile(window.innerWidth <= 768);
    };

    startTransition(checkScreenWidth);
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // ✅ Warm the content chunks while the first fetch is still in flight. These sections
  // are lazy AND hidden behind `loading` (skeletons show instead), so their chunks would
  // otherwise download only when `loading` flips to false — at which point they re-suspend
  // and the page skeleton flashes a SECOND time. Preloading here keeps the load to one pass.
  useEffect(() => {
    import("../../../components/property-listing/content/AboutSection.jsx");
    import("../../../components/property-listing/PropertyListingCard.jsx");
    import("../../../components/property-listing/PropertyListingCardMobile.jsx");
    import("../../../components/property-listing/PremiumProperty.jsx");
    import("../../../components/property-listing/content/FaqSection.jsx");
  }, []);

  // ✅ Sync listing content height with filters

  // ✅ "More filters" cue for the scrollable desktop filter column
  useEffect(() => {
    if (!isDesktop) return;
    const el = filterRef.current;
    if (!el) return;
    const update = () => setFilterMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // content height changes as the location list loads / sections expand
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) Array.from(el.children).forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [isDesktop]);

  // ✅ Smooth scroll to top when filters/search change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [type, name, currentPage, filters, sort]);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName("");
  };

  const handleOpen = (name) => {
    setSelectedPropertyName(name);
    setBackdropOpen(true);
  };

  // Build the /search query string (filters + pagination + sort) sent to the backend
  const buildSearchQuery = (nameVal, pageVal, f, sortVal) => {
    const p = new URLSearchParams();
    applyScope(p, type, nameVal);
    p.set("page", pageVal);
    p.set("limit", PAGE_SIZE);
    // Project to the card fields; see the backend CARD_SOURCE list. Cuts each hit
    // from ~13 KB to ~1 KB by dropping localityGuide/amenities/faqs/floorPlan,
    // none of which the listing renders.
    p.set("fields", "card");
    if (sortVal && sortVal !== "relevance") p.set("sort", sortVal);
    if (f.status?.length) p.set("status", f.status.join(","));
    if (f.configuration?.length) p.set("configuration", f.configuration.join(","));
    if (f.unitType?.length) p.set("unitType", f.unitType.join(","));
    // Cities narrow the current listing (sidebar "Cities" checkboxes)
    if (f.city?.length) p.set("city", f.city.join(","));
    const [min, max] = f.priceRange || [];
    if (min) p.set("minPrice", Math.round(Number(min) * 1e7));
    if (max) p.set("maxPrice", Math.round(Number(max) * 1e7));
    return p.toString();
  };

  // ---- URL <-> filter/sort/page state (shareable, bookmarkable URLs) ----
  const parseUrlState = (query) => {
    const csv = (v) =>
      typeof v === "string" && v.trim()
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const num = (v) => (v !== undefined && v !== "" && !isNaN(Number(v)) ? Number(v) : null);
    return {
      filters: {
        status: csv(query.status),
        unitType: csv(query.unit),
        configuration: csv(query.config),
        city: csv(query.city),
        priceRange: [num(query.min), num(query.max)],
      },
      sort: typeof query.sort === "string" && query.sort ? query.sort : "relevance",
      page: query.page && !isNaN(Number(query.page)) ? Math.max(1, Number(query.page)) : 1,
    };
  };

  // Reflect the current filters/sort/page in the URL (shallow → no reload) so it can be shared
  const syncUrl = (f, sortVal, pageVal) => {
    const q = { type, name: nameLc };
    if (f.status?.length) q.status = f.status.join(",");
    if (f.unitType?.length) q.unit = f.unitType.join(",");
    // On a configuration page the path already names the configuration; only write
    // ?config= when the selection differs from it. After any click the sidebar's
    // selection includes the page's own, which turned /5-bhk into /5-bhk?config=5.
    const pageCfg = type === "configuration" ? CONFIGURATIONS[nameLc]?.filter : undefined;
    const restatesPath = pageCfg && f.configuration?.length === 1 && f.configuration[0] === pageCfg;
    if (f.configuration?.length && !restatesPath) q.config = f.configuration.join(",");
    if (f.city?.length) q.city = f.city.join(",");
    const [min, max] = f.priceRange || [];
    if (min) q.min = min;
    if (max) q.max = max;
    if (sortVal && sortVal !== "relevance") q.sort = sortVal;
    if (pageVal && pageVal > 1) q.page = pageVal;
    const curSel = selectionRef.current;
    if (curSel.cities.length) q.cities = curSel.cities.join(",");
    if (curSel.localities.length) q.localities = curSel.localities.join(",");
    // Never rewrite the URL once the visitor has moved to another page: a late
    // call (debounced price filter, slow fetch) would otherwise navigate back here.
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.toLowerCase().startsWith(`/property-listing/${type}/`.toLowerCase())
    )
      return;
    router.replace({ pathname: router.pathname, query: q }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // ✅ Fetch ONE page of results — filtering + pagination + sorting all happen on the backend
  const fetchList = async (nameVal, pageVal, f, sortVal) => {
    if (!nameVal) return;
    const sel = selectionRef.current;
    if (sel.cities.length + sel.localities.length > 0) {
      return fetchMulti(sel, pageVal, f, sortVal);
    }
    const qs = buildSearchQuery(nameVal, pageVal, f, sortVal);
    // Skip a duplicate identical fetch (e.g. ListingFilters' reset-on-mount firing right after the
    // initial load) so the UI doesn't flash Loading → results → Loading again.
    if (qs === lastQueryRef.current) return;
    lastQueryRef.current = qs;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.apiUrl1}/search?${qs}`);
      const data = await res.json();
      let hits = data.hits || [];

      // The backend may still be discarding ?configuration=, in which case this
      // response is every property rather than the ones this page is about. Filter
      // before paginating, and report the filtered count — otherwise the header
      // says "2 & 2.5 BHK" over a list of 4 BHK projects.
      const scoped = applyConfigurationNet(hits, type, nameLc, f.configuration);
      if (scoped.length !== hits.length) {
        hits = scoped;
        setTotalProperties(scoped.length);
      } else {
        setTotalProperties(data.total || 0);
      }

      // Safety net: if the backend hasn't been updated yet and ignored pagination
      // (returns more than one page), slice down to the requested page client-side.
      if (hits.length > PAGE_SIZE) {
        hits = hits.slice((pageVal - 1) * PAGE_SIZE, pageVal * PAGE_SIZE);
      }
      setPropertyData(hits);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setPropertyData([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  // Several places at once: one request for the whole cities (?city=a,b) plus one
  // per locality, merged client-side. See MULTI_CAP above.
  const fetchMulti = async (sel, pageVal, f, sortVal) => {
    const units = [];
    if (sel.cities.length) units.push({ q: "property-in-india", city: sel.cities.join(",") });
    sel.localities.forEach((l) => units.push({ q: l }));
    const build = (u) => {
      const p = new URLSearchParams(buildSearchQuery(u.q, 1, { ...f, city: [] }, sortVal));
      p.set("q", u.q);
      p.delete("mode");
      if (u.city) p.set("city", u.city);
      p.set("limit", MULTI_CAP);
      return p.toString();
    };
    const key = `multi:${units.map(build).join("||")}#${pageVal}`;
    if (key === lastQueryRef.current) return;
    lastQueryRef.current = key;
    setLoading(true);
    try {
      const lists = await Promise.all(
        units.map((u) =>
          fetch(`${process.env.apiUrl1}/search?${build(u)}`)
            .then((r) => r.json())
            .then((d) => d.hits || [])
            .catch(() => [])
        )
      );
      const seen = new Set();
      let merged = [];
      lists.flat().forEach((h) => {
        const k = h?.slug || h?.id;
        if (!k || seen.has(k)) return;
        seen.add(k);
        merged.push(h);
      });
      merged = applyConfigurationNet(merged, type, nameLc, f.configuration);
      const price = (h) => Number(h?.priceInFigure) || 0;
      if (sortVal === "priceLowHigh") merged.sort((a, b) => price(a) - price(b));
      else if (sortVal === "priceHighLow") merged.sort((a, b) => price(b) - price(a));
      merged = merged.slice(0, MULTI_CAP);
      setTotalProperties(merged.length);
      setPropertyData(merged.slice((pageVal - 1) * PAGE_SIZE, pageVal * PAGE_SIZE));
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setPropertyData([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar place chips changed. One place → its own (indexable) page; several →
  // ?cities=&localities= on this route (pushed, so Back steps through selections).
  const handlePlacesChange = (next) => {
    const q = {};
    if (filters.status?.length) q.status = filters.status.join(",");
    if (filters.unitType?.length) q.unit = filters.unitType.join(",");
    if (filters.configuration?.length && type !== "configuration")
      q.config = filters.configuration.join(",");
    const [mn, mx] = filters.priceRange || [];
    if (mn) q.min = mn;
    if (mx) q.max = mx;
    if (sort && sort !== "relevance") q.sort = sort;
    const n = next.cities.length + next.localities.length;
    if (n === 0) {
      router.push({ pathname: "/property-listing/search/property-in-india", query: q });
    } else if (n === 1) {
      const t = next.cities.length ? "city" : "locality";
      const slug = next.cities[0] || next.localities[0];
      router.push({ pathname: `/property-listing/${t}/${slug}`, query: q });
    } else {
      if (next.cities.length) q.cities = next.cities.join(",");
      if (next.localities.length) q.localities = next.localities.join(",");
      router.push({ pathname: router.pathname, query: { type, name: nameLc, ...q } }, undefined, {
        shallow: true,
        scroll: false,
      });
    }
  };

  // ✅ Area-level info (city/state names + price range + counts) — fetched once per location
  const fetchStats = async (nameVal) => {
    if (!nameVal) return;
    try {
      const res = await fetch(
        (() => {
          // Same scope as the list itself. Searching for the raw slug here would
          // look up a place called "3-bhk" and return nothing, leaving the page
          // with no price range or counts.
          const sp = new URLSearchParams();
          applyScope(sp, type, nameVal);
          sp.set("stats", "1");
          sp.set("limit", "1");
          sp.set("fields", "card");
          return `${process.env.apiUrl1}/search?${sp.toString()}`;
        })()
      );
      const data = await res.json();
      const first = data.hits?.[0];
      // Transitions: these land while lazy sections may still be hydrating, and an
      // urgent update there makes React throw the server HTML away (layout shift).
      startTransition(() => {
        if (first) {
          const cityName = first.city?.name || "";
          setCity(cityName);
          setLocality(first.locality?.name || "");
          setSubLocality(first.subLocality?.name || "");
          setState(first.state?.name || "");
          if (cityName) fetchCityData(cityName);
        }
        if (data.stats) {
          setMinPrice(data.stats.minPrice || "");
          setMaxPrice(data.stats.maxPrice || "");
          setReadyToMove(data.stats.readyToMove || 0);
          setHighRise(data.stats.highRise || 0);
          setCityOptions(Array.isArray(data.stats.cities) ? data.stats.cities : []);
        }
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // ✅ Filters changed → back to page 1 and re-fetch from the backend
  const handleFilterChange = (filterTypes, values) => {
    const map = {};
    if (Array.isArray(filterTypes)) {
      filterTypes.forEach((t, i) => {
        map[t] = values[i];
      });
    } else {
      map[filterTypes] = values;
    }

    // Cities are a filter on the current listing (they used to navigate to that
    // city's page and drop every other filter). Moving to another place is done
    // from the location list, which carries the filters along.

    const nextFilters = {
      status: map.projectStatus ?? filters.status,
      unitType: map.unitType ?? filters.unitType,
      configuration: map.configuration ?? filters.configuration,
      city: map.city ?? filters.city,
      priceRange: map.priceRange ?? filters.priceRange,
    };
    applyFilters(nextFilters);
  };

  const applyFilters = (nextFilters) => {
    // On a configuration page (footer "3 & 3.5 BHK" etc.) the page's own layout is
    // ticked but can be changed: a selection that drops it moves to the page for
    // what is now picked (another configuration page, or all properties with
    // ?config=), carrying the other filters. Keeping it and adding more stays here.
    const ownCfg = type === "configuration" ? CONFIGURATIONS[nameLc]?.filter : undefined;
    const picked = nextFilters.configuration || [];
    if (ownCfg && !picked.includes(ownCfg)) {
      const q = {};
      if (nextFilters.status?.length) q.status = nextFilters.status.join(",");
      if (nextFilters.unitType?.length) q.unit = nextFilters.unitType.join(",");
      if (nextFilters.city?.length) q.city = nextFilters.city.join(",");
      const [min, max] = nextFilters.priceRange || [];
      if (min) q.min = min;
      if (max) q.max = max;
      if (sort && sort !== "relevance") q.sort = sort;
      const slug =
        picked.length === 1 &&
        Object.keys(CONFIGURATIONS).find((k) => CONFIGURATIONS[k].filter === picked[0]);
      if (slug) {
        router.push({ pathname: `/property-listing/configuration/${slug}`, query: q });
      } else {
        if (picked.length) q.config = picked.join(",");
        router.push({ pathname: "/property-listing/search/property-in-india", query: q });
      }
      return;
    }
    setFilters(nextFilters);
    setCurrentPage(1);
    syncUrl(nextFilters, sort, 1);
    fetchList(nameLc, 1, nextFilters, sort);
  };

  // ---- applied-filter chips ----
  const pageConfiguration = type === "configuration" ? CONFIGURATIONS[nameLc]?.filter : undefined;
  const removeFilter = (key, value) => {
    if (key === "placeCity" || key === "placeLocality") {
      const sel = selectionRef.current;
      return handlePlacesChange({
        cities: sel.cities.filter((c) => !(key === "placeCity" && c === value)),
        localities: sel.localities.filter((l) => !(key === "placeLocality" && l === value)),
      });
    }
    const next = { ...filters };
    if (key === "priceRange") next.priceRange = [null, null];
    else next[key] = (filters[key] || []).filter((v) => v !== value);
    // a configuration page always keeps its own layout
    if (key === "configuration" && !next.configuration.length && pageConfiguration) {
      next.configuration = [pageConfiguration];
    }
    applyFilters(next);
    setFilterSyncKey((k) => k + 1);
  };
  const clearAllFilters = () => {
    // several cities/localities picked (?cities=/&localities=) → clear those too:
    // back to all properties with no filters at all
    const sel = selectionRef.current || { cities: [], localities: [] };
    if (sel.cities.length + sel.localities.length > 1) {
      router.push({ pathname: "/property-listing/search/property-in-india" });
      return;
    }
    applyFilters({
      status: [],
      unitType: [],
      configuration: pageConfiguration ? [pageConfiguration] : [],
      city: [],
      priceRange: [null, null],
    });
    setFilterSyncKey((k) => k + 1);
  };

  const handlePageChange = (pageVal) => {
    setCurrentPage(pageVal);
    syncUrl(filters, sort, pageVal);
    fetchList(nameLc, pageVal, filters, sort);
  };

  // ✅ Sort changed → back to page 1 and re-fetch (sorting happens on the backend)
  const handleSortChange = (sortType) => {
    setSort(sortType);
    setCurrentPage(1);
    syncUrl(filters, sortType, 1);
    fetchList(nameLc, 1, filters, sortType);
  };

  const fetchCityData = async (city) => {
    try {
      const response = await axios.get(`${process.env.apiUrl1}/property/premium/${city}`);
      startTransition(() => setPremiumProperties(response.data.data || []));
    } catch (err) {
      console.error("Error fetching premium properties:", err);
    }
  };

  // ✅ Normalize city URLs to lowercase (cosmetic; the backend lowercases the query anyway)
  useEffect(() => {
    if (type === "city" && name && name !== nameLc) {
      router.replace(
        { pathname: router.pathname, query: { ...router.query, name: nameLc } },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, name]);

  // ✅ Load: read filters/sort/page from the URL, fetch area stats once, then fetch that page
  useEffect(() => {
    if (!type || !nameLc) return;

    // On a direct load of a static page, router.query holds only the path params
    // until isReady flips; the ?querystring is merged in after hydration. Reading
    // it before that dropped ?config= / ?status= / ?min= from the first fetch, and
    // the once-per-location guard below then blocked the corrected re-run — so a
    // direct load of /2-bhk?config=3 fetched 2 BHK. Must sit above that guard.
    if (!router.isReady) return;

    // Run the initial load exactly once per location. Without this guard, React
    // StrictMode (and Fast Refresh) re-invoke this effect and it fetches twice,
    // which flashed the skeleton on/off ("loading multiple times").
    const key = `${type}|${nameLc}`;
    if (initKeyRef.current === key) return;
    initKeyRef.current = key;

    const { filters: f, sort: s, page: pg } = parseUrlState(router.query);
    startTransition(() => {
      setFilters(f);
      setSort(s);
      setCurrentPage(pg);
      // Re-seed from the new props on every location change, not just the first
      // mount. Navigating between two cities keeps the same route pattern, so React
      // reuses this component and useState(initialHits) never runs again — the state
      // still held the previous city while initialHits already described the new one.
      // fetchList then built the same query string that was recorded below and its
      // dedupe skipped the request, so the page kept showing the old city entirely.
      setPropertyData(initialHits || []);
      setTotalProperties(initialTotal || 0);
      setLoading(!initialHits);

      // Record the seeded query so fetchList skips the redundant first request. A
      // filtered or paged URL builds a different string and still fetches, replacing
      // the unfiltered seed above.
      lastQueryRef.current = initialHits ? initialQuery : "";
      fetchStats(nameLc);
      fetchList(nameLc, pg, f, s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, nameLc, router.isReady]);

  // Shallow selection changes (chips, Back/Forward) don't re-run the per-location
  // load above, so refetch here. fetchList dedupes, so the first run is free.
  const prevSelRef = useRef(null);
  useEffect(() => {
    if (!router.isReady) return;
    const where = `${type}|${nameLc}`;
    const prev = prevSelRef.current;
    prevSelRef.current = { where, selKey };
    // First run, or a different route: the per-location load above handles it.
    if (!prev || prev.where !== where || prev.selKey === selKey) return;
    const { filters: f, sort: s, page: pg } = parseUrlState(router.query);
    setCurrentPage(pg);
    lastQueryRef.current = "";
    fetchList(nameLc, pg, f, s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selKey, type, nameLc, router.isReady]);

  useEffect(() => {
    if (!type || !name) return;

    let area = "";
    let parentArea = "";
    let newTitle = "";
    let newDescription = "";
    let newKeyword = "";

    // ---------- STATE ----------
    if (type === "state" && state) {
      area = state;

      newTitle = ` Properties in ${area} | Real Estate in ${area}`;
      newDescription = ` Find ${totalProperties}+ properties for sale on ${area}, ${state}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`;
      newKeyword = `Properties in ${city}, ${state}, Properties,  Property for sale in ${city}, ${state}`;
    }

    // ---------- CITY ----------
    else if (type === "city" && city) {
      area = city;
      parentArea = state;
      newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
      newDescription = ` Find ${totalProperties}+ properties for sale on ${area}, ${state}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`;
      newKeyword = `Properties in ${city}, ${state}, Properties,  Property for sale in ${city}, ${state}`;
    }

    // ---------- LOCALITY ----------
    else if (type === "locality" && locality && city) {
      area = locality;
      parentArea = city;
      newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
      newDescription = ` Find ${totalProperties}+ properties for sale on ${area}, ${parentArea}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`;
      newKeyword = `Properties in ${area}, ${parentArea}, Properties,  Property for sale in ${area}, ${parentArea}`;
    }

    // ---------- SUB LOCALITY ----------
    else if (type === "subLocality" && sublocality && locality && city) {
      area = sublocality;
      parentArea = `${locality}, ${city}`;
      newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
      newDescription = ` Find ${totalProperties}+ properties for sale on ${area}, ${parentArea}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`;
      newKeyword = `Properties in ${area}, ${parentArea}, Properties,  Property for sale in ${area}, ${parentArea}`;
    } else if (type === "search") {
      newTitle = `Search Results | Inframantra`;
      newDescription = `Explore premium 2–5 BHK apartments, villas, and penthouses with Inframantra. Enjoy world-class amenities, great connectivity, and luxury living for modern families.`;
      newKeyword = `property search, real estate search, buy property, inframantra search results`;
    }

    // ---------- CONFIGURATION (3/4/5 BHK, Penthouse) ----------
    // Placed last so it cannot shadow a location type; these URLs only ever
    // arrive as /property-listing/configuration/<slug>.
    if (type === "configuration") {
      const copy = configurationCopy(nameLc, totalProperties);
      if (copy) {
        newTitle = copy.title;
        newDescription = copy.description;
        newKeyword = copy.keyword;
      }
    }

    setTitle(newTitle);
    setMetaDescription(newDescription);
    setKeyword(newKeyword);
  }, [type, name, city, locality, sublocality, state, totalProperties]);

  const handleCloseFilterToggle = () => setOpenCloseFilter((prev) => !prev);

  // What the sidebar shows as picked: the URL selection, else the route's place.
  const placeSelection = isMulti
    ? selection
    : {
        cities: type === "city" ? [nameLc] : [],
        localities: type === "locality" ? [nameLc] : [],
      };

  // ---- mid-list ad + expert strip ----
  const visibleSlugs = (propertyData || []).map((p) => p?.slug).filter(Boolean);
  const adCity = city || (type === "city" ? nameLc : "");
  const renderAfterFor = (variant) => (index) => {
    const n = index + 1; // cards shown so far
    const first = AD_FIRST[variant];
    const count = propertyData?.length || 0;
    const nodes = [];
    if (n >= first && (n - first) % AD_EVERY === 0 && count > n) {
      const slot = (n - first) / AD_EVERY;
      const [project] = pickAdProjects({
        city: adCity,
        excludeSlugs: visibleSlugs,
        excludeNames: (propertyData || []).map((p) => p?.name),
        softNames: (propertyData || []).slice(0, n).map((p) => p?.name),
        minCr: filters.priceRange?.[0],
        maxCr: filters.priceRange?.[1],
        slot,
        seed: (currentPage - 1) * 2 + slot,
      });
      nodes.push(
        <ListingAd key={`ad-${n}`} project={project} onEnquire={(nm) => handleOpen(nm)} />
      );
    }
    if (count >= 6 && n === Math.min(EXPERT_AFTER, count)) {
      nodes.push(<ExpertStrip key="expert" onEnquire={() => handleOpen("")} />);
    }
    return nodes.length ? nodes : null;
  };

  const appliedCount =
    filters.status.length +
    filters.unitType.length +
    filters.city.length +
    filters.configuration.filter((c) => c !== pageConfiguration).length +
    (filters.priceRange?.[0] || filters.priceRange?.[1] ? 1 : 0);

  const hasActiveFilters =
    filters.status.length ||
    filters.unitType.length ||
    filters.city.length ||
    filters.configuration.filter((c) => c !== pageConfiguration).length ||
    filters.priceRange?.[0] ||
    filters.priceRange?.[1];

  const emptyState = (
    <div className={pll.pllEmpty}>
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <path
          d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <h3>No properties match these filters</h3>
      <p>Try widening the budget, removing a filter, or browse nearby areas.</p>
      <div className={pll.pllEmptyActions}>
        {hasActiveFilters ? (
          <button type="button" className={pll.pllEmptyPrimary} onClick={clearAllFilters}>
            Clear all filters
          </button>
        ) : null}
        <Link href="/property-listing/city/gurgaon" passHref>
          <a className={pll.pllEmptyLink}>Properties in Gurgaon</a>
        </Link>
        <Link href="/property-listing/search/property-in-india" passHref>
          <a className={pll.pllEmptyLink}>All properties</a>
        </Link>
        <button type="button" className={pll.pllEmptyLink} onClick={() => handleOpen("")}>
          Ask an expert
        </button>
      </div>
    </div>
  );

  return (
    <Wrapper
      title={title}
      description={metadescription}
      keyword={keyword}
      // Must match exactly what the first card renders, now that cards request an
      // optimizer-sized image — preloading the raw CDN original would download a
      // ~450 KB file the page never uses and still leave the real LCP image
      // undiscovered until the card mounts.
      preloadImage={optimizedSrc(initialHits?.[0]?.imageGallery?.[0]?.url, 384)}
      {...(type === "search" || isMulti ? { seo: "noindex, follow" } : {})}
      type={type}
      name={name}
    >
      {/*
        One tree for every viewport. Phone vs desktop differences are CSS media
        queries (listingLayout.module.css), so the server HTML is already laid out
        correctly on a phone. The old `isDesktop ? … : …` swap re-rendered the
        whole page after hydration on phones (CLS ≈ 1.6).
      */}
      <div className={`Wrapper ${pll.pllLayout}`}>
        {/* LEFT FILTERS (desktop sidebar; hidden on phones, which use the sheet below) */}
        <div className={`listingFilters ${pll.pllFilters}`} ref={filterRef}>
          <ListingFilters
            onFilterChange={handleFilterChange}
            type={type}
            name={name}
            defaultConfiguration={CONFIGURATIONS[nameLc]?.filter}
            cityOptions={cityOptions}
            syncFilters={filters}
            syncKey={filterSyncKey}
            placeSelection={placeSelection}
            locationTree={initialTree}
            onPlacesChange={handlePlacesChange}
            totalProperties={totalProperties}
          />
          <div
            className={`${pll.pllScrollHint} ${filterMoreBelow ? pll.pllScrollHintOn : ""}`}
            aria-hidden={!filterMoreBelow}
          >
            <button
              type="button"
              tabIndex={filterMoreBelow ? 0 : -1}
              onClick={() => filterRef.current?.scrollBy({ top: 260, behavior: "smooth" })}
            >
              More filters
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={`listingScrollbar ${pll.pllResults}`} ref={contentRef}>
          <SearchBar
            onSearch={setPropertyData}
            onSortChange={handleSortChange}
            handleCloseFilterToggle={handleCloseFilterToggle}
            filterCount={appliedCount}
            name={name}
            type={type}
          />

          {loading ? (
            <ContentSkeleton />
          ) : (
            <Content
              customHeading={
                isMulti
                  ? `Properties in ${joinNames(
                      [...selection.cities, ...selection.localities].map(placeName)
                    )}`
                  : configurationCopy(nameLc, totalProperties)?.heading
              }
              crumbLabel={
                isMulti
                  ? joinNames([...selection.cities, ...selection.localities].map(placeName))
                  : undefined
              }
              customContent={configurationCopy(nameLc, totalProperties)?.content}
              totalProperties={totalProperties}
              currentPage={currentPage}
              maxPrice={maxPrice}
              minPrice={minPrice}
              type={type}
              name={name}
              state={state}
              city={city}
              sublocality={sublocality}
              locality={locality}
              onSortChange={handleSortChange}
              selectedCities={filters.city}
              // stats cover the whole place, so only show them on the unfiltered view
              onEnquire={handleOpen}
              readyToMove={appliedCount || isMulti ? 0 : readyToMove}
              highRise={appliedCount || isMulti ? 0 : highRise}
            />
          )}

          <AppliedFilters
            places={
              isMulti
                ? [
                    ...selection.cities.map((c) => ({
                      key: "placeCity",
                      value: c,
                      label: placeName(c),
                      kind: "City",
                    })),
                    ...selection.localities.map((l) => ({
                      key: "placeLocality",
                      value: l,
                      label: placeName(l),
                      kind: "Locality",
                    })),
                  ]
                : []
            }
            filters={filters}
            pageConfiguration={pageConfiguration}
            onRemove={removeFilter}
            onClearAll={clearAllFilters}
          />

          {/* feedback while results update after a filter click */}
          {updating && (
            <>
              <div className={pll.pllProgress} aria-hidden="true" />
              <p className={pll.pllUpdating} role="status">
                <span className={pll.pllSpinner} aria-hidden="true" />
                Updating results…
              </p>
            </>
          )}

          {updating ? (
            <PropertyCardSkeleton count={4} />
          ) : (
            <>
              {/* Desktop and phone cards are different components; both are in the
                  HTML and CSS shows one. Hidden lazy images never download. */}
              <div className={pll.pllDeskOnly}>
                <PropertyListingCard
                  name={name ? decodeURIComponent(name) : ""}
                  type={type}
                  onOpenBackdrop={handleOpen}
                  propertyData={propertyData}
                  totalProperties={totalProperties}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  loading={loading}
                  onReadMore={setDetailsProp}
                  renderAfter={renderAfterFor("desktop")}
                  emptyState={emptyState}
                />
              </div>
              <div className={pll.pllPhoneOnly}>
                <PropertyListingCardMobile
                  propertyData={propertyData}
                  onOpenBackdrop={handleOpen}
                  totalProperties={totalProperties}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  onReadMore={setDetailsProp}
                  renderAfter={renderAfterFor("mobile")}
                  emptyState={emptyState}
                />
              </div>
            </>
          )}

          {loading ? (
            <FeaturedSkeleton count={4} />
          ) : premiumProperties.length > 0 ? (
            <section className={pll.pllBlock}>
              <h2 className={pll.pllSectionTitle}>Featured Properties</h2>
              <PremiumProperty premiumProperties={premiumProperties} />
            </section>
          ) : null}

          {/* Developer logo coverflow, between the results and the FAQ */}
          <DeveloperShowcase />

          {loading ? (
            <FaqSkeleton count={5} />
          ) : (
            <FaqSection
              totalProperties={totalProperties}
              type={type}
              name={name}
              state={state}
              city={city}
              locality={locality}
              subLocality={sublocality}
              highRise={highRise}
              readyToMove={readyToMove}
            />
          )}
        </div>
      </div>

      {/* Phone filter sheet (fixed overlay; renders nothing until opened) */}
      {isMobile && (
        <ListingFilters
          onFilterChange={handleFilterChange}
          openClosefilter={openClosefilter}
          handleCloseFilterToggle={handleCloseFilterToggle}
          name={name}
          defaultConfiguration={CONFIGURATIONS[nameLc]?.filter}
          cityOptions={cityOptions}
          syncFilters={filters}
          syncKey={filterSyncKey}
          placeSelection={placeSelection}
          locationTree={initialTree}
          onPlacesChange={handlePlacesChange}
          totalProperties={totalProperties}
          type={type}
        />
      )}

      {detailsProp && (
        <ListingDetailsModal
          property={detailsProp}
          onClose={() => setDetailsProp(null)}
          onEnquire={handleOpen}
        />
      )}

      {/* BACKDROP ALWAYS OUTSIDE */}
      <CustomBackdrop open={backdropOpen} onClose={handleClose}>
        <PropertyPageFloatingContact name={selectedPropertyName} />
      </CustomBackdrop>
    </Wrapper>
  );
};

export default PropertyListingPage;

// Rendered on demand then cached (ISR), matching /property/[propertyId]. paths
// is empty so the build does not fetch every city/locality up front; the first
// request for a listing renders it on the server and later ones are served from
// the cache.
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const nameVal = (params?.name || "").toLowerCase();
  const typeVal = params?.type || "";
  const query = initialSearchQuery(typeVal, nameVal);

  try {
    // Stats in parallel with the list — the same request fetchStats makes on the client.
    const statsQs = new URLSearchParams();
    applyScope(statsQs, typeVal, nameVal);
    statsQs.set("stats", "1");
    statsQs.set("limit", "1");
    statsQs.set("fields", "card");
    const [res, statsData, treeData] = await Promise.all([
      fetch(`${process.env.apiUrl1}/search?${query}`),
      fetch(`${process.env.apiUrl1}/search?${statsQs.toString()}`)
        .then((r) => r.json())
        .catch(() => null),
      // ~4 KB; the same request LocationFilter makes on the client
      fetch(`${process.env.apiUrl1}/location-tree`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);
    const data = await res.json();
    let hits = data.hits || [];
    // Same safety net as fetchList: if the backend ignores pagination, trim.
    // Same net as the client fetch: the seeded page must not advertise one
    // configuration and list another.
    const scoped = applyConfigurationNet(hits, typeVal, nameVal);
    const total = scoped.length !== hits.length ? scoped.length : data.total || 0;
    hits = scoped;
    if (hits.length > PAGE_SIZE) hits = hits.slice(0, PAGE_SIZE);

    return {
      props: {
        initialHits: hits,
        initialTotal: total,
        initialQuery: query,
        initialStats: statsData?.stats || null,
        initialTree: Array.isArray(treeData?.states) ? treeData.states : null,
        // Configuration pages resolve from the slug; location pages need the first
        // hit, which is where the city/locality/state names live.
        initialSeo: configurationCopy(nameVal, total) || locationCopy(typeVal, hits[0], total),
      },
      revalidate: 60,
    };
  } catch (err) {
    // Fall back to the previous client-fetch behaviour rather than failing the page.
    console.error("Listing getStaticProps failed:", err);
    return {
      props: { initialHits: null, initialTotal: 0, initialQuery: "" },
      revalidate: 60,
    };
  }
}
