import { useCallback, useEffect, useRef } from "react";

/*
  Keeps a Swiper slider still until it is on screen, so visitors always arrive
  at the first card instead of a slider that has already moved. Autoplay
  pauses again when the slider scrolls away.

  Usage:
    const onSwiper = useAutoplayWhenVisible();
    <Swiper autoplay={{ delay: 5000 }} onSwiper={onSwiper}> ... </Swiper>
  The same onSwiper can be given to several sliders; each is watched on its own.
*/
export function useAutoplayWhenVisible() {
  const observers = useRef([]);

  useEffect(() => () => observers.current.forEach((o) => o.disconnect()), []);

  return useCallback((swiper) => {
    if (!swiper?.autoplay || typeof IntersectionObserver === "undefined") return;

    let onScreen = false;
    const play = (yes) => {
      if (swiper.destroyed) return;
      if (yes) swiper.autoplay.start();
      else swiper.autoplay.stop();
    };

    // Swiper starts autoplay while initialising; undo that unless already on screen.
    setTimeout(() => play(onScreen), 0);

    // "on screen" = the slider is at least a quarter of the way up the window
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        play(onScreen);
      },
      {
        rootMargin: "0px 0px -25% 0px",
      }
    );
    observer.observe(swiper.el);
    swiper.on("destroy", () => observer.disconnect());
    observers.current.push(observer);
  }, []);
}
