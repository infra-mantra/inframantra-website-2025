import { useRef, useState, useEffect } from "react";
import StatisticalInsight from "./statisticalInsightWrapper/statisticalInsighData";
import { FaBuilding, FaRegLaugh } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import {

  MdSquareFoot,
  
} from "react-icons/md";
import styles from "./staticInsight.module.css";

function StatisticalInsightsSection() {
  const [homePageInsightsSection] = useState([
    {
      title: "Properties Operated",
      icon: <FaBuilding />,
      end: "515",
      duration: 2.2,
    },
    {
      title: "Amazing Team Members",
      icon: <GrGroup />,
      end: "138",
      duration: 2.2,
    },
    {
      title: "Happy Customers",
      icon: <FaRegLaugh />,
      end: "2493",
      duration: 2.2,
    },
    {
      title: "Total Sq. Ft.",
      icon: <MdSquareFoot />,
      end: "18153396",
      duration: 2.2,
    },
   
  ]);

  const [isVisible, setIsVisible] = useState(
    new Array(homePageInsightsSection.length).fill(false)
  );
  const refEntries = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refEntries.current.findIndex(
              (ref) => ref === entry.target
            );
            setIsVisible((prev) =>
              prev.map((visible, i) => (i === index ? true : visible))
            );
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
