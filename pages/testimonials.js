import React, {useState, useEffect} from "react";
import Wrapper from "../components/UI/Wrapper";
import Ajax1 from "../components/helper/Ajax1.js";
import styles from "../components/newComponents/testimonialsBanner/testimonialsBanner.module.css";

import TestimonialsBanner from "../components/newComponents/testimonialsBanner/testimonialsBaner.jsx";
import TestimonialCard from "../components/newComponents/testimonialsBanner/testimonialsCard/testimonialsCard.jsx";

const TestiMonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Ajax1({
        url: "/testimonials/get",
        loader: true,
      });
      if (data.data.data !== null) {
        setTestimonials(data.data.data);
      }
    };
    fetchData();
  },[])





  return(
     <Wrapper>
       <div className={styles.testimonialsWrapper}>
         <TestimonialsBanner/>
         <div className={styles.testimonialCardContainer}>
         {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} data={testimonial}/>
         ))}
         </div>
     </div>
     </Wrapper>
  )
}

export default TestiMonials;
