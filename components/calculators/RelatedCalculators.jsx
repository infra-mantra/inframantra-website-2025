import React from "react";
import styles from "./calculators.module.css";
import CalculatorCards from "./CalculatorCards";

/* "Related calculators" footer for sub-pages — internal links help SEO and
   keep users moving between the tools. Pass the current page slug to hide it. */
function RelatedCalculators({ exclude }) {
  return (
    <section className={styles.related}>
      <h2 className={styles.relatedHeading}>Other calculators</h2>
      <CalculatorCards exclude={exclude} />
    </section>
  );
}

export default RelatedCalculators;
