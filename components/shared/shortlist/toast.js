/*
  Tiny entry point for the shortlist toast. The toast UI (ShortlistToast.jsx) is
  its own chunk, fetched only the first time someone taps a heart, so cards pay
  nothing for it up front.

  notify({ message, linkText?, href?, actionText?, onAction? })
*/
export function notify(opts) {
  if (typeof window === "undefined") return;
  import("./ShortlistToast.jsx").then((m) => m.showToast(opts)).catch(() => {}); // a failed chunk load must never break the heart click
}
