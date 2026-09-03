import { useRef, useState, useEffect } from "react";
import StatisticalInsight from "./StatisticalInsighData.jsx";
import { FaRegLaugh, FaHandshake, FaAward } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import styles from "./StaticInsight.module.css";

function StatisticalInsightsSection() {
  const [homePageInsightsSection] = useState([
    {
      title: "Developer Partners",
      icon: <FaHandshake />,
      end: "50",
      suffix: "+",
      duration: 2.2,
    },
    {
      title: "Happy Customers",
      icon: <FaRegLaugh />,
      end: "3500",
      suffix: "+",
      duration: 2.2,
    },
    {
      title: "Amazing Team Members",
      icon: <GrGroup />,
      end: "170",
      suffix: "+",
      duration: 2.2,
    },
    {
      title: "Awards & Recognition",
      icon: <FaAward />,
      end: "50",
      suffix: "+",
      duration: 2.2,
    },
  ]);

  const [isVisible, setIsVisible] = useState(new Array(homePageInsightsSection.length).fill(false));
  const refEntries = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refEntries.current.findIndex((ref) => ref === entry.target);
            setIsVisible((prev) => prev.map((visible, i) => (i === index ? true : visible)));
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.35,
      }
    );

    refEntries.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refEntries.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className={styles.statisticalInsightsSectionWrapper}>
      <div className={styles.statisticalInsightsSectionGridContainer}>
        {homePageInsightsSection.map((val, index) => (
          <div
            ref={(el) => (refEntries.current[index] = el)}
            className={`${styles.statisticalInsightsContainer} ${
              isVisible[index] ? styles.in : ""
            }`}
            style={{ animationDelay: `${index * 0.12}s` }}
            key={index}
          >
            <div className={styles.statIcon}>{val.icon}</div>
            <div className={styles.statText}>
              <StatisticalInsight
                suffix={val.suffix}
                end={val.end}
                duration={val.duration}
                isVisible={isVisible[index]}
              />
              <div className={styles.statisticalInsightTitle}>{val.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticalInsightsSection;
