import React, { useEffect, useRef, useState } from "react";
import cdw from "./ContactDrawer.module.css";

/*
  Desktop contact menu: one launcher in the corner instead of four separate
  floating buttons (assistant, call, callback, WhatsApp). Clicking it fans the
  four options out as round buttons along an arc around the launcher (a radial
  menu). Mobile keeps its bottom bar; this component hides itself at <= 768px.

  Class names are prefixed cdw- because CSS-module names are not hashed in this
  build (WANT_HASH = false).
*/

const Icon = {
  headset: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      {/* chat bubble with typing dots: "talk to us" */}
      <path
        d="M12 3C6.48 3 2 6.92 2 11.75c0 2.47 1.18 4.7 3.08 6.29L4.3 21.4a.6.6 0 0 0 .86.68l3.9-2.06c.94.24 1.92.37 2.94.37 5.52 0 10-3.92 10-8.75S17.52 3 12 3z"
        fill="currentColor"
      />
      <circle cx="7.6" cy="11.75" r="1.45" fill="#141414" />
      <circle cx="12" cy="11.75" r="1.45" fill="#141414" />
      <circle cx="16.4" cy="11.75" r="1.45" fill="#141414" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 2a1.5 1.5 0 0 1 1 2.6V6h4a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h4V4.6A1.5 1.5 0 0 1 12 2zM9 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 11h1v5H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm20 0a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-5h1z"
        fill="currentColor"
      />
    </svg>
  ),
  callback: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2zM20 3.4 21.4 4.8 17.2 9H20v2h-6V5h2v2.8z"
        fill="currentColor"
      />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"
        fill="currentColor"
      />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"
        fill="currentColor"
      />
    </svg>
  ),
};

// Speed-dial: options stack straight up from the launcher, 62px apart.
const STEP = 62;

export default function ContactDrawer({ phoneLabel, telHref, whatsappHref, onAssistant, onCallback }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const hoverRef = useRef(false);

  // Opens by itself so people see the options, then folds closed after a few
  // seconds (not while the pointer is over it).
  // On every page load / refresh (the app mounts this once per load; moving
  // between pages inside the site does not re-trigger it).
  useEffect(() => {
    setOpen(true);
    let t;
    const close = () => {
      if (hoverRef.current) t = setTimeout(close, 1500);
      else setOpen(false);
    };
    t = setTimeout(close, 5000);
    return () => clearTimeout(t);
  }, []);

  // Close on Esc and on a click anywhere outside the menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const pick = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  const items = [
    { key: "assistant", tone: cdw["cdw-tone-gold"], icon: Icon.bot, label: "Ask our AI assistant", onClick: pick(onAssistant) },
    { key: "callback", tone: cdw["cdw-tone-amber"], icon: Icon.callback, label: "Request a callback", onClick: pick(onCallback) },
    { key: "call", tone: cdw["cdw-tone-ink"], icon: Icon.phone, label: `Call ${phoneLabel}`, href: telHref },
    { key: "whatsapp", tone: cdw["cdw-tone-green"], icon: Icon.whatsapp, label: "Chat on WhatsApp", href: whatsappHref, external: true },
  ];

  return (
    <div
      ref={rootRef}
      className={`${cdw["cdw-root"]} ${open ? cdw["is-open"] : ""}`}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* translucent quarter-circle "fan" behind the options */}
      <span className={cdw["cdw-fan"]} aria-hidden="true" />

      <ul id="contact-radial-menu" className={cdw["cdw-orbit"]} aria-label="Contact Inframantra" aria-hidden={!open}>
        {items.map((it, i) => {
          const style = {
            "--cdw-x": "0px",
            "--cdw-y": `${-(i + 1) * STEP}px`,
            "--cdw-i": i,
          };
          const inner = (
            <>
              {it.icon}
              <span className={cdw["cdw-label"]}>{it.label}</span>
            </>
          );
          const common = {
            className: `${cdw["cdw-orb"]} ${it.tone}`,
            "aria-label": it.label,
            tabIndex: open ? 0 : -1,
          };
          return (
            <li key={it.key} className={cdw["cdw-slot"]} style={style}>
              {it.href ? (
                <a
                  {...common}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {inner}
                </a>
              ) : (
                <button type="button" {...common} onClick={it.onClick}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={cdw["cdw-launcher"]}
        aria-expanded={open}
        aria-controls="contact-radial-menu"
        aria-label={open ? "Close contact options" : "Contact us"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={cdw["cdw-launch-ico"]}>{Icon.headset}</span>
        <span className={cdw["cdw-launch-x"]}>{Icon.close}</span>
        <span className={cdw["cdw-online"]} aria-hidden="true" />
        <span className={cdw["cdw-hint"]} aria-hidden="true">
          Contact Us
        </span>
      </button>
    </div>
  );
}
