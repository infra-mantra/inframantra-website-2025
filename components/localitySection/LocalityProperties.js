import React, { useState } from "react";
import { useRouter } from "next/router";

const PropertyList = ({ properties, cityName }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);  // Track which property is loading
    const [loadingIndex ,setLoadingIndex] = useState(null)
    const [loaderEnabled, setLoaderEnabled] = useState(false);

    const loaderImage = "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/loader/loader.gif";

    const handleClick = (slug, index) => {
        setLoadingIndex(index);
        setLoading(true)
        router.push(`/property/${slug}`);  
    };

    return (
        <div className="Property_container">
            <h3 className="cities_heading">Top properties in {cityName}</h3>
            
            <div className="property_list">
                <div className="property_items">
                    {properties.map((property, index) => (
                        <div 
                            key={index} 
                            className="propery_item"
                            onClick={() => handleClick(property.slug, index)} 
                            style={{ cursor: "pointer" }}
                        >
                           
                                    <>
                                        <img 
                                            src={property.imgUrl} 
                                            className="city_img" 
                                            alt={property.name} 
                                            style={{ 
                                                opacity: loadingIndex === index ? 0.6 : 1, 
                                                transition: "opacity 0.3s ease"
                                            }}
                                        />
                                        
                                        <div className="property_text">
                                            <h4 className="property_name"> {property.name}</h4>
                                            <p className="property_sub">{property.location}</p>
                                        </div>
                                    </>
                                
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertyList;
