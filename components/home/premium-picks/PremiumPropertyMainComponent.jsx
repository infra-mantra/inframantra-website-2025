"use client";
import React, { useEffect, useState } from "react";
import PremiumPicksSection from "./PremiumPicksSection.jsx";
import LocalitySection from "../localities/LocalityPropertiesSection.jsx";
import OtherCityPropertiesSection from "../localities/OtherCityProperties.jsx";
import ServiceSection from "../services/ServiceSection.jsx";
import ShortsSection from "../shorts/ShortsSection.jsx";
import { ShortsSkeleton } from "../HomeSkeletons.jsx";
import AdsBanner from "./AdsBanner.jsx";
import LazyOnVisible from "../../shared/LazyOnVisible.jsx";
import { useLocationDetection } from "./hooks/useLocationDetection.js";
import axios from "axios";

export default function PremiumPropertyMainComponent() {
  const [selectedCity, setSelectedCity] = useState("Gurgaon");
  const [cityPremiumProperties, setCityPremiumProperties] = useState([]);
  const [localitiesPremiumProperties, setLocalitiesPremiumProperties] = useState([]);
  const [otherCityPremiumProperties, setOtherCityPremiumProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false); // Track if we've auto-selected

  const { detectedCity, locationStatus } = useLocationDetection();

  const handleCityUpdate = (city) => {
    setSelectedCity(city);
    setHasAutoSelected(true); // Mark as manually selected
  };

  // Auto-select detected city ONLY ONCE when available
  useEffect(() => {
    if (detectedCity && !hasAutoSelected && detectedCity !== selectedCity) {
      setSelectedCity(detectedCity);
      setHasAutoSelected(true);
    }
  }, [detectedCity, hasAutoSelected, selectedCity]);

  // Fetch data whenever selectedCity changes
  useEffect(() => {
    const fetchCityData = async (city) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.apiUrl1}/property/citywise/${city}?localityLimit=4`
        );

        const data = response.data;
        if (data) {
          setCityPremiumProperties(data?.mainCity?.properties || []);
          setLocalitiesPremiumProperties(data?.localities || []);
          setOtherCityPremiumProperties(data?.otherCityProperties || []);
        }
      } catch (err) {
        console.error("❌ Error fetching premium properties:", err);
        setError("Failed to load premium properties.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a valid city
    if (selectedCity) {
      fetchCityData(selectedCity);
    }
  }, [selectedCity]);

  return (
    <>
      <PremiumPicksSection
        data={cityPremiumProperties}
        loading={loading}
        onUpdate={handleCityUpdate}
        selectedCity={selectedCity}
        detectedCity={detectedCity}
        locationStatus={locationStatus}
      />
      {/* Directly under Premium Picks, where it was asked to sit. Same LazyOnVisible
          treatment as the sections below: it renders a facade (thumbnail + a CSS play
          button), so no YouTube JavaScript loads until a card is clicked. minHeight
          reserves the row so nothing below it shifts when the cards mount. */}
      <LazyOnVisible minHeight={430} rootMargin="250px" placeholder={<ShortsSkeleton />}>
        <ShortsSection />
      </LazyOnVisible>
      {/* Only PremiumPicksSection above is near the fold. Everything below it
          starts ~1800px down yet was mounting on initial load, pulling ~365 KB of
          images (the services background PNG alone is 132 KB, its two icon SVGs
          another 152 KB, the ad banner 81 KB) into the same connection the LCP
          hero is competing for. LazyOnVisible mounts them 600px before they
          scroll in, so the bytes move off the critical path without the user ever
          seeing a placeholder. */}
      {/* rootMargin is deliberately tighter than the 600px default here. At first
          paint PremiumPicksSection is still fetching, so the page is short and this
          wrapper sits ~1330px down — inside a 600px margin, which fired the observer
          immediately and pulled the section's ~285KB of art (a 132KB background PNG
          and two 170KB/36KB vector illustrations on the CDN) straight back onto the
          critical path. 250px clears that first-paint position while still giving
          real scrolling a comfortable head start. The sections below keep the 600px
          default — they already sit far enough down to defer correctly. */}
      <LazyOnVisible minHeight={620} rootMargin="250px">
        <ServiceSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={520}>
        <LocalitySection
          data={localitiesPremiumProperties}
          loading={loading}
          selectedCity={selectedCity}
        />
      </LazyOnVisible>

      <LazyOnVisible minHeight={320}>
        <AdsBanner />
      </LazyOnVisible>

      <LazyOnVisible minHeight={520}>
        <OtherCityPropertiesSection
          data={otherCityPremiumProperties}
          loading={loading}
          selectedCity={selectedCity}
        />
      </LazyOnVisible>
    </>
  );
}
