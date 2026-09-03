"use client";

import React, { useEffect, useState } from "react";
import styles from "./DeveloperSlide.module.css";
import Ajax1 from "../lib/ajax1.js";

export default function TopDevelopers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 12;

  const fetchDevelopers = async (pageNumber) => {
    try {
      setLoading(true);

      const res = await Ajax1({
        url: `/developer?page=${pageNumber}&limit=${limit}`,
      });

      const newDevelopers = res?.data?.data?.developers || [];

      if (pageNumber === 1) {
        setDevelopers(newDevelopers);
      } else {
        setDevelopers((prev) => [...prev, ...newDevelopers]);
      }

      if (newDevelopers.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers(page);
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className={styles.developerSlideSection}>
      <div className={styles.developerSlideContainer}>
        <h2 className={styles.developerSlideHeading}>Top Real Estate Developers</h2>

        <p className={styles.developerSlideSubtext}>
          We collaborate with the most reputed real-estate developers across Gurgaon, Delhi-NCR, and
          other major cities in India.
        </p>

        {loading && page === 1 ? (
          <p className={styles.developerSlideLoading}>Loading developers...</p>
        ) : (
          <>
            <div className={styles.developerSlideGrid}>
              {developers.map((dev) => (
                <div key={dev._id} className={styles.developerSlideCard}>
                  <img src={dev?.developerImg} alt={dev?.name} loading="lazy" />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button onClick={handleLoadMore} className={styles.loadMoreBtn} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
