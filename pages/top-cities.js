import Wrapper from "../components/UI/Wrapper";
import LocalityHeader from "../components/localitySection/LocalityHeader";
import LocalitiesList from "../components/localitySection/LocalitiesList";
import LocalityProperties from "../components/localitySection/LocalityProperties";

function City({ allData }) {
    const navigation = true

  const cities = ['Gurgaon', 'Noida', 'Pune', 'Ghaziabad'];
  const data = allData?.data?.data || {};
  // ✅ Extracting Localities and Properties Dynamically for All Cities
  const cityData = cities.map(city => {
    const cityLocalities = data[city]?.map(locality => ({
      name: locality.name,
      imgUrl: locality.imgUrl || "/assets/images/city_images/image3.png",
    })) || [];

    const cityProperties = data[city]?.flatMap(locality => 
      locality.properties?.map(property => ({
        name: property.name,
        location: property.subLocality.name,
        imgUrl: property.image.url || "/assets/images/city_images/default.png",
        slug:property.slug,

      })) || []
    ) || [];

    return {
      cityName: city,
      localities: cityLocalities,
      properties: cityProperties
    };
  });

  const sitemapData = [
    { imgUrl: "/assets/images/city_images/main.png", url: "Gurgaon" },
    { imgUrl: "/assets/guru/gurgaon.avif", url: "Noida" },
    { imgUrl: "/assets/images/city_images/city2.png", url: "Pune" },
    { imgUrl: "/assets/images/city_images/city.png", url: "Ghaziabad" },
    { imgUrl: "/assets/images/city_images/city.png", url: "Delhi" }
  ];




  return (
    <>
      <Wrapper title="top cities localities and properties list">
        <div className="top-cities-container-wrapper">
          <div className="top-cities-container">
            <div className="heading_section">
              <h1 className="heading_city">Browse city-specific listings and find the perfect property for your needs.</h1>
              <h2>TOP CITIES OF INDIA</h2>
            </div>

            <LocalityHeader sitemapData={sitemapData} />
          </div>

          {cityData.map(({ cityName, localities, properties }) => (
            <div key={cityName}>

              <LocalitiesList localities={localities} cityName={cityName} navigation={navigation}/>
              
              <LocalityProperties properties={properties} cityName={cityName} />
            </div>
          ))}
        </div>
      </Wrapper>
    </>
  );
}

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

export default City;
