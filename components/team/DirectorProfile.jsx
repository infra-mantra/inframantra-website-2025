import React from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./DirectorProfile.module.css";

/*
  Director profile (/team/[teamId]) — an editorial column rather than a
  hero-and-cards landing page.

  The only genuinely person-specific content here is five or six dated career
  notes of a sentence or two each, and the imagery is the least reliable part of
  the page: one director's journey images are all dead (a retired S3 bucket, see
  components/lib/teamImages.js), testimonial avatars come back as empty strings,
  and the award files have no titles anywhere in the CMS. So the year carries the
  design, not the photograph — which makes the image-free variant the better
  looking of the two rather than a degraded one.

  Every derived value (year split, prefix strip, publisher list, which
  testimonials to show, formatted dates) is computed in getStaticProps. This file
  does no parsing and holds no state, so the server HTML and the hydrated render
  cannot disagree.

  Class names carry a `dpf` prefix because next.config.js sets WANT_HASH = false —
  module class names are emitted verbatim into one global namespace, so an
  unprefixed `.card` or `.grid` here would collide with the global stylesheets.
*/

const Kicker = ({ children }) => <p className={s.dpfKicker}>{children}</p>;

/* 1 — Masthead ---------------------------------------------------------- */
function Masthead({ name, designation, image }) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    <header className={`${s.dpfMast} ${image ? "" : s.dpfMastSolo}`}>
      <div className={s.dpfMastWords}>
        <span className={s.dpfRule} />
        {designation && <Kicker>{designation}</Kicker>}
        <h1 className={s.dpfName}>
          {parts.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </h1>
      </div>

      {image && (
        <figure className={s.dpfPortrait}>
          <Image
            src={image}
            alt={name || "Portrait"}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 18%"
            priority
            sizes="(max-width: 900px) 92vw, 420px"
          />
        </figure>
      )}
    </header>
  );
}

/* 2 — Featured in ------------------------------------------------------- */
function FeaturedIn({ publishers }) {
  if (!publishers || publishers.length === 0) return null;

  return (
    <section className={s.dpfBand} aria-label="Featured in">
      <div className={s.dpfBandInner}>
        <span className={s.dpfBandLabel}>Featured in</span>
        {publishers.map((p) => (
          <span key={p} className={s.dpfPressName}>
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

/* 3 — Standfirst -------------------------------------------------------- */
function Standfirst({ description, name, designation }) {
  if (!description) return null;

  return (
    <section className={s.dpfStand}>
      <p className={s.dpfStandText}>{description}</p>
      <p className={s.dpfStandBy}>
        <span className={s.dpfRuleSm} />
        {[name, designation].filter(Boolean).join(", ")}
      </p>
    </section>
  );
}

/* 4 — The Journey ------------------------------------------------------- */
function Journey({ journey, hasFigures }) {
  if (!journey || journey.length === 0) return null;
  const total = String(journey.length).padStart(2, "0");

  return (
    <section className={s.dpfJourney}>
      <Kicker>Career</Kicker>
      <h2 className={s.dpfH2}>The journey so far</h2>

      {/* Plain anchors: in-page navigation that costs no JS and cannot hide content. */}
      {journey.length > 1 && (
        <nav className={s.dpfRail} aria-label="Jump to a year">
          {journey.map((e, i) => (
            <a key={e.id} href={`#dpf-yr-${i + 1}`} className={s.dpfRailLink}>
              {e.yearHead}
            </a>
          ))}
        </nav>
      )}

      <ul className={`${s.dpfEntries} ${hasFigures ? "" : s.dpfJourneyNoFigs}`}>
        {journey.map((e, i) => (
          <li key={e.id} id={`dpf-yr-${i + 1}`} className={s.dpfEntry}>
            <div className={s.dpfYearCell}>
              <span className={s.dpfOrdinal}>
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
              <span className={s.dpfRuleMd} />
              <span className={s.dpfYear}>{e.yearHead}</span>
              {e.yearTail && (
                <>
                  <span className={s.dpfRuleXs} />
                  <span className={s.dpfYearTail}>{e.yearTail}</span>
                </>
              )}
            </div>

            <div className={s.dpfBody}>{e.description}</div>

            {/* Rendered only in the with-figures mode, so the image-free variant
                issues no requests and leaves no empty gutter. */}
            {hasFigures && e.image && (
              <figure className={s.dpfFigure}>
                <img src={e.image} alt="" loading="lazy" decoding="async" />
              </figure>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 5 — In the Press ------------------------------------------------------ */
function PressItem({ article }) {
  return (
    <li className={`${s.dpfPressItem} ${article.image ? "" : s.dpfPressNoThumb}`}>
      <div>
        <p className={s.dpfMeta}>
          {article.authored ? `Written by ${article.source}` : article.source}
          {article.date && <time className={s.dpfDate}>{article.date}</time>}
        </p>
        <h3 className={s.dpfPressTitle}>
          <a href={article.href}>{article.title}</a>
        </h3>
      </div>
      {article.image && (
        <div className={s.dpfThumb}>
          <img src={article.image} alt="" loading="lazy" decoding="async" />
        </div>
      )}
    </li>
  );
}

function Press({ articles }) {
  if (!articles || articles.length === 0) return null;

  // Lead with something he wrote when there is one; otherwise the first item.
  const authoredIndex = articles.findIndex((a) => a.authored);
  const leadIndex = authoredIndex === -1 ? 0 : authoredIndex;
  const lead = articles[leadIndex];
  const rest = articles.filter((_, i) => i !== leadIndex);

  return (
    <section className={s.dpfPress}>
      <Kicker>Coverage &amp; writing</Kicker>
      <h2 className={s.dpfH2}>In the press</h2>

      <div className={s.dpfPressGrid}>
        <article className={`${s.dpfLead} ${lead.image ? "" : s.dpfLeadNoFig}`}>
          {lead.image && (
            <figure className={s.dpfLeadFig}>
              <img src={lead.image} alt="" loading="lazy" decoding="async" />
            </figure>
          )}
          <p className={s.dpfMeta}>
            {lead.authored ? `Written by ${lead.source}` : lead.source}
            {lead.date && <time className={s.dpfDate}>{lead.date}</time>}
          </p>
          <h3 className={s.dpfLeadTitle}>
            <a href={lead.href}>{lead.title}</a>
          </h3>
        </article>

        {rest.length > 0 && (
          <ul className={s.dpfPressIndex}>
            {rest.map((a) => (
              <PressItem key={a.id} article={a} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* 6 — Awards ------------------------------------------------------------ */
function Awards({ awards }) {
  if (!awards || awards.length === 0) return null;

  return (
    <section className={s.dpfAwards} aria-label="Awards and recognitions">
      <div className={s.dpfAwardsInner}>
        {/* Wording matches components/about/Award.jsx, which ships these same
            three files — the site should not label them differently one click
            apart. No captions or years exist for them anywhere in the CMS. */}
        <h2 className={s.dpfH2}>Awards &amp; Recognitions</h2>
        <div className={s.dpfAwardGrid}>
          {awards.map((src) => (
            <div key={src} className={s.dpfAwardTile}>
              <img src={src} alt="InfraMantra award photograph" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7 — Testimonials ------------------------------------------------------ */
function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length < 2) return null;

  return (
    <section className={s.dpfClients}>
      <Kicker>From our clients</Kicker>
      <h2 className={s.dpfH2}>What InfraMantra clients say</h2>

      <div className={s.dpfClientGrid}>
        {testimonials.map((t) => (
          <figure key={t.id} className={s.dpfLetter}>
            <blockquote className={s.dpfQuote}>{t.quote}</blockquote>
            <figcaption className={s.dpfByline}>
              {/* Plain <img>: apitest.inframantra.com is not in next.config.js
                  `domains`, so next/image would throw on these avatars. */}
              {t.image ? (
                <img
                  className={s.dpfAvatar}
                  src={t.image}
                  alt=""
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className={s.dpfInitial} aria-hidden="true">
                  {(t.name || "?").charAt(0)}
                </span>
              )}
              <span className={s.dpfClientName}>{t.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* 8 — Colophon ---------------------------------------------------------- */
function Colophon({ name, designation }) {
  return (
    <footer className={s.dpfColophon}>
      <p className={s.dpfColophonWho}>
        {name && <strong>{name}</strong>}
        {designation && <span>{designation}</span>}
      </p>
      <Link href="/about-us">
        <a className={s.dpfColophonLink}>More about InfraMantra</a>
      </Link>
    </footer>
  );
}

export default function DirectorProfile({ data }) {
  const {
    heading = {},
    journey,
    journeyHasFigures,
    pressArticles,
    publishers,
    testimonials,
    awards,
  } = data || {};

  return (
    <div className={s.dpfRoot}>
      <Masthead name={heading.name} designation={heading.designation} image={heading.image} />
      <FeaturedIn publishers={publishers} />
      <Standfirst
        description={heading.description}
        name={heading.name}
        designation={heading.designation}
      />
      <Journey journey={journey} hasFigures={journeyHasFigures} />
      <Press articles={pressArticles} />
      <Awards awards={awards} />
      <Testimonials testimonials={testimonials} />
      <Colophon name={heading.name} designation={heading.designation} />
    </div>
  );
}
