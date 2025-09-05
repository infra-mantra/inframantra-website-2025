'use client'
import React, { useEffect, useState } from "react";
import PremiumPicksSection from "./PremiumPicksSection.jsx";
import LocalitySection from "../localityProperties/LocalityPropertiesSection.jsx";
import OtherCityPropertiesSection from "../localityProperties/OtherCityProperties.jsx";
import ServiceSection from '../../newComponents/serviceSection/serviceSection.js';
import AdsBanner from "./AdsBanner.jsx";
import { useLocationDetection } from './hooks/useLocationDetection'
import axios from "axios";

export default function PremiumPropertyMainComponent() {
  const [selectedCity, setSelectedCity] = useState("Gurgaon")
  const [cityPremiumProperties, setCityPremiumProperties] = useState([]);
  const [localitiesPremiumProperties, setLocalitiesPremiumProperties] = useState([]);
  const [otherCityPremiumProperties, setOtherCityPremiumProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false); // Track if we've auto-selected

  const { detectedCity, locationStatus } = useLocationDetection()

  const handleCityUpdate = (city) => {
    console.log("🎯 City updated from child component:", city);
    setSelectedCity(city);
    setHasAutoSelected(true); // Mark as manually selected
  };

  // Auto-select detected city ONLY ONCE when available
  useEffect(() => {
    if (detectedCity && !hasAutoSelected && detectedCity !== selectedCity) {
      console.log("📍 Auto-selecting detected city:", detectedCity);
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
        
        console.log("🔄 Fetching data for city:", city);
        const response = await axios.get(`https://apitest.inframantra.com/api/v1/property/citywise/${city}?localityLimit=4`);

        const data = response.data;
        if (data) {
          setCityPremiumProperties(data?.mainCity?.properties || []);
          setLocalitiesPremiumProperties(data?.localities || []);
          setOtherCityPremiumProperties(data?.otherCityProperties || []);
          console.log("✅ Data fetched successfully for:", city, data);
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
      <ServiceSection />
      <LocalitySection 
        data={localitiesPremiumProperties} 
        loading={loading} 
        selectedCity={selectedCity} 
      />
      <OtherCityPropertiesSection 
        data={otherCityPremiumProperties} 
        loading={loading} 
        selectedCity={selectedCity} 
      />
      <AdsBanner/>
    </>
  );
}
