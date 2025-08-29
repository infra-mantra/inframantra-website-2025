import { useState, useEffect } from 'react';

export function useLocationDetection() {
  const [detectedCity, setDetectedCity] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, found, failed

  useEffect(() => {
    detectUserLocation();
  }, []);

  async function detectUserLocation() {
    try {
      setLocationStatus('detecting');
      
      console.log('🌍 Starting location detection...');
      
      // Try IP-based detection first (faster and doesn't require permission)
      const city = await detectCityByIP();
      if (city) {
        console.log('✅ IP location detected:', city);
        setDetectedCity(city);
        setLocationStatus('found');
        return;
      }

      // Fallback to browser geolocation API if available
      if ('geolocation' in navigator) {
        console.log('📍 Trying browser geolocation...');
        const position = await getCurrentPosition();
        const locationCity = await getCityFromCoordinates(
          position.coords.latitude, 
          position.coords.longitude
        );
        if (locationCity) {
          console.log('✅ GPS location detected:', locationCity);
          setDetectedCity(locationCity);
          setLocationStatus('found');
          return;
        }
      }

      console.log('❌ Location detection failed');
      setLocationStatus('failed');
    } catch (error) {
      console.log('❌ Location detection error:', error);
      setLocationStatus('failed');
    }
  }

  async function detectCityByIP() {
    try {
      console.log('🔍 Detecting city by IP...');
      
      // Try multiple IP geolocation services
      const services = [
        'https://ipapi.co/json/',
        'http://ip-api.com/json/',
        'https://freegeoip.app/json/'
      ];

      for (const serviceUrl of services) {
        try {
          const response = await fetch(serviceUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            timeout: 5000
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('🌐 IP service response:', data);
            
            const city = normalizeCity(data.city || data.cityName || '');
            if (city) {
              console.log('✅ Normalized city from IP:', city);
              return city;
            }
          }
        } catch (serviceError) {
          console.log(`❌ Service ${serviceUrl} failed:`, serviceError);
          continue; // Try next service
        }
      }
    } catch (error) {
      console.log('❌ IP location detection failed:', error);
    }
    return null;
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000
      };
      
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  async function getCityFromCoordinates(lat, lng) {
    try {
      console.log(`🗺️ Reverse geocoding: ${lat}, ${lng}`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PropertyCarousel/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('🗺️ Geocoding response:', data);
        
        const city = normalizeCity(
          data.address?.city || 
          data.address?.town || 
          data.address?.state_district || ''
        );
        
        if (city) {
          console.log('✅ City from coordinates:', city);
          return city;
        }
      }
    } catch (error) {
      console.log('❌ Reverse geocoding failed:', error);
    }
    return null;
  }

  function normalizeCity(inputCity) {
    if (!inputCity) return null;
    
    const cityMap = {
      'gurgaon': 'Gurgaon',
      'gurugram': 'Gurgaon',
      'pune': 'Pune',
      'jaipur': 'Jaipur',
      'noida': 'Noida',
      'new delhi': 'Delhi',
      'delhi': 'Delhi'
    };
    
    const availableCities = ['Gurgaon', 'Pune', 'Jaipur', 'Noida'];
    const normalized = cityMap[inputCity.toLowerCase().trim()];
    
    return availableCities.includes(normalized) ? normalized : null;
  }

  return { 
    detectedCity, 
    locationStatus,
    retryDetection: detectUserLocation 
  };
}
