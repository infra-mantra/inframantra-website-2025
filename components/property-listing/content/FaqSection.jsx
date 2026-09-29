import React, { useState } from "react";
import styles from "./FaqSection.module.css";

function FaqSection({
  totalProperties,
  type,
  name,
  state,
  city,
  locality,
  subLocality,
  highRise,
  readyToMove,
  customFaqs, // optional: [{ question|q, answer|a }] — overrides the auto-generated FAQs
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Generate dynamic area label based on type
  const getAreaLabel = () => {
    if (type === "subLocality" && subLocality && locality && city) {
      return `${subLocality}, ${locality}, ${city}`;
    } else if (type === "locality" && locality && city) {
      return `${locality}, ${city}`;
    } else if (type === "city" && city && state) {
      return `${city}, ${state}`;
    }
    return "";
  };

  const areaLabel = getAreaLabel();

  const faqData =
    Array.isArray(customFaqs) && customFaqs.length
      ? customFaqs.map((f, i) => ({
          id: i + 1,
          question: f.question ?? f.q,
          answer: f.answer ?? f.a,
        }))
      : type !== "search"
        ? [
            {
              id: 1,
              question: `What is the total number of properties for sale in ${areaLabel}?`,
              answer: `There are more than ${totalProperties} properties for sale in ${areaLabel}. These properties are developed by top real estate companies and offer excellent connectivity, modern amenities, and premium comfort.`,
            },
            {
              id: 2,
              question: `How many ready-to-move properties are available in ${areaLabel}?`,
              answer: `There are ${readyToMove}+ luxury ready-to-move properties available in ${areaLabel}. Limited inventory is available. Connect with an Inframantra property advisor to book a site visit today.`,
            },
            {
              id: 3,
              question: `How many high-rise apartments are available for sale in ${areaLabel}?`,
              answer: `There are ${highRise}+ high-rise apartments for sale in ${areaLabel}. These properties offer spacious layouts, ample ventilation, world-class amenities, and multi-level security.`,
            },
            {
              id: 4,
              question: `What types of properties are available for sale in ${areaLabel}?`,
              answer: `You can explore several property types for sale in ${areaLabel}, including 2–5 BHK apartments, duplexes, and penthouses designed to meet diverse lifestyle needs.`,
            },
          ]
        : [
            {
              id: 1,
              question: "What types of properties are available with Inframantra?",
              answer:
                "Inframantra offers a wide range of residential options, including 2–5 BHK apartments, duplexes, villas, and penthouses, thoughtfully designed to cater to diverse lifestyle needs.",
            },
            {
              id: 2,
              question: "Are the properties equipped with modern amenities?",
              answer:
                "Yes, all properties are equipped with world-class amenities such as clubhouses, green spaces, fitness centers, advanced security systems, and more, ensuring a comfortable and luxurious living experience.",
            },
            {
              id: 3,
              question: "Is the location well connected to major areas?",
              answer:
                "Absolutely! These residential developments are strategically located in rapidly growing neighborhoods with excellent connectivity to business districts, schools, hospitals, and essential daily conveniences.",
            },
            {
              id: 4,
              question: "Who are these properties ideal for?",
              answer:
                "These homes are ideal for families, working professionals, and investors seeking spacious layouts, modern living standards, and high long-term property value appreciation.",
            },
          ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Class names are prefixed lfq- because this project's CSS module names are
  // not hashed: the listing skeleton's ".faqHeading" (a grey 340x30 block) was
  // leaking onto this heading.
  return (
    <section className={styles["lfq-section"]}>
      <h2 className={styles["lfq-title"]}>Frequently Asked Questions</h2>

      <div className={styles["lfq-list"]}>
        {faqData.map((item, index) => {
          const open = activeIndex === index;
          return (
            <div key={item.id} className={`${styles["lfq-item"]} ${open ? styles["is-open"] : ""}`}>
              <button
                type="button"
                className={styles["lfq-q"]}
                onClick={() => toggleFAQ(index)}
                aria-expanded={open}
              >
                <span className={styles["lfq-num"]}>{item.id < 10 ? `0${item.id}` : item.id}</span>
                <span className={styles["lfq-text"]}>{item.question}</span>
                <span className={styles["lfq-chev"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {/* grid 0fr -> 1fr animates the height without measuring it */}
              <div className={styles["lfq-a-wrap"]}>
                <div className={styles["lfq-a"]}>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqSection;
