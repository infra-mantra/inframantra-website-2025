import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Wrapper from '../../components/UI/Wrapper';
import Header from '../../components/events/HeaderSec';
import AboutEvent from '../../components/events/aboutEvent';
import { staticGoogleReviews } from '../../components/newComponents/reviewsWall/googleReviews';

// Below-the-fold components are code split. The gallery and the story
// still render on the server - only their JavaScript moves into its own
// chunk, fetched once the top of the page is interactive. The sidebar
// and the popup are client-only, so they are skipped on the server too.
const EventGallery = dynamic(() => import('../../components/events/formGallery'));
const EventInfo = dynamic(() => import('../../components/events/eventInfo'));
const Sticky = dynamic(() => import('../../components/nri/StickySidebar'), { ssr: false });
const TulipEventPopup = dynamic(() => import('../../components/events/TulipEventPopup'), { ssr: false });

// ============================================
// EVENT DETAILS  (Iconic Skyhub at Tulip Monsella)
// ============================================
const EVENT_NAME = 'Tulip Monsella';

const EVENT_LOCATIONS = [
  {
    city: 'ICONIC SKYHUB',
    date: '6th September | 4:30 PM Onwards',
    venue: 'Tulip Monsella Skyhub, Sector 53, Gurgaon',
  },
];

// Single project for this event.  Must match an `id` in components/nri/projectSlider.
const EVENT_PROJECT_IDS = ['Tulip Monsella'];

// Instagram reels for the "Our Story" section (replaces the default YouTube films).
// The /embed suffix is Instagram's own iframe embed - no JS SDK needed.
const EVENT_VIDEOS = [
  {
    src: 'https://www.instagram.com/p/DVBUDBbkzEv/embed',
    title: 'Inframantra on Instagram',
  },
  {
    src: 'https://www.instagram.com/p/DVyPUgUE2e5/embed',
    title: 'Inframantra on Instagram',
  },
];

// Gallery: 7 photos from this event (re-encoded to WebP, self-hosted in
// /public/event-gallery) plus 3 from the previous Skyhub showcase. 10 total.
const EVENT_GALLERY = [
  {
    src: '/event-gallery/by6a4667.webp',
    alt: 'Guests at the Tulip Monsella Skyhub showcase',
    caption: 'An evening at Tulip Monsella Skyhub',
  },
  {
    src: '/event-gallery/by6a4790.webp',
    alt: 'Sundowner evening at the Skyhub',
    caption: 'Conversations after sundown',
  },
  {
    src: '/event-gallery/by6a4565.webp',
    alt: 'Guests on the red carpet at Tulip Monsella',
    caption: 'Guests at our Tulip Monsella showcase',
  },
  {
    src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/03.webp',
    alt: 'Tulip Monsella Skyhub showcase',
    caption: 'Happy Clients at our Tulip Monsella Skyhub Showcase',
  },
  {
    src: '/event-gallery/by6a4628.webp',
    alt: 'Guests at the Tulip Monsella showcase',
    caption: 'Guests at our Tulip Monsella showcase',
  },
  {
    src: '/event-gallery/by6a4816.webp',
    alt: 'Guests at the Skyhub during the evening',
    caption: 'An evening above Golf Course Road',
  },
  {
    src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/05.webp',
    alt: 'Tulip Monsella Skyhub showcase',
    caption: 'Happy Clients at our Tulip Monsella Skyhub Showcase',
  },
  {
    src: '/event-gallery/by6a4719.webp',
    alt: 'Guests at the Tulip Monsella showcase',
    caption: 'Guests at our Tulip Monsella showcase',
  },
  {
    src: '/event-gallery/by6a4780.webp',
    alt: 'Guests at the Skyhub showcase',
    caption: 'Clients at the Skyhub showcase',
  },
  {
    src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/gallery/06.webp',
    alt: 'Tulip Monsella Skyhub showcase',
    caption: 'Happy Clients at our Tulip Monsella Skyhub Showcase',
  },
];

// Registration form: one city, one date. `cityDateMap` keys must match a city `value`.
const EVENT_CITIES = [
  { value: 'Gurgaon', labelR: 'Gurgaon' },
];

const EVENT_CITY_DATE_MAP = {
  Gurgaon: [
    { value: 'September 6, 2026', labelR: '6th September 2026' },
  ],
};

// Event start, used by the countdown. IST (+05:30).
const EVENT_START = '2026-09-06T16:30:00+05:30';

/* ============================================================
   LAZY SECTION - the section inside it is not mounted until the
   visitor scrolls near it, so its markup, its styles and (for the
   reviews) its animation cost nothing on first load. It reserves
   its height first, so nothing below it jumps when it arrives.

   FAILSAFE: it mounts anyway after 2.5s, and immediately when
   IntersectionObserver is missing. Content must never be left out
   because an observer did not fire.
   ============================================================ */
const LazySection = ({ minHeight = 460, children }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;

    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window) || !ref.current) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setShown(true);
        io.disconnect();
      },
      // start loading well before it is on screen, so it is already
      // painted by the time the visitor gets there
      { rootMargin: '500px 0px' }
    );

    io.observe(ref.current);

    // Long, because this one mounts content rather than just revealing
    // it - firing early would undo the deferral for anyone reading the
    // top of the page slowly.
    const failsafe = setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 8000);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [shown]);

  return (
    <div
      ref={ref}
      className={shown ? 'tmLazy tmLazyIn' : 'tmLazy'}
      style={shown ? undefined : { minHeight }}
    >
      {shown ? children : null}
    </div>
  );
};

/* ============================================================
   COUNTDOWN STRIP - sits directly under the banner.
   Gives the page a reason to act now rather than "later".
   ============================================================ */
const Countdown = ({ onRsvp }) => {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const target = new Date(EVENT_START).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setLeft(null);
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // NOTE: these must be built inline, not via a helper function.
  // styled-jsx only adds its scoping class to JSX inside the component's
  // own return - JSX returned from a nested helper renders unstyled.
  const units = left
    ? [
        { v: left.d, l: 'Days' },
        { v: left.h, l: 'Hrs' },
        { v: left.m, l: 'Min' },
        { v: left.s, l: 'Sec' },
      ]
    : [];

  return (
    <section className="tmc">
      <div className="tmcInner">
        <div className="tmcLeft">
          <p className="tmcEyebrow">Invitations are limited</p>
          <p className="tmcTitle">
            {left ? 'The evening begins in' : 'Register your interest'}
          </p>
        </div>

        {left && (
          <div className="tmcClock">
            {units.map((u, i) => (
              <React.Fragment key={u.l}>
                <div className="tmcUnit">
                  <span className="tmcNum">
                    {String(u.v).padStart(2, '0')}
                  </span>
                  <span className="tmcLbl">{u.l}</span>
                </div>
                {i < units.length - 1 && <span className="tmcSep">:</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        <button type="button" className="tmcBtn" onClick={onRsvp}>
          Reserve My Seat
        </button>
      </div>

      <style jsx>{`
        .tmc {
          background: linear-gradient(100deg, #17150f 0%, #241f16 55%, #17150f 100%);
          border-bottom: 2px solid #cea24b;
        }
        .tmcInner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 26px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
          flex-wrap: wrap;
        }
        .tmcEyebrow {
          margin: 0 0 4px;
          font-size: 10px;
          letter-spacing: 3.4px;
          text-transform: uppercase;
          color: #cea24b;
          font-weight: 600;
        }
        .tmcTitle {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
        }
        .tmcClock {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tmcUnit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 66px;
          padding: 11px 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(206, 162, 75, 0.35);
          border-radius: 8px;
        }
        .tmcNum {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          color: #f7e6bd;
          font-variant-numeric: tabular-nums;
        }
        .tmcLbl {
          margin-top: 4px;
          font-size: 9px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #b3a894;
        }
        .tmcSep {
          color: #cea24b;
          font-weight: 700;
          padding-bottom: 14px;
        }
        .tmcBtn {
          padding: 14px 30px;
          border: none;
          border-radius: 8px;
          background: #cea24b;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(206, 162, 75, 0.32);
          transition: background 0.22s ease, transform 0.15s ease;
        }
        .tmcBtn:hover {
          background: #f5b800;
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .tmcInner {
            justify-content: center;
            text-align: center;
            gap: 16px;
            padding: 18px 16px;
          }
          .tmcLeft { width: 100%; }
          .tmcBtn { width: 100%; }
        }
        @media (max-width: 420px) {
          .tmcUnit { min-width: 46px; }
          .tmcNum { font-size: 19px; }
        }
      `}</style>
    </section>
  );
};

/* ============================================================
   NEARBY & CONNECTIVITY - what a buyer asks first.
   Times are approximate drive times in normal traffic.
   ============================================================ */
const CONNECTIVITY = [
  {
    g: 'Work',
    items: [
      ['DLF Cyber City & Cyber Hub', '~15 min'],
      ['Udyog Vihar', '~20 min'],
      ['Golf Course Extension Road', '~10 min'],
    ],
  },
  {
    g: 'Getting around',
    items: [
      ['Sector 53-54 Rapid Metro', '~3 min'],
      ['HUDA City Centre Metro', '~15 min'],
      ['IGI Airport (T3)', '~35 min'],
    ],
  },
  {
    g: 'Everyday',
    items: [
      ['Galleria Market, DLF Ph-IV', '~8 min'],
      ['Ambience Mall', '~18 min'],
      ['Sector 54 Chowk', '~5 min'],
    ],
  },
  {
    g: 'Care & schooling',
    items: [
      ['Artemis / Max hospitals', '~15 min'],
      ['The Shri Ram School, Moulsari', '~10 min'],
      ['DPS Sector 45', '~12 min'],
    ],
  },
];

const Connectivity = ({ onRsvp }) => (
  <section className="tmn">
    <div className="tmnInner">
      <p className="tmnEyebrow">The address</p>
      <h2 className="tmnTitle">Everything already close by</h2>
      <span className="tmnRule" />
      <p className="tmnLede">
        Tulip Monsella sits on <strong>Golf Course Road in Sector 53</strong> &mdash;
        the stretch that put Gurgaon&rsquo;s offices, schools and hospitals within a
        short drive of each other, with the Rapid Metro running alongside it.
      </p>

      <div className="tmnGrid">
        {CONNECTIVITY.map((col) => (
          <div key={col.g} className="tmnCol">
            <p className="tmnColTitle">{col.g}</p>
            <ul className="tmnList">
              {col.items.map(([place, time]) => (
                <li key={place} className="tmnItem">
                  <span className="tmnPlace">{place}</span>
                  <span className="tmnTime">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="tmnNote">
        Approximate drive times in normal traffic. Our team will walk you through
        the location in detail on the evening.
      </p>

      <button type="button" className="tmnBtn" onClick={onRsvp}>
        Reserve My Seat
      </button>
    </div>

    <style jsx>{`
      .tmn { background: #ffffff; }
      .tmnInner { max-width: 1280px; margin: 0 auto; padding: 56px 24px 60px; }
      .tmnEyebrow {
        margin: 0 0 8px; font-size: 10px; letter-spacing: 4px;
        text-transform: uppercase; color: #a99a80; font-weight: 600;
      }
      .tmnTitle { margin: 0; font-size: 2rem; font-weight: 700; color: #d4a64a; }
      .tmnRule { display: block; width: 52px; height: 2px; margin: 12px 0 20px; background: #d4a64a; }
      .tmnLede {
        max-width: 760px; margin: 0 0 34px;
        font-size: 15.5px; line-height: 1.85; color: #55504a;
      }
      .tmnLede strong { color: #1f1c18; }
      .tmnGrid {
        display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px;
      }
      .tmnCol {
        padding: 24px 22px 18px; background: #faf8f4;
        border: 1px solid #eee7db; border-top: 3px solid #cea24b; border-radius: 12px;
      }
      .tmnColTitle {
        margin: 0 0 14px; font-size: 10px; letter-spacing: 2.6px;
        text-transform: uppercase; color: #a08a5e; font-weight: 700;
      }
      .tmnList { list-style: none; margin: 0; padding: 0; }
      .tmnItem {
        display: flex; align-items: baseline; justify-content: space-between;
        gap: 12px; padding: 11px 0; border-top: 1px solid #ece5d7;
      }
      .tmnItem:first-child { border-top: none; padding-top: 0; }
      .tmnPlace { font-size: 13.5px; line-height: 1.5; color: #2b2721; }
      .tmnTime {
        flex-shrink: 0; font-size: 12px; font-weight: 700; color: #b08d4f;
        white-space: nowrap;
      }
      .tmnNote {
        margin: 22px 0 26px; font-size: 12.5px; line-height: 1.7; color: #8a857d;
      }
      .tmnBtn {
        padding: 15px 34px; border: none; border-radius: 8px;
        background: #cea24b; color: #fff; font-size: 12px; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
        box-shadow: 0 6px 20px rgba(206, 162, 75, 0.28);
        transition: background 0.22s ease, transform 0.15s ease;
      }
      .tmnBtn:hover { background: #f5b800; transform: translateY(-1px); }
      @media (max-width: 1024px) { .tmnGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 600px) {
        .tmnInner { padding: 40px 16px 44px; }
        .tmnGrid { grid-template-columns: 1fr; }
        .tmnTitle { font-size: 1.35rem; }
        .tmnBtn { width: 100%; }
      }
    `}</style>
  </section>
);

/* ============================================================
   GOOGLE REVIEWS - real reviews, imported from the review wall's
   own data so there is a single source of truth. Two rows drift
   continuously from right to left and pause on hover.
   Nothing here is invented: the names, the words and the 5-star
   rating come from that data file, and the headline score/count
   are the same figures the site's own review wall shows.
   ============================================================ */
const REVIEW_PICKS = staticGoogleReviews
  .filter((r) => r.text && r.text.length > 70 && r.text.length < 300)
  .slice(0, 14);

// Split into two rows so the section keeps the visual weight the
// old three-column grid had, with the rows offset in speed.
const REVIEW_ROWS = [
  REVIEW_PICKS.filter((_, i) => i % 2 === 0),
  REVIEW_PICKS.filter((_, i) => i % 2 === 1),
];

const Testimonials = ({ onRsvp }) => (
  <section className="tmv">
    <div className="tmvInner">
      <div className="tmvHead">
        <p className="tmvEyebrow">Google Reviews</p>
        <h2 className="tmvTitle">What our clients say</h2>
        <span className="tmvRule" />

        <div className="tmvScoreRow">
          <span className="tmvScore">4.3</span>
          <span className="tmvRating" aria-label="Rated 4.3 out of 5">
            <span className="tmvRatingBase">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="tmvRatingFill" style={{ width: '86%' }}>
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </span>
          </span>
          <span className="tmvScoreText">
            from <strong>106</strong> reviews on
            <span className="tmvWord">
              <span className="tmvW1">G</span>
              <span className="tmvW2">o</span>
              <span className="tmvW3">o</span>
              <span className="tmvW4">g</span>
              <span className="tmvW5">l</span>
              <span className="tmvW6">e</span>
            </span>
          </span>
        </div>
      </div>
    </div>

    {/* The rows sit in the same 1280px column as every other section, so
        the heading, the rule and the cards all share one left edge. The
        fade at each side is what makes the motion read as continuing
        past the column rather than starting and stopping in it. */}
    <div className="tmvInner tmvRows">
      {REVIEW_ROWS.map((row, ri) => (
        <div className="tmvRow" key={`row-${ri}`}>
          <div className={ri === 1 ? 'tmvTrack tmvTrackB' : 'tmvTrack tmvTrackA'}>
            {/* rendered twice so the loop is seamless */}
            {[...row, ...row].map((v, i) => (
              <figure className="tmvCard" key={`${v.id}-${i}`} aria-hidden={i >= row.length}>
                <span className="tmvQuote" aria-hidden="true">&#8220;</span>

                <span className="tmvStarsCard" aria-label="5 star review">
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </span>

                <blockquote className="tmvText">{v.text}</blockquote>

                <figcaption className="tmvWho">
                  <span className="tmvInitial" aria-hidden="true">{v.name.charAt(0)}</span>

                  <span className="tmvMeta">
                    <span className="tmvName">{v.name}</span>
                    <span className="tmvSource">
                      <svg className="tmvGmark" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.85z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                        <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                      </svg>
                      Posted on Google
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="tmvInner">
      <div className="tmvCta">
        <p className="tmvCtaText">Meet the same team in person on the 6th.</p>
        <button type="button" className="tmvBtn" onClick={onRsvp}>
          Reserve My Seat
        </button>
      </div>
    </div>

    <style jsx>{`
      .tmv {
        background: linear-gradient(180deg, #ffffff 0%, #fbf8f2 34%, #f5efe3 100%);
        padding: 58px 0 60px;
        overflow: hidden;
      }
      .tmvInner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

      /* ---------- head ---------- */
      .tmvHead { margin-bottom: 34px; }
      .tmvEyebrow {
        margin: 0 0 8px; font-size: 10px; letter-spacing: 4px;
        text-transform: uppercase; color: #a99a80; font-weight: 600;
      }
      .tmvTitle { margin: 0; font-size: 2rem; font-weight: 700; color: #d4a64a; }
      .tmvRule { display: block; width: 52px; height: 2px; margin-top: 12px; background: #d4a64a; }

      .tmvScoreRow {
        display: flex; align-items: center; gap: 12px;
        flex-wrap: wrap; margin-top: 18px;
      }
      .tmvScore {
        font-size: 30px; font-weight: 800; line-height: 1;
        color: #1f1c18; font-variant-numeric: tabular-nums;
      }
      .tmvRating {
        position: relative; display: inline-block;
        font-size: 17px; letter-spacing: 3px; white-space: nowrap;
      }
      .tmvRatingBase { color: #e2d8c4; }
      .tmvRatingFill {
        position: absolute; top: 0; left: 0; bottom: 0; overflow: hidden;
        color: #fbbc05; white-space: nowrap;
      }
      .tmvScoreText { font-size: 13.5px; color: #6c665c; }
      .tmvScoreText strong { color: #1f1c18; font-weight: 700; }
      .tmvWord { margin-left: 7px; font-size: 16px; font-weight: 700; letter-spacing: -0.4px; }
      .tmvW1 { color: #4285f4; }
      .tmvW2 { color: #ea4335; }
      .tmvW3 { color: #fbbc05; }
      .tmvW4 { color: #4285f4; }
      .tmvW5 { color: #34a853; }
      .tmvW6 { color: #ea4335; }

      /* ---------- marquee ---------- */
      /* padding leaves room for the card's hover lift and shadow, which
         the row's own overflow would otherwise clip */
      .tmvRow {
        overflow: hidden;
        padding: 14px 0;
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
                mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
      }
      .tmvTrack {
        display: flex;
        width: max-content;
        animation-name: tmvSlide;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      .tmvTrackA { animation-duration: 68s; }
      .tmvTrackB { animation-duration: 86s; }

      /* right to left; -50% is exactly one copy because the trailing
         space is carried as a margin on the card, not as a track gap. */
      @keyframes tmvSlide {
        from { transform: translate3d(0, 0, 0); }
        to   { transform: translate3d(-50%, 0, 0); }
      }

      .tmvRow:hover .tmvTrack,
      .tmvRow:focus-within .tmvTrack { animation-play-state: paused; }

      /* ---------- card ---------- */
      .tmvCard {
        position: relative;
        flex: 0 0 340px;
        width: 340px;
        min-height: 208px;
        margin: 0 18px 0 0;
        padding: 26px 24px 20px;
        background: #ffffff;
        border: 1px solid #ece4d5;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(31, 28, 24, 0.04);
        display: flex; flex-direction: column;
        transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
      }
      .tmvCard:hover {
        transform: translateY(-3px);
        border-color: #e0c68b;
        box-shadow: 0 16px 36px rgba(31, 28, 24, 0.10);
      }
      .tmvQuote {
        position: absolute; top: 6px; right: 20px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 62px; line-height: 1; color: #f0e3c6;
        pointer-events: none;
      }
      .tmvStarsCard {
        color: #fbbc05; font-size: 13px; letter-spacing: 2.5px; margin-bottom: 12px;
      }
      .tmvText {
        flex: 1; margin: 0 0 18px;
        font-size: 13.5px; line-height: 1.8; color: #544f47;
        display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .tmvWho {
        display: flex; align-items: center; gap: 12px;
        padding-top: 14px; border-top: 1px solid #f1e9da;
      }
      .tmvInitial {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #e9d4a0 0%, #cea24b 100%);
        color: #ffffff; font-weight: 700; font-size: 15px;
        box-shadow: 0 0 0 3px rgba(206, 162, 75, 0.14);
      }
      .tmvMeta { display: flex; flex-direction: column; min-width: 0; }
      .tmvName {
        font-size: 13.5px; font-weight: 700; color: #1f1c18;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .tmvSource {
        display: flex; align-items: center; gap: 5px;
        font-size: 11px; color: #8a857d;
      }
      .tmvGmark { flex-shrink: 0; }

      /* ---------- cta ---------- */
      .tmvCta {
        display: flex; align-items: center; justify-content: space-between;
        gap: 20px; flex-wrap: wrap; margin-top: 34px; padding: 22px 26px;
        background: #ffffff; border: 1px solid #ece4d5;
        border-left: 3px solid #cea24b; border-radius: 10px;
      }
      .tmvCtaText { margin: 0; font-size: 15px; font-weight: 600; color: #1f1c18; }
      .tmvBtn {
        flex-shrink: 0; padding: 14px 30px; border: none; border-radius: 8px;
        background: #cea24b; color: #fff; font-size: 11.5px; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
        transition: background 0.22s ease, transform 0.15s ease;
      }
      .tmvBtn:hover { background: #f5b800; transform: translateY(-1px); }

      @media (max-width: 640px) {
        .tmv { padding: 40px 0 44px; }
        .tmvInner { padding: 0 16px; }
        .tmvTitle { font-size: 1.35rem; }
        .tmvHead { margin-bottom: 24px; }
        .tmvScore { font-size: 25px; }
        .tmvCard { flex-basis: 278px; width: 278px; min-height: 196px; margin-right: 14px; }
        .tmvTrackA { animation-duration: 46s; }
        .tmvTrackB { animation-duration: 58s; }
        .tmvBtn { width: 100%; }
      }

      /* Motion is decorative. Without it the rows become a normal
         horizontal scroller, so every review is still reachable. */
      @media (prefers-reduced-motion: reduce) {
        .tmvTrack { animation: none; }
        .tmvRow {
          overflow-x: auto;
          -webkit-mask-image: none;
                  mask-image: none;
        }
        .tmvCard:hover { transform: none; }
      }
    `}</style>
  </section>
);

/* ============================================================
   FAQ - the questions a guest actually has before saying yes.
   ============================================================ */
const FAQS = [
  {
    q: 'What exactly is the Iconic Skyhub showcase?',
    a: 'An invite-only sundowner on the rooftop Skyhub at Tulip Monsella. You see the amenity deck and the residences in person, meet our senior advisors, and get your questions answered over the evening rather than over a phone call.',
  },
  {
    q: 'Do I need to register, and is there any charge?',
    a: 'Yes, please register - entry is by invitation and places are limited. There is no charge. Once you submit the form our team calls you to confirm your place and share the entry details.',
  },
  {
    q: 'Where is it and how do I get there?',
    a: 'Tulip Monsella Skyhub, Sector 53, Golf Course Road, Gurgaon - a few minutes from the Sector 53-54 Rapid Metro station. Our team will share directions and on-site arrangements when they call to confirm.',
  },
  {
    q: 'Can I bring my spouse or family?',
    a: 'Yes. Most guests come as a couple or family. Please mention it when our team calls so we can plan for the evening.',
  },
  {
    q: 'Will I be able to see the actual apartments?',
    a: 'Yes. You can walk through the residences - 3.5, 4.5 and 5.5 BHK homes from 2,299 sq. ft. onwards - as they stand today, not as renders.',
  },
  {
    q: 'What does "OC applying soon" mean for me?',
    a: 'The Occupancy Certificate is the approval that allows residents to move in. The project is at the stage where it is being applied for, which is why possession is close. Our advisors will give you the current status and expected timelines on the evening.',
  },
  {
    q: 'What is the price?',
    a: 'Homes start from Rs. 7.99 Cr. Final pricing depends on the tower, floor and configuration you choose, so our advisors will take you through the live options and payment plans in person.',
  },
  {
    q: 'Am I committing to anything by attending?',
    a: 'No. The evening is to help you see the address properly and decide in your own time. There is no obligation to book.',
  },
];

const Faq = ({ onRsvp }) => {
  const [open, setOpen] = useState(0);

  return (
    <section className="tmq">
      <div className="tmqInner">
        <p className="tmqEyebrow">Before you come</p>
        <h2 className="tmqTitle">Questions guests usually ask</h2>
        <span className="tmqRule" />

        <div className="tmqList">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className={`tmqItem ${open === i ? 'tmqItemOpen' : ''}`}
            >
              <button
                type="button"
                className="tmqQ"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="tmqQText">{f.q}</span>
                <span className="tmqIcon">{open === i ? '-' : '+'}</span>
              </button>
              {open === i && <p className="tmqA">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="tmqCta">
          <p className="tmqCtaText">
            Still deciding? Register anyway &mdash; our team will call and answer
            anything that is not covered here.
          </p>
          <button type="button" className="tmqBtn" onClick={onRsvp}>
            Reserve My Seat
          </button>
        </div>
      </div>

      <style jsx>{`
        .tmq { background: #faf8f4; }
        .tmqInner { max-width: 900px; margin: 0 auto; padding: 56px 24px 62px; }
        .tmqEyebrow {
          margin: 0 0 8px; font-size: 10px; letter-spacing: 4px;
          text-transform: uppercase; color: #a99a80; font-weight: 600;
        }
        .tmqTitle { margin: 0; font-size: 2rem; font-weight: 700; color: #d4a64a; }
        .tmqRule { display: block; width: 52px; height: 2px; margin: 12px 0 28px; background: #d4a64a; }
        .tmqList { border-top: 1px solid #e9e1d3; }
        .tmqItem { border-bottom: 1px solid #e9e1d3; }
        .tmqQ {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 18px 4px; background: none; border: none; cursor: pointer;
          text-align: left;
        }
        .tmqQText {
          font-size: 15.5px; font-weight: 600; line-height: 1.5; color: #1f1c18;
        }
        .tmqItemOpen .tmqQText { color: #b08d4f; }
        .tmqIcon {
          flex-shrink: 0; width: 26px; height: 26px; display: flex;
          align-items: center; justify-content: center; border-radius: 50%;
          background: #f0e7d6; color: #a08a5e; font-size: 16px; font-weight: 700;
          line-height: 1;
        }
        .tmqA {
          margin: 0; padding: 0 4px 20px;
          font-size: 14px; line-height: 1.85; color: #5c574f;
        }
        .tmqCta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap; margin-top: 32px; padding: 22px 26px;
          background: #ffffff; border: 1px solid #eee7db; border-left: 3px solid #cea24b;
          border-radius: 10px;
        }
        .tmqCtaText { margin: 0; font-size: 15px; font-weight: 600; color: #1f1c18; }
        .tmqBtn {
          flex-shrink: 0; padding: 14px 30px; border: none; border-radius: 8px;
          background: #0b6e21; color: #fff; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
          transition: background 0.22s ease, transform 0.15s ease;
        }
        .tmqBtn:hover { background: #0d8429; transform: translateY(-1px); }
        @media (max-width: 600px) {
          .tmqInner { padding: 40px 16px 46px; }
          .tmqTitle { font-size: 1.35rem; }
          .tmqQText { font-size: 14.5px; }
          .tmqCta { justify-content: stretch; }
          .tmqBtn { width: 100%; }
        }
      `}</style>
    </section>
  );
};

const AboutBody = () => (
  <>
    Join us for an exclusive sundowner showcase of <strong>Iconic Skyhub</strong> at
    {' '}<strong>Tulip Monsella</strong> &mdash; a landmark address on Golf Course Road,
    with the <span className="tmOcTag">OC Applying Soon</span>. Experience the
    residences, the amenities and the skyline views first hand, at the height they
    were designed to be seen from.
    <br /><br />
    The evening is hosted by Inframantra at the Tulip Monsella Skyhub, Sector 53,
    Gurgaon. Meet our senior advisors, walk through the project up close, and get
    clarity on pricing, possession timelines and inventory &mdash; over conversations,
    not brochures.

    <style jsx>{`
      .tmOcTag {
        display: inline-block;
        padding: 2px 10px;
        background: #cea24b;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: #ffffff;
        white-space: nowrap;
      }
    `}</style>
  </>
);

function TulipMonsellaEvent() {

  const router = useRouter();

  const { utm_content } = router.query;

  // ============================================
  // POPUP STATE
  // ============================================
  // Opens automatically once, when "Our Story" scrolls into view (see below).
  const [showPopup, setShowPopup] = useState(false);

  // ============================================
  // STORE SOURCE FROM UTM
  // ============================================
  useEffect(() => {

    if (!router.isReady) return;
    if (typeof window === "undefined") return;
    if (utm_content === "KC") {
      localStorage.setItem("source", "google");
    } else {
      localStorage.setItem("source", "ADS");
    }

  }, [router.isReady,utm_content ]);

  // ============================================
  // SIDEBAR
  // ============================================
  useEffect(() => {

    const elements =
      document.querySelector('.cta_visible');

    if (elements) {
      elements.style.display = 'none';
    }

    return () => {

      if (elements) {
        elements.style.display = 'flex';
      }

    };

  }, []);

  // ============================================
  // SCROLL REVEAL
  // Elements start visible in CSS; this effect adds the hidden class and
  // then reveals on scroll. So if JS never runs, nothing is left invisible.
  // Only opacity/transform are animated - no layout impact.
  // ============================================
  useEffect(() => {

    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SELECTOR = [
      '.eventContainer .headingWrapper',
      '.eventContainer .storyText',
      '.reg-titleBlock',
      '.reg-gallery-col',
      '.reg-form-col',
      '.section1 .headingWrapper',
      '.section1 .storyText',
      '.section1 .videoBox',
    ].join(',');

    const targets = Array.from(document.querySelectorAll(SELECTOR));
    if (!targets.length) return;

    targets.forEach((el, i) => {
      el.classList.add('tmReveal');
      // small stagger so siblings arrive in sequence rather than together
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('tmRevealIn');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => io.observe(el));

    // FAILSAFE: whatever has not been revealed after 2.5s gets revealed
    // anyway. Content must never be left invisible because an observer
    // did not fire (odd scroll containers, restored scroll positions, etc).
    const failsafe = setTimeout(() => {
      targets.forEach((el) => el.classList.add('tmRevealIn'));
      io.disconnect();
    }, 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };

  }, []);

  // ============================================
  // AUTO POPUP - ONCE, WHEN "OUR STORY" COMES INTO VIEW
  // Fires a single time per page load (the observer disconnects itself).
  // Closing it will not bring it back; the Enquire and MORE INFO buttons
  // reopen it on demand.
  // ============================================
  useEffect(() => {

    if (typeof window === 'undefined') return;

    // .section1 is the "Our Story" section (components/events/eventInfo).
    const target = document.querySelector('.section1');
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setShowPopup(true);
          io.disconnect();   // once only
        });
      },
      { threshold: 0.15 }
    );

    io.observe(target);

    return () => io.disconnect();

  }, []);

  // ============================================
  // HANDLE CLOSE
  // ============================================
  const handlePopupClose = (value) => {
    setShowPopup(value);
  };

  return (

    <>
      <Wrapper
        title="Iconic Skyhub at Tulip Monsella | Exclusive Sundowner Showcase | INFRAMANTRA"
        description="An exclusive sundowner showcase of Iconic Skyhub at Tulip Monsella, Sector 53, Gurgaon on 6th September, 4:30 PM onwards. The Occupancy Certificate is being applied for. RSVP with Inframantra."
        seo="noindex"
      >

        {/* HEADER */}
        <Header
          name={EVENT_NAME}
          locations={EVENT_LOCATIONS}
          cities={EVENT_CITIES}
          cityDateMap={EVENT_CITY_DATE_MAP}
          phoneCountry="in"
          showCity={false}
          showDate={false}
          eventDateLabel="6th September | 4:30 PM Onwards"
          compactTitle
          highlightVenue
          premiumLocation
          bgImage="/banner/ty.avif"
          bgImageMobile="/banner/tulip-skyhub-mobile-portrait.webp"
          showOverlayArt={false}
          showLocationCard={false}
          fitBanner
          imgAlt="Iconic Skyhub at Tulip Monsella"
        />

        {/* COUNTDOWN */}
        <Countdown onRsvp={() => setShowPopup(true)} />

        {/* ABOUT */}
        <AboutEvent
          name={EVENT_NAME}
          heading="About the Showcase"
          body={<AboutBody />}
          compact
          cities={EVENT_CITIES}
          cityDateMap={EVENT_CITY_DATE_MAP}
          phoneCountry="in"
          showCity={false}
          showDate={false}
          eventDateLabel="6th September | 4:30 PM Onwards"
          compactTitle
        />

        {/* NEARBY & CONNECTIVITY */}
        <LazySection minHeight={520}>
          <Connectivity onRsvp={() => setShowPopup(true)} />
        </LazySection>

        {/* GALLERY + SINGLE PROJECT */}
        <EventGallery
          title="Reserve Your Exclusive Access"
          projectIds={EVENT_PROJECT_IDS}
          images={EVENT_GALLERY}
          detailed
          onEnquire={() => setShowPopup(true)}
        />

        {/* EVENT INFO */}
        <EventInfo compact portrait videos={EVENT_VIDEOS} />

        {/* TESTIMONIALS */}
        <LazySection minHeight={620}>
          <Testimonials onRsvp={() => setShowPopup(true)} />
        </LazySection>

        {/* FAQ */}
        <LazySection minHeight={560}>
          <Faq onRsvp={() => setShowPopup(true)} />
        </LazySection>

        {/* STICKY */}
        <Sticky
          name={EVENT_NAME}
          url="/property/tulip-monsella-sector-53-gurgaon"
          onMoreInfo={() => setShowPopup(true)}
        />

        {/* POPUP */}
        <TulipEventPopup
          open={showPopup}
          onClose={handlePopupClose}
          name={EVENT_NAME}
        />

      </Wrapper>

      {/* Reveal + text animation styles. Global so they can reach elements
          rendered by the shared event components, but injected only while
          this page is mounted. */}
      <style jsx global>{`
        /* a lazily mounted section fades up as it arrives */
        .tmLazy { opacity: 0; }
        .tmLazyIn {
          opacity: 1;
          animation: tmLazyIn 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }

        @keyframes tmLazyIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tmReveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
                      transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
          will-change: opacity, transform;
        }

        .tmRevealIn {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- text animations --- */

        /* headings ease in from slightly tighter tracking */
        .tmReveal.headingWrapper h2,
        .tmReveal h2 {
          animation: none;
        }

        .tmRevealIn.headingWrapper h2,
        .tmRevealIn > h2 {
          animation: tmTextIn 0.85s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }

        @keyframes tmTextIn {
          from {
            opacity: 0;
            letter-spacing: -0.02em;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            letter-spacing: normal;
            transform: translateY(0);
          }
        }

        /* the gold rule under the section title draws itself in */
        .tmRevealIn .reg-titleRule,
        .reg-titleBlock.tmRevealIn .reg-titleRule {
          animation: tmRuleGrow 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s both;
          transform-origin: left center;
        }

        @keyframes tmRuleGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* body copy settles a touch after its heading */
        .tmRevealIn.storyText {
          animation: tmCopyIn 0.9s ease 0.1s both;
        }

        @keyframes tmCopyIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tmLazy,
          .tmLazyIn,
          .tmReveal,
          .tmRevealIn,
          .tmRevealIn > h2,
          .tmRevealIn.storyText,
          .tmRevealIn .reg-titleRule {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default TulipMonsellaEvent;
