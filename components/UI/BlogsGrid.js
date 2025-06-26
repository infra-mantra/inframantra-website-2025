import React,{useEffect,useState} from "react";
import Section from "../UI/Section";
import Image from "next/image";
import Link from "next/link";
import NoImage from "./NoImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";

function BlogsGrid({
  blogs,
  trendingBlogs = [],
  newsItems = [],
  latestNews,
  trending,
  button,
  initial,
  loadMore,
  blogBtn,
}) {
// console.log(latestNews)

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

const checkScreenWidth = () => {
  setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
  setIsMobile(window.innerWidth <= 768);
};
useEffect(() => {
  checkScreenWidth();
  window.addEventListener('resize', checkScreenWidth);

  return () => {
      window.removeEventListener('resize', checkScreenWidth);
  };
}, []);
const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensure day is 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
};

  

  return (
    <Section classes="featured-blogs sec-p pt-0" pageWidth="container">
      <div className="blogs-layout">
        <div className="blogs-section">
          <h2 className="blogs-title">| Blogs</h2>
          <div className="f-blog-item-list">
            {blogs.map((blog, index) => {
        
         
              return (
              <Link
                key={index}
                href={blog.link ? blog.link : `/blog/${blog.slug}`}
                passHref
              >
                <a
                  className="f-blog-item"
                  target={blog.link ? "_blank" : "_self"}
                  rel={blog.link ? "noreferrer" : ""}
                >
                  <div className="blog-card-image">
                    {blog.file ? (
                      <Image
                        src={blog.file.path}
                        alt={blog.name || "Blog Image"}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <NoImage />
                    )}
                  </div>
                  <div className="info">
                    <h4>{blog.name}</h4>
                    {isDesktop ?(<p className="two-line-text">{blog?.shortDescription?.substring(0,200)}...</p>):(null)}
                    <p>
                      {formatDate(blog.createdAt)} | {blog?.writer_name}
                    </p>
                  </div>
                </a>
              </Link>)
              
       
     
            })}
          </div>
          <div className="btn-wrap text-center mt-5" style={{display:"flex", justifyContent:"center"}}>
          <button type="button" className="theme-btn" onClick={loadMore}>
            Load More
          </button>
        </div>
        </div>
    

        {/* Sidebar Section */} 
        <div className="sidebar-section">
          {/* Trending Section */}
          <div className="trending-section">
            <h3 className="trending-title">| Trending News</h3>
            <Swiper
              pagination={{
                clickable: true,
                el: ".trending-pagination", 
              }}
              navigation={{
                prevEl: ".custom-prev", 
                nextEl: ".custom-next", 
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
            {trending?.map((article, index) => {
               
                return (
                  <SwiperSlide key={index}>

                
            <Link 
            
            key={index}
            href={`/news/${article.slug}`}
            passHref
            
            >
        <a className="trending-card" target={article.link ? "_blank" : "_self"} rel={article.link ? "noopener noreferrer" : ""}>
          <div>
            {/* <p className="trending-source">{trendingBlogs[index]?.source || "Source Unknown"}</p> */}
            <img  src="./assets/images/INFRAMANTRA NEWS B.svg"/>
            <h4 className="trending-heading">{article?.title}</h4>
            <p className="trending-description">{article?.shortDescription.substring(0,200)}... </p>
            <div className="trending-meta">
              <p className="trending-author">{article?.writer_name || "Anonymous"}</p>
              <p>|</p>
              <p className="trending-date">{formatDate(article?.createdAt)}</p>
            </div>
          </div>
        </a>
      </Link>
      </SwiperSlide>
          )
})}
              {/* Add Arrows Inside Swiper */}
              <div className="custom-prev">‹</div>
              <div className="custom-next">›</div>
            </Swiper>
            {/* Custom Pagination Element */}
            <div className="trending-pagination"></div>
          </div>

          {/* News Section */}
          <div className="news-section">
            <h3 className="news-heading">| Trending Articles</h3>
            <div className="news-list">
            {latestNews?.map((item, index) => {


  return (
    <Link
                key={index}
                href={`/blog/${item.slug}`}
                passHref
              >
        <div className="news-card">
          <div className="news-rank">#{index + 1}</div>
          <div className="news-content">
            <h4 className="news-title">{item.title}</h4>
            <p className="news-meta">
              {formatDate(item.createdAt)} | {item?.writer_name ||item?.writer_name}
            </p>
          </div>
        </div>
    </Link>
  );
})}

            </div>
          </div>
        </div>
      </div>

      
 

      {blogBtn && (
        <div className="text-center mt-5">
          <Link href="/blogs">
            <a className="theme-btn">View More</a>
          </Link>
        </div>
      )}
    </Section>
  );
}

// Dummy Data for Trending and News
BlogsGrid.defaultProps = {
  trendingBlogs: [
    {
      title: "MUMBAI PROPERTY REGISTRATIONS DOUBLE FOR THE FIRST TIME SINCE 2019",
      description:
        "Mumbai saw average quarterly value of registered properties at Rs 44,520 crore in the first half of the current year.",
      source: "Realty",
      author: "Sanjeev Sinha",
      date: "Sept 2022",
    },
    {
      title: "COMMERCIAL REAL ESTATE TRENDS TO WATCH IN 2024 FIRST TIME SINCE 2022",
      description:
        "The commercial real estate market has shown resilience in the face of economic fluctuations in the second half of the year.",
      source: "ECONOMIC TIMES",
      author: "John Doe",
      date: "Oct 2022",
    },
  ],
  newsItems: [
    {
      id: 1,
      title:
        "Unsold Housing Stock Down 12% Across Nine Cities At End Of September Quarter",
      date: "Oct 2022",
      readTime: "8 Mins Read",
    },
    {
      id: 2,
      title: "Affordable Housing Schemes Announced for Middle Class Families",
      date: "Nov 2022",
      readTime: "6 Mins Read",
    },
    {
      id: 3,
      title: "Urban Land Use Planning to Improve City Living",
      date: "Dec 2022",
      readTime: "7 Mins Read",
    },
    {
      id: 4,
      title: "Technology Transforming Real Estate Marketing",
      date: "Feb 2023",
      readTime: "5 Mins Read",
    },
  ],
};

export default BlogsGrid;
