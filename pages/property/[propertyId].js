import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'; 
const Wrapper = dynamic(() => import('../../components/UI/Wrapper'));
const PropertyHeader = dynamic(() => import('../../components/newComponents/propertyData/propertyHeader'));
const PropertyPageNavigation = dynamic(() => import('../../components/newComponents/propertyData/propertyPageNavigation/propertyPageNavigation'));
const PropertyPageLeftDesktop = dynamic(() => import('../../components/newComponents/propertyData/propertyLeftSection/properPageLeftSection'));
const PropertyPageRightDesktop = dynamic(() => import('../../components/newComponents/propertyData/propertyRightSection/propertyPageRightSection'));
const PropertyMobileHeaderImg = dynamic(() => import('../../components/newComponents/propertyData/propertyPageMobile/propertyPageMobileImageGallery'));
const PropertyPageMobileHeaderDetails = dynamic(() => import('../../components/newComponents/propertyData/propertyPageMobile/propertyPageHeaderDetails'));
const PropertyPageMobile = dynamic(() => import('../../components/newComponents/propertyData/propertyPageMobile/propertyPageMobile'));
const CTAForm = dynamic(() => import('../../components/detailSections/CTA_NEW'));


const PropertyDetail = ({ allData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(allData.propertyData.data);
  const [isLeftSectionBottom, setIsLeftSectionBottom] = useState(false);
  const [ogImageUrl, setOgImageUrl] = useState(
    allData.propertyData.data.imageGallery?.[0]?.url || null
  );
  const [PropertyVideo, setPropertyVideo] = useState(
    allData?.propertyData?.data?.videoUrl?.[0] || null
  );
  const [schemaInfo, setSchemaInfo] = useState({
    lat: allData.propertyData.data?.coordinates?.lat,
    lon: allData.propertyData.data.coordinates?.lng,
    loc: allData.propertyData.data.locality?.name,
    sub: allData.propertyData.data.subLocality?.name,
    url: router?.asPath || null,
    price: allData.propertyData.data.priceInFigure,
    city: allData.propertyData.data.city?.name,
    image: allData?.propertyData?.data?.imageGallery?.[0]?.url || null,
    name: allData.propertyData.data.name,
  });

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const handleLoad = async () => {
      checkScreenWidth();

      if (router.query.propertyId) {
        const res = await fetch(`${process.env.apiUrl1}/property/slug/${router.query.propertyId}`);
        const data = await res.json();
        setPropertyData(data.data);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    
    };

    handleLoad();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, [router.query.propertyId]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Wrapper
      title={`${propertyData.metaTitle} | Infra Mantra`}
      description={propertyData.metaDescription}
      keyword={propertyData.metaKeywords}
      image={ogImageUrl}
      schema={schemaInfo}
    >
      <div className="propertyPageWrapper">
        {isDesktop && (
          <>
            <PropertyHeader
              imageGallery={propertyData.imageGallery}
              rera={propertyData.rera}
              name={propertyData.name}
              locality={propertyData.locality}
              subLocality={propertyData.subLocality}
              displayLocality={propertyData.displayLocality}
              city={propertyData.city}
              startingPrice={propertyData.startingPrice}
              priceInFigure={propertyData.priceInFigure}
              configuration={propertyData.configuration}
              area={propertyData.area}
              squarePrice={propertyData.squarePrice}
              status={propertyData.status}
              posession={propertyData.possesion}
              exclusive={propertyData.exclusive}
              featured={propertyData.featured}
              propertyType={propertyData.propertyType}
            />
            <PropertyPageNavigation />
            <div className="propertyPageSectionContainer">
              <PropertyPageLeftDesktop
                description={propertyData.description}
                propertyLogo={propertyData.propertyLogo}
                keyHighlights={propertyData.keyHighlights}
                exclusiveAmenities={propertyData.exclusiveAmenities}
                amenities={propertyData.amenities}
                floorPlan={propertyData.floorPlan}
                localityGuide={propertyData.localityGuide}
                brochure={propertyData.brochure}
                imageGallery={propertyData.imageGallery}
                developer={propertyData.developer}
                leftSection={setIsLeftSectionBottom}
                name={propertyData.name}
              />
              <PropertyPageRightDesktop
                videoUrl={PropertyVideo}
                name={propertyData.name}
                priceInFigure={propertyData.priceInFigure}
                leftSection={isLeftSectionBottom}
                propertyType={propertyData.propertyType}
                city={propertyData.city}
                locality={propertyData.locality}
              />
            </div>
          </>
        )}
        {!isDesktop && (
          <>
            <div className="propertyPageHeaderMobile">
              <PropertyMobileHeaderImg imageGallery={propertyData.imageGallery}  name={propertyData.name}/>
              <PropertyPageMobileHeaderDetails
                rera={propertyData.rera}
                name={propertyData.name}
                locality={propertyData.locality}
                subLocality={propertyData.subLocality}
                displayLocality={propertyData.displayLocality}
                city={propertyData.city}
                startingPrice={propertyData.startingPrice}
                priceInFigure={propertyData.priceInFigure}
                configuration={propertyData.configuration}
                area={propertyData.area}
                squarePrice={propertyData.squarePrice}
                status={propertyData.status}
                posession={propertyData.possesion}
                exclusive={propertyData.exclusive}
                featured={propertyData.featured}
                tagLine={propertyData.tagLine}
                propertyType={propertyData.propertyType}
              />
            </div>
            <CTAForm name={propertyData.name} />
            <PropertyPageNavigation />
            <PropertyPageMobile
              videoUrl={PropertyVideo}
              description={propertyData.description}
              propertyLogo={propertyData.propertyLogo}
              keyHighlights={propertyData.keyHighlights}
              exclusiveAmenities={propertyData.exclusiveAmenities}
              amenities={propertyData.amenities}
              floorPlan={propertyData.floorPlan}
              priceInFigure={propertyData.priceInFigure}
              localityGuide={propertyData.localityGuide}
              imageGallery={propertyData.imageGallery}
              developer={propertyData.developer}
              name={propertyData.name}
              brochure={propertyData.brochure}
              leftSection={setIsLeftSectionBottom}
              city={propertyData.city}
              locality={propertyData.locality}
            />
          </>
        )}
      </div>
    </Wrapper>
  );
};

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl1}/property/slugList?active=true`);
  const data = await res.json();
  const paths = data.result.map((post) => ({
    params: { propertyId: post.slug },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.apiUrl1}/property/slug/${params.propertyId}`);
  const data = await res.json();

  const allData = {
    propertyData: data,
  };

  return {
    props: {
      allData,
    },
    revalidate: 10,
  };
}

export default PropertyDetail;
