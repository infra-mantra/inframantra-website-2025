import React, { useState, useEffect } from 'react';
import Wrapper from "../../../components/UI/Wrapper";
import StateWrapper from '../../../components/newComponents/listing/citiesWapper';
import LocalitiesList from "../../../components/localitySection/LocalitiesList";
import { useRouter } from 'next/router';
import StateItems from '../../../components/newComponents/listing/stateItems';

const CityIndividualPage = ({ allData }) => {


  

  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = true
  const bannerImage = "/assets/images/city_images/image 21.png"

  const stateContantsAndImages = [
    { name: "Haryana", imgUrl: "/assets/images/city_images/state1.png", url: "" },
    { name: "Uttar Pradesh", imgUrl: "/assets/images/city_images/state2.png", url: "" },
    { name: "Delhi", imgUrl: "/assets/images/city_images/state3.png", url: "" },
    { name: "Maharashtra", imgUrl: "/assets/images/city_images/state4.png", url: "" }
  ];

  // ✅ Extracting Localities and Properties Dynamically for All Cities
  const cities = ['Gurgaon', 'Noida', 'Pune', 'Ghaziabad'];
  const data = allData?.data?.data || {};
  // ✅ Extracting Localities and Properties Dynamically for All Cities
  const cityData = cities.map(city => {
    const cityLocalities = data[city]?.map(locality => ({
      name: locality.name,
      imgUrl: locality.imgUrl || "/assets/images/city_images/image3.png",
    })) || [];

    return {
      cityName: city,
      localities: cityLocalities,
  
    };
  });

  return (
    <Wrapper title={`Explore state to find your dream home`}>
      <div className='cities-wrapper'>
        <StateWrapper mrt={'m0t'} imgUrl= {bannerImage}/>
        <StateItems />

        <div className='state-wrapper'>
          <h2 className='state-header'> TOP STATES TO EXPLORE </h2>

          <div className='stateItems'>
            {stateContantsAndImages.map((item, index) => (
              <div key={index} className='stateItem'>
                <img src={item.imgUrl} alt={item.name} />
                <div className='stateText'>
                  {item.name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

         
         
        </div>
        <div className ="margin">
         {cityData.map(({ cityName, localities, properties }) => (
            <div key={cityName}>

              <LocalitiesList localities={localities} cityName={cityName}  navigation={true}/>
              
            </div>
          ))}
          </div> 
      </div>
    </Wrapper>
  );
};
export async function getStaticProps() {
    try {
      const res = await fetch(`${process.env.apiUrl1}/localities/featured`);
      const data = await res.json();
  
      const allData = { data };
  
      return {
        props: {
          allData,
        },
        revalidate: 10,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return {
        props: {
          allData: {
            data: {
              Gurgaon: [],
              Noida: [],
              Pune: [],
              Ghaziabad: []
            }
          }
        },
        revalidate: 10,
      };
    }
  }
  



export default CityIndividualPage;
