import { useEffect, useState } from "react";

/*
  Compare list — a tiny shared store for "Compare properties".

  - Holds at most MAX_COMPARE properties, keyed by slug.
  - Each entry is only the small card data the tray needs (name, image, price…);
    the compare page fetches full details itself.
  - Saved in localStorage so the list survives reloads and page changes.
  - Components read it with useCompareList(); no React context or provider needed.
*/

export const MAX_COMPARE = 4;
const STORAGE_KEY = "im_compare_v1";
const EMPTY = [];

let items = EMPTY; // current list (a new array on every change)
let loaded = false; // localStorage is read lazily, on the first client access
const listeners = new Set();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) {
      items = saved.filter((p) => p && p.slug).slice(0, MAX_COMPARE);
    }
  } catch (err) {
    items = EMPTY; // blocked or corrupt storage: start empty
  }
}

function save(next) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    // private mode / storage full: the list still works for this page view
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  // keep tabs in sync when the list changes in another tab
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

/*
  React hook: the current compare list (array of compare items).

  The server and the first client render always see an empty list, so the markup
  matches during hydration; the saved list is applied in an effect right after.
  (useSyncExternalStore would force a synchronous re-render mid-hydration, which
  React rejects on pages with not-yet-hydrated dynamic() sections.)
*/
export function useCompareList() {
  const [list, setList] = useState(EMPTY);
  useEffect(() => {
    const update = () => setList(getSnapshot());
    update();
    return subscribe(update);
  }, []);
  return list;
}

/** Turn any property object from the API into the small compare item. */
export function toCompareItem(p = {}) {
  const gallery = Array.isArray(p.imageGallery) ? p.imageGallery[0] : p.imageGallery;
  const location = [p.subLocality?.name, p.locality?.name]
    .map((x) => (x || "").trim())
    .filter(Boolean)
    .join(", ");
  return {
    slug: p.slug,
    name: p.name || "",
    image: gallery?.url || "",
    location: location || p.city?.name || "",
    price: p.startingPrice || "",
    configuration: (p.configuration || "").trim(),
    status: (p.status || "").trim(),
    developer: p.developer?.name || "",
  };
}

export const isInCompare = (slug) => getSnapshot().some((p) => p.slug === slug);

/** Add a property. Returns false (and adds nothing) when the list is full. */
export function addToCompare(item) {
  if (!item?.slug) return false;
  const list = getSnapshot();
  if (list.some((p) => p.slug === item.slug)) return true;
  if (list.length >= MAX_COMPARE) return false;
  save([...list, item]);
  return true;
}

export function removeFromCompare(slug) {
  save(getSnapshot().filter((p) => p.slug !== slug));
}

export function clearCompare() {
  save(EMPTY);
}

/** Replace the whole list (used by the compare page to mirror a shared URL). */
export function setCompareList(list) {
  save((list || []).filter((p) => p && p.slug).slice(0, MAX_COMPARE));
}

/** Add or remove — what the card toggles call. Returns "added" | "removed" | "full". */
export function toggleCompare(property) {
  const item = toCompareItem(property);
  if (!item.slug) return "full";
  if (isInCompare(item.slug)) {
    removeFromCompare(item.slug);
    return "removed";
  }
  return addToCompare(item) ? "added" : "full";
}
