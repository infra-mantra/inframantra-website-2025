/*
  "Recent searches" kept in the visitor's own browser (localStorage).
  Each entry is { label, href }. Newest first, max 5, no duplicates.
  localStorage can throw (private mode, blocked storage), so every access is guarded.
*/
const KEY = "im_recent_searches";
const MAX = 5;

export const getRecentSearches = () => {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((r) => r && r.label && r.href) : [];
  } catch (e) {
    return [];
  }
};

export const addRecentSearch = (label, href) => {
  if (!label || !href) return;
  try {
    const rest = getRecentSearches().filter((r) => r.href !== href);
    window.localStorage.setItem(KEY, JSON.stringify([{ label, href }, ...rest].slice(0, MAX)));
  } catch (e) {
    /* storage unavailable: just don't remember */
  }
};

export const clearRecentSearches = () => {
  try {
    window.localStorage.removeItem(KEY);
  } catch (e) {
    /* ignore */
  }
};
