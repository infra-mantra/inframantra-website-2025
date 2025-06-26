import NoImage from "./NoImage";
import Section from "./Section";
import Share from '../../pages/share';
import { useEffect ,useState } from "react";

const PageHeader = (props) => {
    const { image, title, date, detailContent,thumbnail } = props.data;


  const [isDesktop, setIsDesktop] = useState(false);




  useEffect(() => {
    // Use window.innerWidth to determine the screen width
    const screenWidth = window.innerWidth;
    // Set isDesktop based on your desired threshold (e.g., 768px for tablets)
    setIsDesktop(screenWidth >= 768);
    // Add event listener to handle window resize (optional)
    function handleResize() {
      const newScreenWidth = window.innerWidth;
      setIsDesktop(newScreenWidth >= 768);
    }
    // Attach the event listener
    window.addEventListener('resize', handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);









 
    const formatDate = (dateString) => {
        // Split the input date string into components
        const [day, month, year] = dateString.split("/");
      
        // Array of month names
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
      
        // Convert the numeric month to its name
        const monthName = monthNames[parseInt(month, 10) - 1];
      
        // Return the formatted date
        return `${monthName} ${day}  ${year}`;
      };


      

    return (
        <Section classes="blog-page-header" id="" pageWidth="fluid">
            <div className="blog-header-content">
                {/* Title and Date */}
                <div className="blog-banner-content">
                    <div className="page-width">
                        <p className="date">{formatDate(date)}</p>
                        <h1>{title}</h1>
                        {/* Share Section */}
                        <div className="blog-divider"></div>
                        <Share className="share-section" content={detailContent} />
                    </div>
                </div>
                
                {image ? (
                    <>
                    <div>
                    <picture className="blog-header-image-container">
                        <img
                            src={isDesktop?image:thumbnail}
                            alt="Banner"
                            className="blog-header-image"
                        />
                    
                    </picture>
                    <p style={{"display":"flex","alignItems":"center","justifyContent":"center",    "margin": "1rem 21px"}}>{title}</p>
                    </div>
                    </>
                 
                ) : (
                    <NoImage />
                )}
                    
            </div>
        </Section>
    );
};

export default PageHeader;
