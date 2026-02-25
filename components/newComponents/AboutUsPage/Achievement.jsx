"use client";
import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "./HeroSection.module.css";

const stats = [
  { end: 515, suffix: "+", label: "Properties Operated" },
  { end: 2493, suffix: "+", label: "Happy Customers" },
  { end: 138, suffix: "+", label: "Amazing Team Members" },
  { end: 18.15, suffix: "M+", label: "Total Sq. Ft." },
  { end: 50, suffix: "+", label: "Awards & Recognition" },
];

export default function HeroSection() {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.4 } // 40% visible triggers animation
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>Trusted Real Estate Experts</h1>

        <div className={styles.since}>Since 2017</div>

        <p className={styles.description}>
          Since 2017, we've been helping people find their dream homes, offices,
          and the right investments in property across Gurgaon and Delhi NCR.
        </p>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statBox}>
              <h2>
                {startCount && (
                  <CountUp
                    start={0}
                    end={stat.end}
                    duration={2.5}
                    separator=","
                  />
                )}
                {stat.suffix}
              </h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}