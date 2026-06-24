import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import styles from "./calculators.module.css";
import { CALCULATORS } from "./calculatorList";

/* Grid of calculator cards. Used full on the hub page and filtered (exclude
   the current page) in the "Related calculators" footer on each sub-page. */
function CalculatorCards({ exclude }) {
  const items = exclude
    ? CALCULATORS.filter((c) => c.slug !== exclude)
    : CALCULATORS;

  return (
    <div className={styles.cardGrid}>
      {items.map((c) => {
        const Icon = c.Icon;
        return (
          <Link key={c.slug} href={c.href}>
            <a className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
              </div>
              <p className={styles.cardDesc}>{c.desc}</p>
              <span className={styles.cardLink}>
                Open calculator <FiArrowRight />
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}

export default CalculatorCards;
