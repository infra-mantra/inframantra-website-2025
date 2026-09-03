import React, { useState, useEffect, lazy } from "react";

import Wrapper from "../components/shared/Wrapper.jsx";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import MainBanner1 from "../components/home/MainBanner.jsx";
import LazyOnVisible from "../components/shared/LazyOnVisible.jsx";
import {
  PremiumSkeleton,
  BlogsSkeleton,
  StatsSkeleton,
  GallerySkeleton,
  ReviewsSkeleton,
  CtaSkeleton,
} from "../components/home/HomeSkeletons.jsx";

// Premium Picks (Swiper + a large subtree) is deferred with ssr:false to keep it
// off the initial hydration path (TBT win). It renders client-side; while its
// chunk loads we show a skeleton in the reserved space (no layout shift).
const PremiumPropertyMainComponent = dynamic(
  () => import("../components/home/premium-picks/PremiumPropertyMainComponent.jsx"),
  {
    ssr: false,
    loading: () => <PremiumSkeleton />,
  }
);

// Below-the-fold sections: code-split AND deferred (ssr:false). They are wrapped
// in <LazyOnVisible> in the render tree, so their chunks download + hydrate only
// when the user scrolls near them — keeping this JS off the initial load, which
// is where Total Blocking Time (the biggest mobile-score factor) is won.
// ssr:false keeps each section's JS off the initial load. `loading` shows the
// section's skeleton while its chunk downloads, so there is no blank flash once
// the section scrolls into view (the LazyOnVisible placeholder covers the phase
// before that). The skeletons are already imported above — no extra page weight.
const StatisticalInsightsSection = dynamic(
  () => import("../components/home/stats/StaticalInsight.jsx"),
  { ssr: false, loading: () => <StatsSkeleton /> }
);
const ImageGallerySection = dynamic(() => import("../components/shared/ImageGallerySection.jsx"), {
  ssr: false,
  loading: () => <GallerySkeleton />,
});
const ReviewsWall = dynamic(() => import("../components/home/reviews/ReviewsWall.jsx"), {
  ssr: false,
  loading: () => <ReviewsSkeleton />,
});
const BlogsMedia = dynamic(() => import("../components/blog/BlogsMedia.jsx"), {
  ssr: false,
  loading: () => <BlogsSkeleton />,
});
const CtaForHome = dynamic(() => import("../components/shared/forms/CtaForHome.jsx"), {
  ssr: false,
  loading: () => <CtaSkeleton />,
});

function Home({ allData }) {
  const bannerItems = [
    {
      image: allData.meta.bannerImage,
      title: allData.meta.bannerTitle,
    },
  ];

  const [exclusiveCollection, setExclusiveCollection] = useState(allData.recommendation);
  const [featureCollection, setFeatureCollection] = useState(allData.collection);
  const [featuredProduct, setfeaturedProduct] = useState(allData.featuredProjects);

  const [selectedItems, setSelectedItems] = useState([]);

  // Function to save selectedItems to localStorage
  const loadSelectedItemsFromLocalStorage = () => {
    try {
      const selectedItemsJSON = localStorage.getItem("selectedItems");
      return selectedItemsJSON ? JSON.parse(selectedItemsJSON) : [];
    } catch (error) {
      console.error("Error loading selected items from localStorage:", error);
      return [];
    }
  };

  const saveSelectedItemsToLocalStorage = (selectedItems) => {
    try {
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    } catch (error) {
      console.error("Error saving selected items to localStorage:", error);
    }
  };

  // ...

  useEffect(() => {
    // Load selectedItems from localStorage when the component mounts
    setSelectedItems(loadSelectedItemsFromLocalStorage());
  }, []); // Empty dependency array means this effect runs once, like componentDidMount

  const toggleSelection = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);

    if (isSelected) {
      const updatedSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem._id !== item._id
      );
      setSelectedItems(updatedSelectedItems);
      saveSelectedItemsToLocalStorage(updatedSelectedItems);
    } else {
      const updatedSelectedItems = [...selectedItems, item];
      setSelectedItems(updatedSelectedItems);
      saveSelectedItemsToLocalStorage(updatedSelectedItems);
    }
  };

  return (
    <Wrapper
      title={"INFRAMANTRA - Making Realty A Reality For You"}
      description={
        "INFRAMANTRA is a Real Estate Firm that helps to Build Value on Residential and Commercial properties. We work with the top Builders in Gurgaon, Pune, and Noida."
      }
      keyword={
        "InfraMantra, Residential Properties, Commercial Properties,  Apartments, Flats, Buy flat in gurgaon, buy property in gurgaon,gurgaon property prices, Apartments for sale in gurugram, buy apartment in gurgaon, buy Properties in gurgaon, real estate in gurgaon, best property to buy in gurgaon, noida   apartment for sale, Pune property prices, buy property noida, buy residential property in pune, Property for purchase in gurugram"
      }
      selectedItem={selectedItems}
    >
      {/* No <link rel="preload"> for the hero.

          It looked free but wasn't: Next's Head manager creates the <link> and sets
          imagesrcset BEFORE media, so the browser starts fetching before the media
          gate applies. On a desktop window that downloaded the *mobile* hero, which
          nothing then used — Chrome logs "preloaded using link preload but not used"
          once per re-render.

          Nothing is lost by dropping it. The hero lives in a server-rendered
          <picture> with fetchpriority="high" and loading="eager", so the preload
          scanner finds it in the same first pass it would have found the link tag —
          measured as the 3rd request on the page, High priority, starting the
          instant the document finishes. Lighthouse's lcp-discovery checks all pass
          without it. A preload only earns its place for images discovered late (CSS
          backgrounds, JS-inserted); this one is in the initial HTML. */}
      <MainBanner1 />
      <div className="premiumReserve" style={{ minHeight: "578px" }}>
        <PremiumPropertyMainComponent />
      </div>
      {/* Tighter rootMargin, same reason as the ServiceSection wrapper: at first
          paint the premiumReserve above is only 578px tall, so this sits ~1100px
          down and a 600px margin fired it immediately — putting its 43 KB WP fetch
          on the wire at High priority, directly against the LCP hero. The sections
          below keep the 600px default; they already sit far enough down. */}
      <LazyOnVisible minHeight={520} rootMargin="200px" placeholder={<BlogsSkeleton />}>
        <BlogsMedia />
      </LazyOnVisible>
      <LazyOnVisible minHeight={480} placeholder={<StatsSkeleton />}>
        <StatisticalInsightsSection />
      </LazyOnVisible>
      <LazyOnVisible minHeight={520} placeholder={<GallerySkeleton />}>
        <ImageGallerySection />
      </LazyOnVisible>
      <LazyOnVisible minHeight={520} placeholder={<ReviewsSkeleton />}>
        <ReviewsWall current={allData.testimonial} />
      </LazyOnVisible>
      <LazyOnVisible minHeight={420} placeholder={<CtaSkeleton />}>
        <CtaForHome name={"Form Submitted from Home page"} />
      </LazyOnVisible>
    </Wrapper>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.apiUrl}/home?city=635b68b7c6c1fe18701d3020`);
  const data = await res.json();

  const headingsData = data.result.homeHeading[0];
  const heading = {
    description: headingsData.description,
    featureHeading: headingsData.featureHeading,
    featureDescription: headingsData.featureDescription,
    collectionHeading: headingsData.collectionHeading,
    collectionDescription: headingsData.collectionDescription,
    serviceHeading: headingsData.serviceHeading,
    serviceDescription: headingsData.serviceDescription,
    helpHeading: headingsData.helpHeading,
    helpDescription: headingsData.helpDescription,
    blogHeading: headingsData.blogHeading,
    blogDescription: headingsData.blogDescription,
    heading: headingsData.heading,
    topHeading: headingsData.topHeading,
    topDescription: headingsData.topDescription,
    testHeading: headingsData.testHeading,
    testDescription: headingsData.testDescription,
    partnerHeading: headingsData.partnerHeading,
    partnerDescription: headingsData.partnerDescription,
  };

  const meta = {
    meta_title: data.result.meta[0].meta_title,
    meta_description: data.result.meta[0].meta_description,
    bannerTitle: data.result.meta[0].title,
    bannerDesp: data.result.meta[0].description,
    bannerImage: data.result.meta[0].file.path,
  };

  const propertyTypeData = data.result.categoryList;
  const propertyTypeDataArray = [];
  propertyTypeData.forEach(function (c) {
    propertyTypeDataArray.push({
      id: c._id,
      title: c.name,
    });
  });

  const cityData = data.result.cityList;
  const cityDataArray = [];
  cityData.forEach(function (c) {
    cityDataArray.push({
      id: c._id,
      title: c.name,
      file: c.file.path,
    });
  });

  // const localityData = data.result.localityList
  // const localityArray = []
  // localityData.forEach(function(c){
  //   localityArray.push({
  //     "id" : c._id,
  //     "name": c.name,
  //     "slug": c.slug
  //   })
  // })

  const recommendedData = data.result.recommendations;
  const recommendedDataArray = [];
  recommendedData.forEach(function (r) {
    recommendedDataArray.push({
      id: r._id,
      title: r.name,
      ...(r.image && r.image.length > 0 && { image: r.image[0].path }),
      location: r.location,
      apartments: r.apartments,
      price: r.price,
      ...(r.slug && { slug: r.slug }),
      amenities: r.amenities,
      ...(r.developer && r.developer.file && { developerImage: r.developer.file.path }),
      description: r.product_description,
      textSpecialPrice: r.textSpecialPrice,
      sizesqft: r.sizesqft,
      possession_status: r.possession_status.name,
    });
  });

  const collectionData = data.result.feartureCollection;
  const collectionDataArray = [];
  collectionData.forEach(function (c) {
    collectionDataArray.push({
      id: c.iteam._id,
      title: c.iteam.name,
      description: c.iteam.description,
      ...(c.iteam.slug && { slug: c.iteam.slug }),
      ...(c.iteam.file && { image: c.iteam.file.path }),
      type: c.type,
    });
  });

  const helpData = data.result.infraHelps;
  const helpDataArray = [];
  helpData.forEach(function (h) {
    helpDataArray.push({
      id: h._id,
      title: h.name,
      description: h.description,
      ...(h.file && { image: h.file.path }),
    });
  });

  const blogData = data.result.blogList;
  const blogDataArray = [];
  blogData.forEach(function (b) {
    blogDataArray.push({
      id: b._id,
      title: b.name,
      description: b.shortDescription,
      ...(b.thumbnail && { image: b.thumbnail.path }),
      date: moment(b.publish ? b.publish : b.createdAt).format("MMM DD YYYY"),
      slug: b.slug,
    });
  });

  const testimonialData = data.result.testimonials;
  const testimonialDataArray = [];
  testimonialData.forEach(function (t) {
    testimonialDataArray.push({
      id: t._id,
      name: t.name,
      description: t.description,
      designation: t.designation,
      ...(t.youtube && { youtube: t.youtube }),
    });
  });

  const partnerData = data.result.homePartners;
  const partnerDataArray = [];
  partnerData.forEach(function (p) {
    partnerDataArray.push({
      id: p._id,
      name: p.name,
      ...(p.slug && { slug: p.slug }),
      ...(p.file && { image: p.file.path }),
      ...(p.city && { city: p.city }),
    });
  });

  // The homepage's sections all fetch their own data client-side; the only
  // getStaticProps data the rendered tree actually consumes is `meta` (banner)
  // and `testimonial` (ReviewsWall). The rest was ~200 KB of dead JSON shipped in
  // __NEXT_DATA__ on every request, bloating the HTML and slowing mobile
  // download/parse/hydrate. recommendation/collection/featuredProjects are kept
  // as [] only because the component still initialises (unused) state from them.
  const allData = {
    meta: meta,
    recommendation: [],
    collection: [],
    featuredProjects: [],
    testimonial: testimonialDataArray,
  };
  return {
    props: {
      allData,
    },
    // Was 10 seconds, which meant the page fell out of cache six times a minute.
    // Vercel answered STALE on 3 of 4 sampled requests, and every one of those
    // kicked off a regeneration that re-ran the call below — an API that takes
    // 1.28 s and returns 488 KB, for the two fields this page actually keeps
    // (banner meta and testimonials). Neither changes minute to minute.
    // 30 minutes keeps almost every request on a warm edge cache; lower it if
    // marketing needs banner changes to appear faster.
    revalidate: 1800,
  };
}

export default Home;
