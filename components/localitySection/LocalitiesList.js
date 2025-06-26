import React ,{useState}from "react";
import LocalityCom from "./LocalityCon";
import { useRouter } from "next/router";
const LocalitiesList = ({ localities, cityName, navigation }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!loading) {
      setLoading(true);

      setTimeout(() => {
        router.push(`/explore/city/${cityName}`);
      
      }, 500);
    }
  };

  return (
    <div className="localities_list">
      <h3 className="cities_heading">Top localities in {cityName}</h3>
      <div className="city_list">
        <div className="items">
          {localities.map((locality, index) => (
            <LocalityCom
              key={index}  // ✅ Added key prop to avoid React warning
              locality={locality}
              cityName={cityName}
              index={index}
              navigation={navigation}
            />
          ))}
        </div>
      </div>

      <div className="ld_more">
        <button 
          className="btn" 
          onClick={handleClick}
          disabled={loading}  // ✅ Disable button while loading
          style={{ 
            opacity: loading ? 0.6 : 1, 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default LocalitiesList;
