// NRIHomeFest.jsx
import React from "react";
import styles from "./NRIHomeFest.module.css";

/* ── inline styles for the expo banner ── */
const bannerStyles = `
  .expo-banner {
    background-color: #000;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(201,168,76,.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 10% 100%, rgba(201,168,76,.05) 0%, transparent 55%),
      radial-gradient(ellipse 50% 35% at 90% 100%, rgba(201,168,76,.04) 0%, transparent 55%);
    border: 1px solid rgba(201,168,76,.22);
    font-family: 'Raleway', sans-serif;
    padding: 0 2.5rem 2.8rem;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .expo-banner::before,
  .expo-banner::after {
    content: '';
    position: absolute;
    width: 70px; height: 70px;
    border-color: #8a6e30;
    border-style: solid;
    opacity: .45;
  }
  .expo-banner::before { top: 10px; left: 10px;  border-width: 1px 0 0 1px; }
  .expo-banner::after  { bottom: 10px; right: 10px; border-width: 0 1px 1px 0; }

  .expo-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.1rem;
    padding: 1.6rem 0 1.8rem;
    position: relative;
  }
  .expo-header__line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #8a6e30, transparent);
    max-width: 280px;
  }
  .expo-header__diamond {
    color: #C9A84C;
    font-size: .85rem;
    opacity: .8;
    flex-shrink: 0;
  }
  .expo-header__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.25rem, 2.8vw, 1.85rem);
    font-weight: 600;
    letter-spacing: .28em;
    color: #C9A84C;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .expo-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201,168,76,.22), transparent);
    margin: .5rem 0 1.6rem;
  }
  .expo-grid {
    display: grid;
    gap: 1rem;
  }
  .expo-grid--6 { grid-template-columns: repeat(6, 1fr); }
  .expo-grid--5 { grid-template-columns: repeat(5, 1fr); margin-top: 1.4rem; }

  .expo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: .2rem .2rem .2rem;
    border: 1px solid transparent;
    border-radius: 2px;
    transition: border-color .3s, background .3s;
    cursor: default;
    animation: expofadeUp .6s ease both;
  }
  .expo-card:hover {
    border-color: rgba(201,168,76,.22);
    background: rgba(201,168,76,.04);
  }
  .expo-card:nth-child(1) { animation-delay: .05s; }
  .expo-card:nth-child(2) { animation-delay: .10s; }
  .expo-card:nth-child(3) { animation-delay: .15s; }
  .expo-card:nth-child(4) { animation-delay: .20s; }
  .expo-card:nth-child(5) { animation-delay: .25s; }
  .expo-card:nth-child(6) { animation-delay: .30s; }

  @keyframes expofadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .expo-card__icon {
    width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem;
    color: #C9A84C;
    position: relative;
  }
  .expo-card__icon svg {
    width: 100%; height: 100%;
    stroke: #C9A84C;
    fill: none;
    stroke-width: 1.3;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform .35s ease, filter .35s ease;
    filter: drop-shadow(0 0 5px rgba(201,168,76,0));
  }
  .expo-card:hover .expo-card__icon svg {
    transform: scale(1.1) translateY(-2px);
    filter: drop-shadow(0 0 7px rgba(201,168,76,.55));
  }
  .expo-card__label {
    font-size: .72rem;
    font-weight: 500;
    letter-spacing: .06em;
    line-height: 1.55;
    color: #fff;
  }
  .expo-card__label strong {
    display: block;
    font-weight: 600;
    color: #F0E4C3;
  }
  .expo-card__sub {
    margin-top: .25rem;
    font-size: .64rem;
    color: #C9A84C;
    letter-spacing: .03em;
  }

  @media (max-width: 900px) {
    .expo-grid--6 { grid-template-columns: repeat(3, 1fr); }
    .expo-grid--5 { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 540px) {
    .expo-banner { padding: 0 1rem 2rem; }
    .expo-grid--6,
    .expo-grid--5 { grid-template-columns: repeat(2, 1fr); }
    .expo-header__title { font-size: 1rem; letter-spacing: .18em; }
  }
`;

const ExpoBanner = () => (
  <>
    <style>{bannerStyles}</style>
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <section className="expo-banner">

      {/* Header */}
      <header className="expo-header">
        <span className="expo-header__diamond">✦</span>
        <div className="expo-header__line"></div>
        <h2 className="expo-header__title">Mega Indian Property Expo</h2>
        <div className="expo-header__line"></div>
        <span className="expo-header__diamond">✦</span>
      </header>

      {/* Row 1 — 6 features */}
      <div className="expo-grid expo-grid--6">

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z"/>
              <path d="M16 24l6 6 10-12"/>
              <path d="M9 18c2-1 4-1.5 6-1" opacity=".5"/>
              <path d="M39 18c-2-1-4-1.5-6-1" opacity=".5"/>
            </svg>
          </div>
          <p className="expo-card__label">Trusted by customers<br/>across the globe</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="18" width="16" height="24" rx="1"/>
              <rect x="26" y="10" width="16" height="32" rx="1"/>
              <path d="M10 14h8M30 6h8" opacity=".5"/>
              <path d="M14 24h4M14 29h4M14 34h4"/>
              <path d="M30 17h8M30 22h8M30 27h8"/>
              <path d="M2 42h44" opacity=".4"/>
            </svg>
          </div>
          <p className="expo-card__label">India's No. 1<br/>Property Consultant</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6C17 6 11 12 11 19c0 10 13 23 13 23s13-13 13-23c0-7-6-13-13-13z"/>
              <circle cx="24" cy="19" r="4"/>
            </svg>
          </div>
          <p className="expo-card__label">Presence across<br/>prime cities</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 38V18l16-12 16 12v20"/>
              <rect x="16" y="26" width="7" height="12"/>
              <rect x="25" y="22" width="8" height="8"/>
              <path d="M36 10l6 4M38 8l2 8-7-3"/>
              <circle cx="38" cy="10" r="2" fill="currentColor" opacity=".4"/>
            </svg>
          </div>
          <p className="expo-card__label">Exclusive NRI<br/>benefits</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 38V18l16-12 16 12v20H8z"/>
              <circle cx="36" cy="14" r="8"/>
              <path d="M33 14h6M36 11v6"/>
              <path d="M16 26h6v12h-6z"/>
            </svg>
          </div>
          <p className="expo-card__label">Special<br/>Home Fest offers</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="12" width="36" height="26" rx="2"/>
              <path d="M6 20h36"/>
              <rect x="10" y="26" width="8" height="5" rx="1" opacity=".6"/>
              <rect x="22" y="26" width="6" height="5" rx="1" opacity=".4"/>
              <circle cx="38" cy="28" r="4" fill="none"/>
              <path d="M36.5 28h3M38 26.5v3"/>
            </svg>
          </div>
          <p className="expo-card__label">Flexible<br/>payment plans</p>
        </div>

      </div>

      <div className="expo-divider"></div>

      {/* Row 2 — 5 features */}
      <div className="expo-grid expo-grid--5">

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect x="4"  y="24" width="12" height="18" rx="1"/>
              <rect x="18" y="16" width="12" height="26" rx="1"/>
              <rect x="32" y="8"  width="12" height="34" rx="1"/>
              <path d="M4 44h40" opacity=".3"/>
            </svg>
          </div>
          <p className="expo-card__label"><strong>Diverse asset classes:</strong></p>
          <p className="expo-card__sub">Residential, Commercial, Retail &amp; Plots</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="12" r="6"/>
              <path d="M14 38c0-6 4.5-10 10-10s10 4 10 10"/>
              <circle cx="10" cy="20" r="4" opacity=".6"/>
              <path d="M4 38c0-4 3-7 6-7" opacity=".6"/>
              <circle cx="38" cy="20" r="4" opacity=".6"/>
              <path d="M44 38c0-4-3-7-6-7" opacity=".6"/>
              <path d="M18 30a6 6 0 0 1 12 0" opacity=".2"/>
            </svg>
          </div>
          <p className="expo-card__label">Dedicated Teams<br/>Delivering Support</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="22" r="10"/>
              <path d="M24 12V8M24 36v4M14 22h-4M38 22h-4"/>
              <circle cx="24" cy="22" r="3" fill="currentColor" opacity=".5"/>
              <path d="M17 15l-3-3M34 15l3-3M17 29l-3 3M34 29l3 3" opacity=".4"/>
              <rect x="18" y="38" width="12" height="5" rx="2" opacity=".3"/>
            </svg>
          </div>
          <p className="expo-card__label">Hassle free<br/>booking process</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect x="6"  y="10" width="36" height="7" rx="1"/>
              <rect x="6"  y="21" width="28" height="5" rx="1" opacity=".7"/>
              <rect x="6"  y="30" width="22" height="5" rx="1" opacity=".5"/>
              <path d="M38 28l6 6-6 6" />
              <path d="M44 34H30"/>
            </svg>
          </div>
          <p className="expo-card__label">Priority access</p>
        </div>

        <div className="expo-card">
          <div className="expo-card__icon">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="18"/>
              <circle cx="24" cy="24" r="14" opacity=".3"/>
              <path d="M24 6v4M24 38v4M6 24h4M38 24h4"/>
              <path d="M18 24l4 4 8-8"/>
            </svg>
          </div>
          <p className="expo-card__label">On spot benefits</p>
        </div>

      </div>

    </section>
  </>
);

const NRIHomeFest = () => {
  return (
    <section className={styles.section}>
      

        {/* Heading */}
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>
            NRI Property Fest 2026
          </h2>
        </div>

        {/* Description */}
        <p className={styles.description}>
          The Godrej Properties NRI Home Fest is back and travelling across the
          globe to bring India's premium real estate to your doorstep. Whether
          you're an investor, a future homeowner, or someone looking to reconnect
          with your roots, this event is your golden opportunity to secure a dream
          property from India's No.1 developer.
        </p>

        {/* Banner — replaces the commented-out image */}
        <div className={styles.imageWrapper}>
          <ExpoBanner />
        </div>

    </section>
  );
};

export default NRIHomeFest;