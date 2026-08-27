import React from 'react'
import Head from 'next/head'
import styles from './headerSe.module.css'
import LocationCard from './LocationCard'
import RegistrationForm from './RegistrationForm'

// Defaults = USA NRI Expo (used by /usa-nri-event).
// Pass locations / desktopImg / mobileImg / bgImage to re-skin for another event.
const DEFAULT_DESKTOP_IMG =
  'https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img-desktop-icon.png'
const DEFAULT_MOBILE_IMG =
  'https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img-icon.png'

function HeaderSec({
  name,
  locations,
  cities,
  cityDateMap,
  phoneCountry,
  showCity,
  showDate,
  eventDateLabel,
  compactTitle,
  highlightVenue,
  premiumLocation,
  desktopImg = DEFAULT_DESKTOP_IMG,
  mobileImg = DEFAULT_MOBILE_IMG,
  imgAlt = 'NRI Expo',
  bgImage,
  bgImageMobile,
  // The banner artwork can already carry the event wordmark/details, in which
  // case the text-over-image PNGs would just duplicate it.
  showOverlayArt = true,
  // Same for the date/venue panel - hide it when the banner already states them.
  showLocationCard = true,
  // A 16:9 banner gets badly cropped by the stylesheet's min-height:100vh.
  // This sizes the hero to the artwork instead, so nothing is cut off.
  fitBanner = false,
  // Copy rendered over the banner's empty area (desktop only).
  heroAside = null,
  // Small status flag drawn over the banner (e.g. "OC Applying Soon").
  bannerBadge = "",
}) {
  const hasCustomBg = Boolean(bgImage)
  const mobileBg = bgImageMobile || bgImage

  return (
    <section>
      {hasCustomBg && (
        <Head>
          {/* A CSS background is discovered late (after CSSOM), which hurts LCP.
              Preloading the exact file each breakpoint will use fixes that. */}
          <link
            rel="preload"
            as="image"
            href={bgImage}
            type="image/webp"
            media="(min-width: 769px)"
          />
          <link
            rel="preload"
            as="image"
            href={mobileBg}
            type="image/webp"
            media="(max-width: 768px)"
          />
        </Head>
      )}

      {/* Scoped override of the shared .bgImg background. Class name is unique,
          so it cannot collide under this project's unhashed CSS modules. */}
      {hasCustomBg && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .tmHeroBg { background-image: url("${bgImage}") !important; }
              ${
                fitBanner
                  ? `.tmHeroBg {
                       /* the <img> is the banner now - drop the background copy */
                       background-image: none !important;
                       min-height: 0 !important;
                       height: auto !important;
                       display: block !important;
                       padding: 0 !important;
                       position: relative;
                     }
                     .tmHeroPic, .tmHeroImg {
                       display: block;
                       width: 100%;
                       height: auto;
                     }
                     @media screen and (min-width: 993px) {
                       /* Float the form over the banner on desktop.
                          inset:0 alone loses the centering the flex parent gave
                          it, which pushed the form flush to the viewport edge
                          and under the floating CTA widget. margin:auto keeps
                          the 1400px overlay centred; the right padding clears
                          the widget. */
                       .tmHeroBg > .overlayContent {
                         position: absolute;
                         inset: 0;
                         margin: 0 auto;
                         padding: 0 96px 0 48px;
                         max-width: 1400px;
                       }
                     }
                     @media screen and (max-width: 992px) {
                       /* below the banner on tablet/phone, where there is no room */
                       .tmHeroBg > .overlayContent {
                         position: static;
                       }
                     }
                     .tmBannerBadge {
                       position: absolute;
                       top: 49%;
                       left: 4.4%;
                       z-index: 3;
                       display: inline-block;
                       padding: 0.55em 1.15em;
                       background: #cea24b;
                       color: #fff;
                       border-radius: 999px;
                       font-size: clamp(9px, 0.95vw, 14px);
                       font-weight: 700;
                       letter-spacing: 0.05em;
                       white-space: nowrap;
                       box-shadow: 0 4px 16px rgba(0,0,0,0.38);
                     }
                     `
                  : ''
              }
              ${
                fitBanner
                  ? /* the <picture> supplies the mobile art; re-declaring it as
                       a CSS background here would paint it a SECOND time behind
                       the img and tile it (the date appeared twice) */ ''
                  : `@media screen and (max-width: 768px) {
                       .tmHeroBg { background-image: url("${mobileBg}") !important; }
                     }`
              }
              .tmHeroAside { display: none; }
              @media screen and (min-width: 993px) {
                .tmHeroAside {
                  display: block;
                  max-width: 540px;
                  margin-top: 22px;
                  padding: 20px 24px 22px;
                  color: #f2efe9;
                  /* soft scrim so the copy stays legible over the city lights */
                  background: linear-gradient(135deg, rgba(12,14,20,0.62), rgba(12,14,20,0.34));
                  -webkit-backdrop-filter: blur(2px);
                  backdrop-filter: blur(2px);
                  border-left: 2px solid rgba(232,201,122,0.75);
                  border-radius: 4px;
                  text-shadow: 0 1px 10px rgba(0,0,0,0.5);
                }
              }
            `,
          }}
        />
      )}

      <div className={`${styles.bgImg} ${hasCustomBg ? 'tmHeroBg' : ''}`}>
        {/* Rendered as a real <img>, not a CSS background: `cover` was cropping
            the banner (and its text) whenever the container ratio drifted from
            16:9. An img with height:auto can never lose part of the artwork.
            Also better for LCP - the browser finds it in the HTML immediately. */}
        {hasCustomBg && fitBanner && (
          <picture className="tmHeroPic">
            <source media="(max-width: 768px)" srcSet={mobileBg} />
            <img
              className="tmHeroImg"
              src={bgImage}
              alt={imgAlt}
              fetchpriority="high"
              decoding="async"
            />
          </picture>
        )}

        {/* Status flag over the banner artwork. Live text rather than baked
            into the image, so it stays crisp and scales with the banner. */}
        {hasCustomBg && fitBanner && bannerBadge && (
          <span className="tmBannerBadge">{bannerBadge}</span>
        )}

        <div className={styles.overlayContent}>

          {/* LEFT CONTENT */}
          <div className={styles.leftSection}>
            {showOverlayArt && (
              <>
                <img
                  src={desktopImg}
                  alt={imgAlt}
                  className={styles.desktopImg}
                />

                <img
                  src={mobileImg}
                  alt={imgAlt}
                  className={styles.mobileImg}
                />
              </>
            )}

            {showLocationCard && (
              <LocationCard
                locations={locations}
                highlightVenue={highlightVenue}
                premium={premiumLocation}
              />
            )}

            {/* Optional copy overlaid on the banner's empty lower-left area.
                Desktop only - the mobile banner has no room for it. */}
            {heroAside && <div className="tmHeroAside">{heroAside}</div>}
          </div>

          {/* RIGHT FORM */}
          <div className={styles.rightSection}>
            <div className={styles.displayNone}>
           <RegistrationForm name={name} cities={cities} cityDateMap={cityDateMap} phoneCountry={phoneCountry} showCity={showCity} showDate={showDate} eventDateLabel={eventDateLabel} compactTitle={compactTitle} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeaderSec
