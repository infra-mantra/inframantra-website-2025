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

      // Try browser geolocation (GPS) first — most accurate, reflects the
      // user's real position rather than their ISP's registered city.
      if ('geolocation' in navigator) {
        try {
          const position = await getCurrentPosition();
          const locationCity = await getCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          if (locationCity) {
            setDetectedCity(locationCity);
            setLocationStatus('found');
            return;
          }
        } catch (geoError) {
          // Permission denied / timeout / unavailable — fall through to IP.
        }
      }

      // Fallback to IP-based detection (no permission required, but only
      // accurate to the ISP/network location).
      const city = await detectCityByIP();
      if (city) {
        setDetectedCity(city);
        setLocationStatus('found');
        return;
      }

      setLocationStatus('failed');
    } catch (error) {
      setLocationStatus('failed');
    }
  }

  async function detectCityByIP() {
    try {
      
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
            
            const city = normalizeCity(data.city || data.cityName || '');
            if (city) {
              return city;
            }
          }
        } catch (serviceError) {
          continue; // Try next service
        }
      }
    } catch (error) {
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
        
        const city = normalizeCity(
          data.address?.city || 
          data.address?.town || 
          data.address?.state_district || ''
        );
        
        if (city) {
          return city;
        }
      }
    } catch (error) {
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
