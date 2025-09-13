  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/router';
 
  import CustomizedHook from '../../searchAutocomplete/searchAutocomplete';
  

  import styles from './searchOptions.module.css'; // Assuming you have a CSS module for styling
  


  const SearchOptions = () => {
   
    const [autocompleteSelections, setAutocompleteSelections] = useState([]);
    const [location, setLocation]=useState()
    const router = useRouter();
    
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
      setIsMobile(window.innerWidth <=768);
    };
    useEffect(() => {
      checkScreenWidth();
      window.addEventListener('resize', checkScreenWidth);
    
      return () => {
        window.removeEventListener('resize', checkScreenWidth);
      };
    }, []);
  

  
  

    return (
      <>
        {isDesktop ? (
          <div className={styles.searchOptionsWrapper}>
            <div className={styles.searchOptionsFlexContainer}>
             
              <CustomizedHook
                onSearch={setAutocompleteSelections}
                location={location}
              />
              
           
            </div>
          </div>
        ) : (
          <div className={styles.searchOptionsWrapper}>
            <CustomizedHook
              onSearch={setAutocompleteSelections}
              location={location}

            />
            <div className={styles.searchOptionsMobileFlexContainer}>
                         </div>
          </div>
        )}
      </>
    );
  };

  export default SearchOptions;
