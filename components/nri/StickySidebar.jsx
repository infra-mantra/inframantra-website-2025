'use client';
import { useState } from "react";
import styles from "./StickySidebar.module.css";
import PopUpForm from '../detailSections/CTA_NEW';

/* ── Icons ───────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <path
      d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.352.629 4.558 1.727 6.46L2.667 29.333l7.09-1.694A13.267 13.267 0 0 0 16 29.333c7.364 0 13.333-5.97 13.333-13.333S23.364 2.667 16 2.667Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M11.2 11.467s.533 1.066.533 2.133c0 1.067-.533 1.6-.533 1.6s1.6 3.2 5.333 4.267c0 0 .534-.534 1.6-.534 1.067 0 2.134.534 2.134.534s-1.067 2.666-3.2 2.666c-3.734 0-7.467-5.333-7.467-8-.533-2.133.8-2.666 1.6-2.666Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <path
      d="M5.333 5.333h5.334l2.666 6.667-3.2 2.133c1.244 2.511 3.289 4.556 5.8 5.8l2.134-3.2 6.666 2.667v5.333A2.667 2.667 0 0 1 22.067 27C11.573 26.368 5.632 20.427 5 9.933a2.667 2.667 0 0 1 .333-4.6Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const FormIcon = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <rect
      x="5.333"
      y="4"
      width="21.333"
      height="24"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M10.667 10.667h10.666M10.667 16h10.666M10.667 21.333h6.666"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="12"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M16 14V22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle
      cx="16"
      cy="10"
      r="1.5"
      fill="currentColor"
    />
  </svg>
);

/* ── Main Component ───────────────── */
export default function StickySidebar({ url = "" }) {

  const [hovered, setHovered] = useState(null);
  const [popForm, setPopForm] = useState(false);

  /* ── Dynamic Items ───────────────── */

  const ITEMS = [
    {
      id: "whatsapp",
      label: "WHATS APP",
      icon: <WhatsAppIcon />,
      href: "https://wa.me/12136575060",
      target: "_blank",
    },

    {
      id: "call",
      label: "INSTANT CALL",
      icon: <PhoneIcon />,
      href: "tel:+12136575060",
    },

    url
      ? {
          id: "moreinfo",
          label: "MORE INFO",
          icon: <InfoIcon />,
          href: url,
          target: "_blank",
        }
      : {
          id: "touch",
          label: ["GET IN TOUCH"],
          icon: <FormIcon />,
          action: "popup",
        },
  ];

  return (
    <>
      <div className={styles.sidebarst}>

        {ITEMS.map((item, i) => (
          <a
            key={item.id}
            href={item.href || "#"}
            target={item.target}
            rel={
              item.target === "_blank"
                ? "noopener noreferrer"
                : undefined
            }
            className={`${styles.itemst} ${
              hovered === item.id
                ? styles.itemHoveredst
                : ""
            }`}
            onMouseEnter={() =>
              setHovered(item.id)
            }
            onMouseLeave={() =>
              setHovered(null)
            }
            onClick={(e) => {

              if (item.action === "popup") {
                e.preventDefault();
                setPopForm(true);
              }

            }}
          >

            <span className={styles.iconWrapst}>
              {item.icon}
            </span>

            <span className={styles.labelst}>
              {Array.isArray(item.label)
                ? item.label.map((line, j) => (
                    <span key={j}>
                      {line}
                    </span>
                  ))
                : item.label}
            </span>

            {i < ITEMS.length - 1 && (
              <span
                className={styles.dividerst}
              ></span>
            )}

          </a>
        ))}

      </div>

      {!url && (
        <PopUpForm
          popUpenable={popForm}
          onClickOff={setPopForm}
          name="USA-EXPO (Event Specific)"
          phone="+1 (213) 6575060"
          id="nriGetInTouch"
          countryCode='us'
        />

      )}
    </>
  );
}