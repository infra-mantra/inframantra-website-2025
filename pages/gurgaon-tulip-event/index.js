import React, {
  useEffect,
  useState
} from 'react';

import { useRouter } from 'next/router';

import EventInfo from '../../components/events/eventInfo';
import Sticky from '../../components/nri/StickySidebar';
import Wrapper from '../../components/UI/Wrapper';
import EventGallery from '../../components/events/formGallery';
import Header from '../../components/events/HeaderSec';
import AboutEvent from '../../components/events/aboutEvent';
import TulipEventPopup from '../../components/events/TulipEventPopup';

// ============================================
// EVENT DETAILS  (Iconic Skyhub at Tulip Monsella)
// ============================================
const EVENT_NAME = 'Tulip Monsella Skyhub (Event Specific)';

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
  // Opens automatically once, 10s after load (see the timer below).
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

    return () => io.disconnect();

  }, []);

  // ============================================
  // AUTO POPUP - ONCE, AFTER 10 SEC
  // Fires a single time per page load. Closing it will not bring it back;
  // the Enquire and MORE INFO buttons reopen it on demand.
  // ============================================
  useEffect(() => {

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);

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
          bgImage="/banner/v2.png"
          bgImageMobile="/banner/tulip-skyhub-mobile-portrait.webp"
          showOverlayArt={false}
          showLocationCard={false}
          fitBanner
          imgAlt="Iconic Skyhub at Tulip Monsella"
        />

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
