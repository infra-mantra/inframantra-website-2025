import React, { useRef, useState, useEffect } from "react";
import StatisticalInsight from "./statisticalInsightWrapper/statisticalInsighData";
import { FaBuilding, FaRegLaugh } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import {
  MdCurrencyRupee,
  MdSquareFoot,
  MdOutlineCreditScore,
} from "react-icons/md";
import styles from "./staticInsight.module.css";

function StatisticalInsightsSection() {
  const [homePageInsightsSection] = useState([
    {
      title: "Properties Operated",
      icon: <FaBuilding />,
      end: "515",
      duration: "10",
    },
    {
      title: "Amazing Team Members",
      icon: <GrGroup />,
      end: "138",
      duration: "10",
    },
    {
      title: "Happy Customers",
      icon: <FaRegLaugh />,
      end: "2493",
      duration: "10",
    },
    {
      title: "Total Sq. Ft.",
      icon: <MdSquareFoot />,
      end: "18153396",
      duration: "10",
    },
    {
      title: "Total Business Generated",
      icon: <MdCurrencyRupee />,
      end: "1140",
      suffix: " Crores",
      duration: "10",
    },
    {
      title: "Total Loans Provided",
      icon: <MdOutlineCreditScore />,
      end: "167",
      duration: "10",
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
        threshold: 0.5,
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
            className={styles.statisticalInsightsContainer}
            key={index}
          >
            <div style={{ fontSize: "40px", color: "#E7B554" }}>
              {val.icon}
            </div>
            <StatisticalInsight
              suffix={val.suffix}
              end={val.end}
              duration={val.duration}
              isVisible={isVisible[index]}
            />
            <div className={styles.statisticalInsightTitle}>{val.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticalInsightsSection;
