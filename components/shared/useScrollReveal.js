import { useEffect } from "react";

/*
  Scroll reveal: elements with a `data-reveal` attribute fade + rise in when they
  scroll into view. Put `data-reveal="stagger"` on a list to animate its children
  one after another instead.

  Content is always visible without JS: the hidden state only applies once this
  hook has tagged an element with `data-reveal-pending` (see globals.css), and it
  only tags elements that are still BELOW the screen, so nothing on screen blinks.
  Lazy sections mount later, so a MutationObserver picks up their elements too.
  Users who prefer reduced motion get no animation at all.
*/
export default function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.removeAttribute("data-reveal-pending");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    // Tag + observe every new [data-reveal] element that is still below the fold.
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not([data-reveal-seen])").forEach((el) => {
        el.setAttribute("data-reveal-seen", "");
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.setAttribute("data-reveal-pending", "");
          io.observe(el);
        }
      });
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
