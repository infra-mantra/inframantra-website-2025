import NoImage from "./NoImage";
import Section from "./Section";
import Share from '../../pages/share';
import { useEffect ,useState } from "react";
import styles from './blogHeader.module.css'

const PageHeader = (props) => {
    const { image, title, date, detailContent,thumbnail } = props.data;
    const [isDesktop, setIsDesktop] = useState(false);


  useEffect(() => {
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth >= 768);
    function handleResize() {
      const newScreenWidth = window.innerWidth;
      setIsDesktop(newScreenWidth >= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
      
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
      
        const monthName = monthNames[parseInt(month, 10) - 1];
       return `${monthName} ${day}  ${year}`;
      };

    return (
        <Section classes={styles.blogPageHeader} id="" pageWidth="fluid">
            <div className={styles.blogHeaderContent}>
                {/* Title and Date */}
                <div className={styles.blogBannerContent}>
                    <div className={styles.pageWidth}>
                        <p className={styles.date}>{formatDate(date)}</p>
                        <h1>{title}</h1>
                        {/* Share Section */}
                        <div className={styles.blogDivider}></div>
                        <Share  content={detailContent} />
                    </div>
                </div>
                
                {image ? (
                    <>
                    <div>
                    <picture className={styles.blogHeaderImageContainer}>
                        <img
                            src={isDesktop?image:thumbnail}
                            alt="Banner"
                        className={styles.blogHeaderImage}
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
