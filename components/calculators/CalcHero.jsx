import React from "react";
import Link from "next/link";
import styles from "./Calculators.module.css";
import HeroBackdrop from "./heroArt/HeroBackdrop.jsx";
import HeroHouse from "./heroArt/HeroHouse.jsx";
import HeroCalculator from "./heroArt/HeroCalculator.jsx";
import HeroDonut from "./heroArt/HeroDonut.jsx";
import HeroBars from "./heroArt/HeroBars.jsx";
import HeroMoney from "./heroArt/HeroMoney.jsx";
import HeroPercent from "./heroArt/HeroPercent.jsx";

/* Shared animated hero for all calculator pages. The banner is built from
   independent motif layers (house, calculator, donut, bars, money, percent),
   each with its own animation, floating over the backdrop. */
function CalcHero({
  eyebrow = "Smart Property Tools",
  crumbLeaf,
  title,
  highlight,
  lede,
  badges = [],
}) {
  return (
    <section className={styles.hero}>
      <HeroBackdrop />
      <div className={styles.heroStage} aria-hidden="true">
        <HeroPercent />
        <HeroHouse />
        <HeroCalculator />
        <HeroDonut />
        <HeroBars />
        <HeroMoney />
      </div>
      <div className={styles.heroInner}>
        <img
          className={styles.heroBrand}
          src="https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogo(1).webp"
          alt="Inframantra"
          width="170"
          height="34"
          loading="eager"
        />
        <nav className={styles.heroCrumbs} aria-label="Breadcrumb">
          <Link href="/">
            <a>Home</a>
          </Link>{" "}
          /{" "}
          <Link href="/calculators">
            <a>Calculators</a>
          </Link>
          {crumbLeaf ? ` / ${crumbLeaf}` : ""}
        </nav>
        {eyebrow && <span className={styles.heroEyebrow}>{eyebrow}</span>}
        <h1 className={styles.heroTitle}>
          {title} {highlight && <span>{highlight}</span>}
        </h1>
        {lede && <p className={styles.heroLede}>{lede}</p>}
        {badges.length > 0 && (
          <div className={styles.heroBadges}>
            {badges.map((b, i) => (
              <span className={styles.heroBadge} key={i}>
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CalcHero;
