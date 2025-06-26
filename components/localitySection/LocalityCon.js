import React, { useState } from 'react';
import { useRouter } from 'next/router';

function LocalityCom({ locality, cityName, index, activeLocalities, handleActiveLocality, navigation }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (index,locality) => {
    

    if (navigation) {
      setLoading(true); 

     
      setTimeout(() => {
        const localStorageData= [{"title":`${locality}`,"type":"locality"}]
        localStorage.setItem("SearchNames",JSON.stringify(localStorageData))
        router.push(`/listing`);
      }, 500); 
    }else{
        handleActiveLocality(index);
    }
  };

  return (
    <div 
      key={index} 
      className={`city_item ${activeLocalities === index ? "active" : ""}`} 
      onClick={() => handleChange(index,locality.name)}
      style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <img
        src={locality.imgUrl || "/assets/images/city_images/image3.png"}
        className="city_img"
        alt={locality.name}
      />
      <div className="city_text">
        <h4 className="locality_name">
          {loading ? 'Loading...' : locality.name}
        </h4>
        <p className="city_name">{cityName}</p>

        {/* <div className='city_btns'>
          <button className="city_btn_l">
            {loading ? 'Loading...' : 'view localities'} 
          </button>
         < button className="city_btn_p">
            {loading ? 'Loading...' : 'view properties'}
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default LocalityCom;
