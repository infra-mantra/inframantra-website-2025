/*
  Projects of a city in the site's ranking order, for the search dropdown:
  the city's top picks first (same order as the home page "Premium Picks"),
  then the locality lists. Fetched once per city and kept in memory.

  Source: GET {apiUrl1}/property/citywise/{City}?localityLimit=10
    mainCity.properties[]          ranked top projects
    localities[].properties[]      more projects, grouped by locality
*/
const cache = new Map(); // city label → Promise<project[]>

const toProject = (p) => ({
  type: "property",
  title: (p.name || "").trim(),
  slug: p.slug,
  place: [p.subLocality?.name, p.locality?.name].filter(Boolean).join(", "),
  price: p.startingPrice,
  config: p.configuration,
  status: p.status,
  image: p.imageGallery?.url,
});

export function loadCityProjects(cityLabel) {
  if (!cityLabel) return Promise.resolve([]);
  if (!cache.has(cityLabel)) {
    const url = `${process.env.apiUrl1}/property/citywise/${encodeURIComponent(cityLabel)}?localityLimit=10`;
    const request = fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const ranked = [
          ...(data?.mainCity?.properties || []),
          ...(data?.localities || []).flatMap((l) => l.properties || []),
        ];
        const seen = new Set();
        return ranked
          .filter((p) => p?.slug && !seen.has(p.slug) && seen.add(p.slug))
          .map(toProject);
      })
      .catch(() => {
        cache.delete(cityLabel); // try again next time
        return [];
      });
    cache.set(cityLabel, request);
  }
  return cache.get(cityLabel);
}

// Projects whose name, sector, locality or configuration contains every typed word.
export function matchProjects(projects, query, limit = 6) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return projects
    .filter((p) => {
      const hay = `${p.title} ${p.place} ${p.config || ""} ${p.status || ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    })
    .slice(0, limit);
}
