import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CTAForm from '../../detailSections/CTA_NEW';


export default function WishList({ handleClose }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenCta, setIsOpenCta] = useState(false);
  const [isActiveCta, setIsActiveCat] = useState(null);
  const router = useRouter();

  useEffect(() => {

    const wishlist = window.localStorage.getItem('wishList');
      const wishlistData = JSON.parse(wishlist)
    setTimeout(() => {
      setWishlist(wishlistData);
      setLoading(false);
    }, 100);
  }, []);



const handleDelete = (slug) => {
    setLoading(true);
     const updatedWishlist = wishlist.filter((item) => item.slug !== slug);
     setWishlist(updatedWishlist);
    window.localStorage.setItem("wishList", JSON.stringify(updatedWishlist));
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };
  

  const handleOpenCta = (index) => {
    setIsActiveCat(index);
    setIsOpenCta(true);
  }

  const onClickOff=()=>{
    setIsOpenCta(false);
  }

  if(isOpenCta && isActiveCta ) {
return (
     <CTAForm name={isActiveCta?.name} popUpenable ={true} timeInterval={1} onClickOff={onClickOff}/>
)
  }
  return (
    <div
      className="wishlist-container"
      style={{ }}
    >
      <div
        className="wishlist-header"
        style={{ display: 'flex', justifyContent: 'space-between'}}
      >
        <h2>Saved Properties</h2>
        <button className="close-button"  type="button" onClick={()=>handleClose(false)} >
          &times;
        </button>
      </div>
     
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading wishlist...</p>
        </div>
      ) : wishlist?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>
          <span style={{ fontSize: '3rem', opacity: 0.3 }}>❤️</span>
          <h3>Your wishlist is empty</h3>
          <p>Start saving properties .</p>
        </div>
      ) : (
        <div className="wishlist-body"> 
          { wishlist?.length >0 && wishlist.map((property) => (
            <div
              className="wishlist-item"
              key={property.id}
              style={{ display: 'flex', gap: '1rem'}}
            >
              <img
                src={property.imgUrl}
                alt="Property"
                height="115px"
                width="40%"
                style={{ borderRadius: '3px' }}
              />

              <div className="wishlist-item-details" style={{ flex: 1 }}>
                <h3>{property.name}</h3>
                <p>
                  <img src="/assets/Logos/location.svg" alt="Location Icon" /> {property.subLocality.name},{" "}{property.locality.name},{" "}{property.city.name}
                </p>
                <p>
                  Starting Price :<span className="price">{" "}{property.price}</span>
                </p>
                <div
                  className="wishlist-item-buttons"
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  <button
                  className='cta-button clr-yellow'
                  
                    onClick={() => {
                       setTimeout(() => {
                        router.push(`/property/${property.slug}`);
                        handleClose(false);
                       }, 100); 
                      
                    }}
                  >
                    View More
                  </button>
                  <button
                  className='cta-button clr-green'
                  type="button"
                     onClick={()=>handleOpenCta(property)}
                  >
                    Enquire Now
                  </button>
                  

                  <button onClick={() => handleDelete(property.slug)} style={{ background: 'none', border: 'none' }}>
                    <img
                      src="/assets/Logos/delete.svg"
                      alt="Delete"
                      style={{
                        cursor: 'pointer',
                        
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
