import { useEffect, useState } from "react";

/*
  Shortlist (liked / ♥ properties) — a tiny shared store.

  - Keyed by property slug; each entry is only the small card data the shortlist
    page needs (name, image, price…) plus likedAt, so nothing is fetched to show it.
  - Saved in localStorage (no account/wishlist API exists in this codebase), so it
    is per browser. Changes in another tab arrive through the "storage" event.
  - Components read it with useShortlist(); no React context or provider needed.
  - Same shape as components/compare/compareStore.js on purpose.
*/

const STORAGE_KEY = "im_shortlist_v1";
const MAX_ITEMS = 100; // a sane cap so storage never grows without bound
const EMPTY = [];

let items = EMPTY; // newest first; a new array on every change
let loaded = false; // localStorage is read lazily, on the first client access
const listeners = new Set();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) items = saved.filter((p) => p && p.slug).slice(0, MAX_ITEMS);
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
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false; // another tab changed it: re-read
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
  React hook: the shortlist (array, newest first).
  Server and first client render see an empty list so hydration matches; the saved
  list is applied in an effect right after (same reasoning as compareStore).
*/
export function useShortlist() {
  const [list, setList] = useState(EMPTY);
  useEffect(() => {
    const update = () => setList(getSnapshot());
    update();
    return subscribe(update);
  }, []);
  return list;
}

/** Turn any property object from the API (or an existing item) into a shortlist item. */
export function toShortlistItem(p = {}) {
  const gallery = Array.isArray(p.imageGallery) ? p.imageGallery[0] : p.imageGallery;
  const location = [p.subLocality?.name, p.locality?.name]
    .map((x) => (x || "").trim())
    .filter(Boolean)
    .join(", ");
  return {
    slug: p.slug,
    name: p.name || "",
    image: gallery?.url || p.image || "",
    location: location || p.city?.name || p.location || "",
    price: p.startingPrice || p.price || "",
    configuration: (p.configuration || "").trim(),
    status: (p.status || "").trim(),
    developer: p.developer?.name || (typeof p.developer === "string" ? p.developer : ""),
    developerImg: p.developer?.developerImg || p.developerImg || "",
    likedAt: Date.now(),
  };
}

export const isShortlisted = (slug) => getSnapshot().some((p) => p.slug === slug);

export function removeFromShortlist(slug) {
  save(getSnapshot().filter((p) => p.slug !== slug));
}

/** Put a removed item back (undo). Keeps its original likedAt so its sort position returns. */
export function restoreToShortlist(item) {
  if (!item?.slug || isShortlisted(item.slug)) return;
  const next = [...getSnapshot(), item].sort((a, b) => (b.likedAt || 0) - (a.likedAt || 0));
  save(next.slice(0, MAX_ITEMS));
}

/** Add or remove — what the heart buttons call. Returns { liked, item }. */
export function toggleShortlist(property) {
  const item = toShortlistItem(property);
  if (!item.slug) return { liked: false, item };
  const existing = getSnapshot().find((p) => p.slug === item.slug);
  if (existing) {
    removeFromShortlist(item.slug);
    return { liked: false, item: existing };
  }
  save([item, ...getSnapshot()].slice(0, MAX_ITEMS));
  return { liked: true, item };
}
