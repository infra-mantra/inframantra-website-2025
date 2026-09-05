/**
 * Whether to mount the reCAPTCHA widget on this host.
 *
 * The site key 6LfrSTUqAAAA… is registered against the production domain only.
 * On any other host — localhost, a Vercel preview, a staging URL — Google refuses
 * the key and the widget paints a red "ERROR for site owner: Invalid domain for
 * site key" box over the form. That is what visitors to a preview build see.
 *
 * So the widget is mounted only where the key is valid. Everywhere else it is
 * simply not rendered: no error box, and no behaviour change, because the forms
 * already guard on `recaptchaRef.current` before calling executeAsync().
 *
 * This is a client-side check by design. The hostname is not knowable during SSG,
 * and the widget is size="invisible" with no layout footprint, so mounting it
 * after hydration shifts nothing.
 *
 * TO ADD A DOMAIN: register it in the Google reCAPTCHA admin console for this key
 * first, then add it here — adding it here alone will just bring the error back.
 */
import { useEffect, useState } from "react";

const ALLOWED_HOSTS = [/(^|\.)inframantra\.com$/i];

export function isRecaptchaEnabled() {
  if (typeof window === "undefined") return false;

  // An explicit override for anyone who has registered another host and wants it
  // on locally: NEXT_PUBLIC_ENABLE_RECAPTCHA=1
  if (process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "1") return true;

  return ALLOWED_HOSTS.some((re) => re.test(window.location.hostname));
}

/**
 * Hook form. Resolves to false during SSR and on the first client render, then
 * to the real answer after mount — so the server HTML and the hydrated tree
 * always agree. Never read isRecaptchaEnabled() directly in render.
 */
export function useRecaptchaEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isRecaptchaEnabled());
  }, []);

  return enabled;
}

export default isRecaptchaEnabled;
