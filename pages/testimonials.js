import React, { useState, useEffect } from "react";
import Wrapper from "../components/shared/Wrapper.jsx";
import Ajax1 from "../components/lib/ajax1.js";
import styles from "../components/home/testimonials/TestimonialsBanner.module.css";

import TestimonialsBanner from "../components/home/testimonials/TestimonialsBaner.jsx";
import TestimonialCard from "../components/home/testimonials/TestimonialsCard.jsx";

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
  }, []);

  return (
    <Wrapper>
      <div className={styles.testimonialsWrapper}>
        <TestimonialsBanner />
        <div className={styles.testimonialCardContainer}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} data={testimonial} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default TestiMonials;
