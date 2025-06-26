import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Ajax1 from '../../../helper/Ajax1';
import { toast } from 'react-toastify';
import styles from '../popularLocalities.module.css'; // Import your module styles

function LocalityCard({ localityName, localityList, localityImg }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [selectedLocalityProperty, setSelectedLocalityProperty] = useState(null);
  const [fetchProperty, setFetchProperty] = useState(null);
  const router = useRouter();

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedLocalityProperty) {
        try {
          const filterData = await Ajax1({ url: `/property/name/${selectedLocalityProperty}` });
          setFetchProperty(filterData.data.data);
          if (filterData.data.status === 200) {
            toast.success(`${filterData.data.message}`);
          }
        } catch ({ error, filterData }) {
          console.error('Error fetching data:', error);
          if (filterData.data.data === null) {
            toast.success(`${filterData.data.message}`);
          }
        }
      }
    };
    fetchData();
  }, [selectedLocalityProperty]);

  const handlePropertyClick = (list) => {
    const formattedName = list.target.innerHTML.replace(/\s+/g, '-');
    setSelectedLocalityProperty(formattedName);
  };

  useEffect(() => {
    if (
      fetchProperty &&
      selectedLocalityProperty !== null &&
      fetchProperty.name.replace(/\s+/g, '-') === selectedLocalityProperty
    ) {
      router.push(`/property/${fetchProperty.slug}`);
    }
  }, [fetchProperty, selectedLocalityProperty]);

  return (
    <div
      className={styles.localityCardWrapper}
      style={{ backgroundImage: `url(${localityImg})` }}
      key={localityName}
    >
      <button className={styles.localityCardBtn}>
        {localityName}
      </button>
      <ul className={isDesktop ? styles.hoverList : styles.mobileNonHoverList}>
        {localityList.map((list) => (
          <li key={list} onClick={handlePropertyClick}>
            {list}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocalityCard;
