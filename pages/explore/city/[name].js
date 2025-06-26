import React, { useEffect, useState } from 'react';
import Wrapper from "../../../components/UI/Wrapper";
import CityWrapper from '../../../components/newComponents/listing/citiesWapper';
import NavbarCities from '../../../components/newComponents/listing/NavbarCities';
import LocalityCom from '../../../components/localitySection/LocalitiesCities.js';
import Sublocalities from '../../../components/newComponents/listing/sublocalities';
import { useRouter } from 'next/router';

const CityIndividualPage = ({ allData }) => {
  const router = useRouter();
  const { name } = router.query;

  const cities = ['Gurgaon', 'Noida', 'Pune', 'Delhi', 'Ghaziabad'];
  const imgUrl = '/assets/images/city_images/image 15.png';

  const [active, setActive] = useState(-1);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeLocalities, setActiveLocalities] = useState(0);
  const [sublocalities, setSublocalities] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showSublocalitiesDesktop, setShowSublocalitiesDesktop] = useState(false);

  const activeIndexCity = (index) => {
    setActive(index);
    router.push(`/explore/city/${cities[index]}`);
  };

  const handleActiveLocality = (index) => {
    setActiveLocalities(index);

    if (!isMobile) {
      setShowSublocalitiesDesktop(true);
    } else {
      // Mobile: After active locality, scroll down to sublocalities
      setTimeout(() => {
        const sublocalitiesSection = document.getElementById('sublocalities-section');
        if (sublocalitiesSection) {
          sublocalitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleBackToLocalities = () => {
    setShowSublocalitiesDesktop(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (name) {
      setActive(cities.indexOf(name));
    }
  }, [name]);

  useEffect(() => {
    const fetchLocalities = async () => {
      if (!name) return;

      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.apiUrl1}/localities/${name}?page=${page}&limit=10`
        );
        const data = await res.json();

        if (data?.data) {
          const newLocalities = data.data.map((item) => ({
            name: item.name,
            imgUrl: item.imgUrl || "/assets/images/city_images/image3.png",
            _id: item._id,
          }));

          if (page === 1) {
            setLocalities(newLocalities);
          } else {
            setLocalities((prev) => [...prev, ...newLocalities]);
          }

          setHasMore(newLocalities.length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching localities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalities();
  }, [name, page]);

  useEffect(() => {
    if (localities.length === 0 || !localities[activeLocalities]) return;

    const fetchSublocalities = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${process.env.apiUrl1}/sublocalities/${localities[activeLocalities]._id}`);
        const data = await res.json();

        if (data?.data) {
          setSublocalities(data.data);
        } else {
          setSublocalities([]);
        }
      } catch (error) {
        console.error("Error fetching sublocalities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSublocalities();
  }, [localities, activeLocalities]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleShowLess = () => {
    setPage(1);
  };

  return (
    <Wrapper title={`Explore ${name} to find your dream home`}>
      <div className='cities-wrapper'>
        <CityWrapper mrt={'m0t'} imgUrl={imgUrl} />
        <NavbarCities activeIndexCity={activeIndexCity} active={active} />

        {/* Localities and Sublocalities Section */}
        <div className='localities-wrapper'>
          {!isMobile && showSublocalitiesDesktop ? (
            <>

              <h2 className='top-header-list' onClick={handleBackToLocalities} >
              
              <img src='/assets/images/city_images/leftArrow.png' alt="Back Arrow" /> {"  "}SUBLOCALITIES IN {localities[activeLocalities]?.name.toUpperCase()}
              </h2>

              <div className='sublocalities-wrapper'>
                {sublocalities.length > 0 ? (
                  sublocalities.map((item, index) => (
                    <Sublocalities
                      sublocality={item?.name}
                      index={index}
                      key={index}
                    />
                  ))
                ) : (
                  <p>No sublocalities found</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className='top-header-list'>TOP LOCALITIES IN {name?.toUpperCase()}</h2>

              {loading && page === 1 ? (
                <p>Loading localities...</p>
              ) : (
                <div className='localities-list'>
                  {localities.length > 0 ? (
                    localities.map((locality, index) => (
                      <LocalityCom
                        locality={locality}
                        cityName={name}
                        index={index}
                        key={locality._id}
                        activeLocalities={activeLocalities}
                        handleActiveLocality={handleActiveLocality}
                      />
                    ))
                  ) : (
                    <p>No localities found</p>
                    
                  )}
                   {/* Load More / Show Less Buttons */}
        {!showSublocalitiesDesktop && (
          <div className='btn-wrapper'>
            {hasMore ? (
              <button
                className='btn-nav'
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Localities'}
              </button>
            ) : (
              <button className='btn-nav' onClick={handleShowLess}>
                Show Less
              </button>
            )}
          </div>
        )}
                </div>
              )}

              {isMobile && (
                <>
                  <div id="sublocalities-section" className='sublocalities-wrapper'>
                    <h2 className='top-header-list'>
                      SUBLOCALITIES IN  {localities[activeLocalities]?.name.toUpperCase()}
                    </h2>

                    <div className='sublocalities-list'>
                      {sublocalities.length > 0 ? (
                        sublocalities.map((item, index) => (
                          <Sublocalities
                            sublocality={item?.name}
                            index={index}
                            key={index}
                          />
                        ))
                      ) : (
                        <p>No sublocalities found</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

       
      </div>
    </Wrapper>
  );
};

export default CityIndividualPage;
