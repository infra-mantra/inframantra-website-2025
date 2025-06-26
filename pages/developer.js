import React, { useState, useEffect } from "react";
import Section from "../components/UI/Section";
import Wrapper from "../components/UI/Wrapper";
import Link from "next/link";
import NoImage from "../components/UI/NoImage";
import PageHeader from "../components/UI/PageHeader";
import axios from "axios";

export default function Developers({ allData }) {
  let data = {
    image: allData.meta.bannerImage,
    title: allData.meta.bannerTitle,
  };

  const itemsPerPage = 9; // Items per page
  const maxPaginationButtons = 5; // Max number of pagination buttons displayed
  const [currentPage, setCurrentPage] = useState(1); // Current active page
  const [developerData, setDeveloperData] = useState(allData.developer); // Developer data state
  const [totalDevelopers, setTotalDevelopers] = useState(allData.totalPages); // Total developers count

  const totalPages = Math.ceil(totalDevelopers / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleStartClick = () => setCurrentPage(1);

  const handleEndClick = () => setCurrentPage(totalPages);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const res = await fetch(
        `${process.env.apiUrl1}/developer?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await res.json();

      setDeveloperData(data.data.developers);
      setTotalDevelopers(data.data.totalDevelopers);
    };

    fetchDevelopers();
  }, [currentPage]);

  const visibleItems = developerData;

  // Calculate range of pagination buttons
  const getPaginationRange = () => {
    const start = Math.max(currentPage - Math.floor(maxPaginationButtons / 2), 1);
    const end = Math.min(start + maxPaginationButtons - 1, totalPages);

    const paginationRange = [];
    for (let i = start; i <= end; i++) {
      paginationRange.push(i);
    }

    return paginationRange;
  };
const [image, setImage] = useState('');
  const paginationRange = getPaginationRange();
const handleImage=()=>{
setImage(window.innerWidth >= 769 ? 'desktop' : 'mobile')
data.image=window.innerWidth >= 769 ? 'https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.1.avif' : 'https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.2.avif'
}

  useEffect(() => {
    handleImage()
    window.addEventListener('resize', handleImage);
    return () => {
      window.removeEventListener('resize', handleImage)
  }
   },[])

  return (
    <Wrapper
      title={allData.meta.metaTitle}
      description={allData.meta.metaDescription}
      image={allData.meta.bannerImage}
    >
      <PageHeader data={data} />
      <Section classes="aboutProjectWrapper page-width-container-deve" pageWidth="container">
        <div className="section-head-developer">
          <h2>Developers</h2>
        </div>
        <div className="d-wraps">
          {visibleItems.map((item) => (
            <div key={item.id} className="d-items">
              <div className="img-wrap width-image">
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
              <div className="info-devloper">
                <h4>{item.name}</h4>
                <p className="p-developer">
                  {item.description.split(" ").length
                    ? (
                        <>
                          {item.description.split(" ").slice(0, 25).join(" ")}...
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="custom-read-more-btn-link"
                              style={{
                                marginLeft: "5px",
                                color: "#DCAA4C",
                                cursor: "pointer",
                              }}
                            >
                              Read More
                            </a>
                          ) : (
                            <Link href={`/property-listing/developer/${item.name}`}>
                              <span
                                className="custom-read-more-btn"
                                style={{
                                  marginLeft: "5px",
                                  color: "#DCAA4C",
                                  cursor: "pointer",
                                }}
                              >
                                Read More
                              </span>
                            </Link>
                          )}
                        </>
                      )
                    : item.description}
                </p>
                <div className="developer-stats">
                  <div className="stats-row">
                    <p>Total Projects: <span>{item.totalProperties}</span></p>
                    <p className="stats-row-item-2">Years of Experience: <span>{item.experienceYears}</span></p>
                  </div>
                  {/* <div className="stats-row">
                    <p>Total Cities: <span>09</span></p>
                    <p>Years of Experience: <span>14</span></p>
                  </div> */}
                </div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="lrn-btn"
                  >
                    <button type="submit" className="developer-button">
                      View All Properties
                    </button>
                  </a>
                ) : (
                  <Link href={`/property-listing/developer/${item.name}`}>
                    <div className="wrap-developer">
                      <button type="submit" className="developer-button">
                        View All Properties
                      </button>
                    </div>
                  </Link>
                )}
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
    props: {
      allData,
    },
    revalidate: 10,
  };
}
