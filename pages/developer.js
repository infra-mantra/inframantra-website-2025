import React, { useState, useEffect, useRef } from "react";
import Section from "../components/shared/Section.jsx";
import Wrapper from "../components/shared/Wrapper.jsx";
import Link from "next/link";
import NoImage from "../components/shared/NoImage.jsx";
import PageHeader from "../components/shared/PageHeader.jsx";
import styles from "./developer.module.css";

// One developer-card placeholder (image + name + description + stats + button).
function DeveloperCardSkeleton() {
  return (
    <div className={styles.skelCard} aria-hidden="true">
      <div className={styles.skelImg} />
      <div className={styles.skelBody}>
        <div
          className={styles.skelBlock}
          style={{ height: 18, width: "55%", margin: "0 auto 16px" }}
        />
        <div className={styles.skelBlock} style={{ height: 12, marginBottom: 8 }} />
        <div className={styles.skelBlock} style={{ height: 12, marginBottom: 8 }} />
        <div className={styles.skelBlock} style={{ height: 12, width: "80%", marginBottom: 28 }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
          <div className={styles.skelBlock} style={{ height: 12, width: "42%" }} />
          <div className={styles.skelBlock} style={{ height: 12, width: "42%" }} />
        </div>
        <div
          className={styles.skelBlock}
          style={{ height: 40, width: 190, borderRadius: 8, margin: "0 auto" }}
        />
      </div>
    </div>
  );
}

export default function Developers({ allData }) {
  let data = {
    image: allData.meta.bannerImage,
    title: "Developers", // shown as the animated overlay on the banner
  };

  const itemsPerPage = 9;
  const maxPaginationButtons = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [developerData, setDeveloperData] = useState(allData.developer);
  const [totalDevelopers, setTotalDevelopers] = useState(allData.totalPages);
  const [loading, setLoading] = useState(false); // true while a new page fetches
  const [expanded, setExpanded] = useState({}); // developer id -> description expanded?
  const isFirst = useRef(true); // page 1 is already loaded from getStaticProps
  const totalPages = Math.ceil(totalDevelopers / itemsPerPage);

  const [image, setImage] = useState("");

  const handleImage = () => {
    setImage(window.innerWidth >= 769 ? "desktop" : "mobile");
    data.image =
      window.innerWidth >= 769
        ? "https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.1.avif"
        : "https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.2.avif";
  };

  useEffect(() => {
    handleImage();
    window.addEventListener("resize", handleImage);
    return () => {
      window.removeEventListener("resize", handleImage);
    };
  }, []);

  useEffect(() => {
    // Skip the first run — page 1 is already rendered from getStaticProps, so no
    // need to refetch (and no skeleton flash). Fetch + skeleton only on page change.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const fetchDevelopers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.apiUrl1}/developer?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await res.json();
        setDeveloperData(data.data.developers);
        setTotalDevelopers(data.data.totalDevelopers);
      } catch (err) {
        console.error("Failed to fetch developers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, [currentPage]);

  const visibleItems = developerData;

  const handlePageClick = (page) => setCurrentPage(page);
  const handlePrevClick = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNextClick = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handleStartClick = () => setCurrentPage(1);
  const handleEndClick = () => setCurrentPage(totalPages);

  const getPaginationRange = () => {
    const start = Math.max(currentPage - Math.floor(maxPaginationButtons / 2), 1);
    const end = Math.min(start + maxPaginationButtons - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginationRange = getPaginationRange();

  return (
    <Wrapper
      title={allData.meta.metaTitle}
      description={allData.meta.metaDescription}
      image={allData.meta.bannerImage}
    >
      <PageHeader data={data} />
      <Section
        classes={`${styles.aboutProjectWrapper} ${styles.pageWidthContainerDeve}`}
        pageWidth="container"
      >
        <div className={styles.sectionHeadDeveloper}>
          <h2>Our Developers</h2>
          <p className={styles.developerSubtitle}>
            Explore India&apos;s leading real estate developers and the landmark projects behind
            them.
          </p>
        </div>

        <div className={styles.dWraps}>
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, i) => <DeveloperCardSkeleton key={i} />)
            : visibleItems.map((item) => (
                <div key={item.id} className={styles.dItems}>
                  <div className={styles.imgWrap}>
                    <Link
                      href={`/property-listing/developer/${item.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.developerImg ? (
                        <picture>
                          <img
                            key={item.id}
                            src={item.developerImg}
                            alt={item.name}
                            className="blog-image"
                            style={{ cursor: "pointer" }}
                          />
                        </picture>
                      ) : (
                        <NoImage />
                      )}
                    </Link>
                  </div>

                  <div className={styles.infoDeveloper}>
                    <h4>{item.name}</h4>
                    <p className={styles.pDeveloper}>
                      {expanded[item.id]
                        ? item.description
                        : `${item.description.split(" ").slice(0, 25).join(" ")}${
                            item.description.split(" ").length > 25 ? "... " : " "
                          }`}
                      {item.description.split(" ").length > 25 && (
                        <span
                          onClick={() =>
                            setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                          }
                          style={{ color: "#e7b554", cursor: "pointer", fontWeight: 500 }}
                        >
                          {expanded[item.id] ? "Read Less" : "Read More"}
                        </span>
                      )}
                    </p>

                    <div className={styles.developerStats}>
                      <div className={styles.statsRow}>
                        <p>
                          Total Projects: <span>{item.totalProperties}</span>
                        </p>
                        <p className={styles.statsRowItem2}>
                          Years of Experience: <span>{item.experienceYears}</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.WrapDeveloper}>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <button type="submit" className={styles.developerButton}>
                            View All Properties
                          </button>
                        </a>
                      ) : (
                        <Link href={`/property-listing/developer/${item.name}`}>
                          <div>
                            <button type="submit" className={styles.developerButton}>
                              View All Properties
                            </button>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <div className="pagination-buttons" style={{ textAlign: "center", margin: "2rem 0" }}>
          <button
            type="button"
            className="page-btn start-page"
            onClick={handleStartClick}
            disabled={currentPage === 1}
          >
            Start
          </button>
          <button
            type="button"
            className="page-btn prev-page"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {paginationRange.map((page) => (
            <button
              key={page}
              type="button"
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="page-btn next-page"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            type="button"
            className="page-btn end-page"
            onClick={handleEndClick}
            disabled={currentPage === totalPages}
          >
            End
          </button>
        </div>
      </Section>
    </Wrapper>
  );
}

export async function getStaticProps() {
  const res2 = await fetch(`${process.env.apiUrl}/setting/getmeta?link=developer`);
  const data2 = await res2.json();

  const meta = {
    name: data2.result[0].title,
    bannerImage: data2.result[0].file.path,
    metaTitle: data2.result[0].meta_title,
    metaDescription: data2.result[0].meta_description,
  };

  const res = await fetch(`${process.env.apiUrl1}/developer?page=1&limit=9`);
  const data = await res.json();

  const allData = {
    developer: data.data.developers,
    meta,
    totalPages: data.data.totalDevelopers,
  };

  return {
    props: { allData },
    revalidate: 10,
  };
}
