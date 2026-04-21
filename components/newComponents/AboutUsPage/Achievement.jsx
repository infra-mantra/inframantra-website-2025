"use client";
import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "./HeroSection.module.css";
import { FcApproval } from "react-icons/fc";

const stats = [
  { end: 50, suffix: "+", label: "Developer partners" },
  { end: 3500, suffix: "+", label: "Happy Customers" },
  { end: 170, suffix: "+", label: "Amazing Team Members" },
  
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
        <h1 className={styles.mainTitle}>Trusted Real Estate Consultancy</h1>

        <div className={styles.since}>Since 2017</div>
         <div ></div>
                     <p
  style={{
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    fontSize: "1.2rem",
    alignItems: "center",
  }}
>
  <span
    style={{
      color: "#E7B554",
      fontSize: "25px",
      marginRight: "10px",
    }}
  >
    <FcApproval />
  </span>
  HARERA/GGM/1813/1408/2022/181
</p>

        <p className={styles.description}>
   Powered by a customer-first approach, Inframantra connects you to prime real estate opportunities across India.      
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