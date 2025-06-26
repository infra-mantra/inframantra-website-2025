import Section from "../UI/Section";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import { useRouter } from "next/router";
import Blogs from "../../pages/blog";

export default function BlogContent({ detailContent, popular, recent, data, name }) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [blogtype, setBlogType] = useState(null);

  const [isSelected, setIsSelected] = useState(false);

  // Function to handle the selection of an item
  const handleSelectClick = () => {
    props.toggleSelection(props.item); // Pass the item data to the toggleSelection function
  };

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

  useEffect(() => {
    const fetchBlogType = async () => {
      const getData = await Ajax({
        url: `/blog/blogType/`,
        loader: true,
      });
      setBlogType(getData.data.result);
    };
    fetchBlogType();
  }, []);



  // Generate Table of Contents based on headings in the content
  const generateTOC = (content) => {
    const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g);
    if (!headings) return [];

    return headings.map((heading, index) => {
      const text = heading.replace(/<h[2-3][^>]*>/, "").replace(/<\/h[2-3]>/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      heading.replace(/<\/?[^>]+(>|$)/g, "")
      return (
        <li key={index}>
          <a href={`#${id}`}>{cleanText(text.replace(/<\/?[^>]+(>|$)/g, ""))}</a>
        </li>
      );
    });
  };
  const cleanText = (text) => {
    return text
      .replace(/&rsquo;/g, "'") // Replace right single quote entity
      .replace(/&nbsp;/g, " ")  // Replace non-breaking space entity
      .replace(/<[^>]+>/g, ""); // Remove any remaining HTML tags
  };
  // Add IDs to headings in the description for TOC linking
  const addHeadingIDs = (content) => {
    return content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  };

  const relatedBogs = ()=>{
    return (
      <Link 
        key={item.link} 
        href={item.link || "#"} 
        passHref
      >
        <a target={item.link ? "_blank" : "_self"} rel={item.link ? "noreferrer" : ""}>
          <div className="news-card">
            <div className="news-rank">#{index + 1}</div>
            <div className="news-content">
              <h4 className="news-title">{item.title}</h4>
              <p className="news-meta">
                {formattedDate} | {item?.readTime || "N/A"}
              </p>
            </div>
          </div>
        </a>
      </Link>
    );
    }

  return (
    <Section classes="blog-content sec-p" pageWidth="container">
      <div className="blog-content-wrap">
        <div className="flex-layout">
       

          <div className="text-wrap">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: addHeadingIDs(detailContent.description) }}
            ></div>
       
            
          </div>

          
       

          <div className="media-sidebar">
          {recent.length > 0 ? (
           recent.map((post) => (
              <div key={post._id} className="media-sidebar-item">
                {post.image && <img src={post.image} alt={post.name} className="media-sidebar-img" />}
                <div className="media-sidebar-content">
                  <p className="media-sidebar-date">Oct 2022 | 8 Mins Read</p>
                  <h4 className="media-sidebar-title">{post.name}</h4>
                  <p className="media-sidebar-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus varius nec nisi sed tempus.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
          
        </div>
      </div>
    </Section>
  );
}
