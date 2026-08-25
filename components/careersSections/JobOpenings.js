import React, { useState, useEffect } from "react";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import styles from "./jobOpening.module.css";
import JobAccordion from "./JobAccordion"

export default function JobSection({ data }) {
  const [jobData, setJobData] = useState(data || []);
  const [openIndex, setOpenIndex] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    setJobData(data || []);
  }, [data]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };



  return (
    <section className={styles.container1} id="job">
      <h2 className={styles.jobOpeningHeading}>JOBS AT INFRAMANTRA</h2>

      <div className={styles.list}>
        {jobData.map((job, index) => (
          <div key={index} className={styles.cardContainer}>

            {/* ✅ Clickable Card */}
            <div
              className={`${styles.card3} ${openIndex === index ? styles.cardOpen : ""}`}
              onClick={() => handleToggle(index)}
            >
              <div className={styles.left}>
                <h3 className={styles.jobSpantitle}>{job.department}</h3>
                <p className={styles.department}>{job.title}</p>

                <div className={styles.meta}>
                  <span className={styles.jobSpan}>
                    <MdWork className={styles.icon} /> {job.experience}
                  </span>

                  <span className={styles.jobSpan}>
                    <FaBriefcase className={styles.icon} /> {job.jobType}
                  </span>

                  <span className={styles.jobSpan}>
                    <FaMapMarkerAlt className={styles.icon} /> {job.location}
                  </span>
                </div>
              </div>

              <div className={styles.right}>
                <button
                  className={styles.applyBtn}

                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(index);
                  }}
                >
                  {openIndex === index ? "Close" : "Open"}
                </button>
              </div>
            </div>

            {/* ✅ Description BELOW */}
            {openIndex === index && (
              <div className={styles.descriptionBox}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: job.description,
                  }}
                />
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <button
                    className={styles.applyBtn}
                    onClick={() => setApplyJob(job)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {applyJob && (
          <JobAccordion data={applyJob} isOpen={!!applyJob} onClose={() => setApplyJob(null)} />
        )}
      </div>
    </section>
  );
}