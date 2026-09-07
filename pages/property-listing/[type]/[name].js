import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";
import PropertyCardSkeleton, {
  FeaturedSkeleton,
  FaqSkeleton,
  ContentSkeleton,
  ListingPageSkeleton,
} from "../../../components/property-listing/PropertyCardSkeleton.jsx";
import pll from "../listingLayout.module.css";
import { optimizedSrc } from "../../../components/lib/imageUrl.js";
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
const PremiumProperty = dynamic(
  () => import("../../../components/property-listing/PremiumProperty.jsx")
);

const PAGE_SIZE = 10; // results per page (kept in sync with the backend `limit`)

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

const applyScope = (p, typeVal, nameVal, cityRefine) => {
  const cfg = typeVal === "configuration" ? CONFIGURATIONS[nameVal] : null;
  if (cfg) {
    // A configuration page searches the whole index by default. When a city is
    // also selected it becomes the search term instead, so the two narrow
    // together rather than the city replacing the page.
    p.set("q", cityRefine ? cityRefine : "property-in-india");
    p.set("configuration", cfg.filter);
  } else {
    p.set("q", nameVal);
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

  const [backdropOpen, setBackdropOpen] = useState(false);
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
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [sublocality, setSubLocality] = useState("");
  const [state, setState] = useState("");
  const [readyToMove, setReadyToMove] = useState(0);
  const [highRise, setHighRise] = useState(0);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

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
  const lastQueryRef = useRef(""); // guards against duplicate consecutive list fetches (double loading)
  const initKeyRef = useRef(""); // ensures the per-location initial load runs exactly once

  // ✅ Detect screen size
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769);
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
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
    applyScope(p, type, nameVal, f.city?.[0]);
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
    if (f.configuration?.length) q.config = f.configuration.join(",");
    if (f.city?.length) q.city = f.city.join(",");
    const [min, max] = f.priceRange || [];
    if (min) q.min = min;
    if (max) q.max = max;
    if (sortVal && sortVal !== "relevance") q.sort = sortVal;
    if (pageVal && pageVal > 1) q.page = pageVal;
    router.replace({ pathname: router.pathname, query: q }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // ✅ Fetch ONE page of results — filtering + pagination + sorting all happen on the backend
  const fetchList = async (nameVal, pageVal, f, sortVal) => {
    if (!nameVal) return;
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
      }
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

    // On a configuration page a city narrows the page instead of replacing it:
    // picking Gurgaon on /configuration/2-bhk used to navigate to the Gurgaon
    // listing and lose the 2 BHK scope. Elsewhere, picking a different city
    // genuinely is a navigation.
    if (type !== "configuration") {
      // Selecting a different city navigates to that city's listing (lowercase URL)
      const otherCity = (map.city || []).find((c) => c && c.toLowerCase() !== nameLc);
      if (otherCity) {
        router.push(`/property-listing/city/${otherCity.toLowerCase()}`);
        return;
      }
    }

    const nextFilters = {
      status: map.projectStatus ?? filters.status,
      unitType: map.unitType ?? filters.unitType,
      configuration: map.configuration ?? filters.configuration,
      city: map.city ?? filters.city,
      priceRange: map.priceRange ?? filters.priceRange,
    };
    setFilters(nextFilters);
    setCurrentPage(1);
    syncUrl(nextFilters, sort, 1);
    fetchList(nameLc, 1, nextFilters, sort);
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
      setPremiumProperties(response.data.data || []);
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

    // Run the initial load exactly once per location. Without this guard, React
    // StrictMode (and Fast Refresh) re-invoke this effect and it fetches twice,
    // which flashed the skeleton on/off ("loading multiple times").
    const key = `${type}|${nameLc}`;
    if (initKeyRef.current === key) return;
    initKeyRef.current = key;

    const { filters: f, sort: s, page: pg } = parseUrlState(router.query);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, nameLc]);

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
      {...(type === "search" ? { seo: "noindex, follow" } : {})}
      type={type}
      name={name}
    >
      {isDesktop ? (
        <div className={`Wrapper ${pll.pllLayout}`}>
          {/* LEFT FILTERS */}
          <div className={`listingFilters ${pll.pllFilters}`} ref={filterRef}>
            <ListingFilters onFilterChange={handleFilterChange} type={type} name={name} />
          </div>

          <div className={`listingScrollbar ${pll.pllResults}`} ref={contentRef}>
            <SearchBar
              onSearch={setPropertyData}
              onSortChange={handleSortChange}
              isDesktop={isDesktop}
              isMobile={isMobile}
              name={name}
              type={type}
            />

            {loading ? (
              <ContentSkeleton />
            ) : (
              <Content
                customHeading={configurationCopy(nameLc, totalProperties)?.heading}
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
              />
            )}

            {loading ? (
              <PropertyCardSkeleton count={4} />
            ) : (
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
              />
            )}

            {loading ? (
              <FeaturedSkeleton count={4} />
            ) : (
              <>
                <h2 className={pll.pllSectionTitle}>Featured Properties</h2>
                <PremiumProperty premiumProperties={premiumProperties} />
              </>
            )}

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
      ) : (
        /* ---------------- MOBILE VIEW ---------------- */
        <>
          <SearchBar
            onSearch={setPropertyData}
            onSortChange={handleSortChange}
            isDesktop={isDesktop}
            isMobile={isMobile}
            handleCloseFilterToggle={handleCloseFilterToggle}
            name={name}
            type={name}
          />

          <ListingFilters
            onFilterChange={handleFilterChange}
            openClosefilter={openClosefilter}
            handleCloseFilterToggle={handleCloseFilterToggle}
            name={name}
            type={name}
          />

          {loading ? (
            <ContentSkeleton />
          ) : (
            <Content
              customHeading={configurationCopy(nameLc, totalProperties)?.heading}
              customContent={configurationCopy(nameLc, totalProperties)?.content}
              totalProperties={totalProperties}
              currentPage={currentPage}
              maxPrice={maxPrice}
              minPrice={minPrice}
              type={type}
              name={name}
              state={state}
              city={city}
              locality={locality}
              sublocality={sublocality}
              isMobile={isMobile}
              onSortChange={handleSortChange}
            />
          )}

          {loading ? (
            <PropertyCardSkeleton count={4} />
          ) : (
            <PropertyListingCardMobile
              propertyData={propertyData}
              onOpenBackdrop={handleOpen}
              totalProperties={totalProperties}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}

          {loading ? (
            <FeaturedSkeleton count={4} />
          ) : (
            <>
              <h2 className={pll.pllSectionTitle}>Featured Properties</h2>
              <PremiumProperty premiumProperties={premiumProperties} />
            </>
          )}

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
        </>
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
    const res = await fetch(`${process.env.apiUrl1}/search?${query}`);
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
