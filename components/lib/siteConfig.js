/**
 * siteConfig.js — one place for company-wide contact details.
 *
 * Change the phone / WhatsApp number HERE and every component that imports
 * these constants picks it up. (A few older files still hard-code the number;
 * search the repo for "8698009900" to find them — see docs/EDITING_GUIDE.md.)
 */

/** Digits only, with country code (used by wa.me links). */
export const PHONE_DIGITS = "918698009900";

/** For `href="tel:..."` links. */
export const PHONE_TEL = `+${PHONE_DIGITS}`;
export const TEL_HREF = `tel:${PHONE_TEL}`;

/** Plain WhatsApp chat link (no pre-filled text). */
export const WHATSAPP_URL = `https://wa.me/${PHONE_DIGITS}`;
