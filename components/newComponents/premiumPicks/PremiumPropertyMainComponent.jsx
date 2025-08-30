'use client'
import React, { useEffect, useState } from "react";
import PremiumPicksSection from "./PremiumPicksSection.jsx";
import LocalitySection from "../localityProperties/LocalityPropertiesSection.jsx";
import OtherCityPropertiesSection from "../localityProperties/OtherCityProperties.jsx";
import ServiceSection from '../../newComponents/serviceSection/serviceSection.js';

import {useLocationDetection} from './hooks/useLocationDetection'
import axios from "axios";

export default function PremiumPropertyMainComponent() {
   const [selectedCity, setSelectedCity] = useState("Gurgaon")
  const [cityPremiumProperties, setCityPremiumProperties] = useState([]);
  const [localitiesPremiumProperties, setLocalitiesPremiumProperties] = useState([]);
  const [otherCityPremiumProperties, setOtherCityPremiumProperties] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {detectedCity,locationStatus} = useLocationDetection()


  const handleCityUpdate = (city) => {
    setSelectedCity(city);
  };



   useEffect(() => {
    (async (detectedCity) => {
      try {

        const response = await axios.get(`https://apitest.inframantra.com/api/v1/property/citywise/${detectedCity}`);


        const data = response.data;
        if (data) {

        setCityPremiumProperties(data?.mainCity?.properties)
        setLocalitiesPremiumProperties(data?.localities);
        console.log("9999999",data)
        setOtherCityPremiumProperties(data?.otherCityProperties)   
        }
      } catch (err) {
        console.error("Error fetching premium properties:", err);
        setError("Failed to load premium properties.");
      } finally {
        setLoading(false);
      }
    })(detectedCity);
  }, []);

  useEffect(() => {
    (async (selectedCity) => {
      try {
        const response = await axios.get(`https://apitest.inframantra.com/api/v1/property/citywise/${selectedCity}`);


        const data = response.data;
        if (data) {
        setCityPremiumProperties(data?.mainCity?.properties)
        setLocalitiesPremiumProperties(data?.localities);
        setOtherCityPremiumProperties(data?.otherCityProperties)   
        }
      } catch (err) {
        console.error("Error fetching premium properties:", err);
        setError("Failed to load premium properties.");
      } finally {
        setLoading(false);
      }
    })(selectedCity);
  }, [selectedCity]);



  return (
    <>
      <PremiumPicksSection data={cityPremiumProperties} loading={loading} onUpdate={handleCityUpdate} /> 
      <ServiceSection />
      <LocalitySection data={localitiesPremiumProperties} loading={loading} selectedCity={selectedCity} />
       <OtherCityPropertiesSection data={otherCityPremiumProperties} loading={loading} selectedCity={selectedCity} />
      {/* <OtherCityPropertiesSection data={otherCityPremiumProperties} />  */}
    </>
  );
}
