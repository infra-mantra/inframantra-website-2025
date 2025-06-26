import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import { useRouter } from "next/router";

export default function BlogContent({
  detailContent,
  popular,
  recent,
  data,
  name,
}) {
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
    window.addEventListener("resize", handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
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
      const text = heading
        .replace(/<h[2-3][^>]*>/, "")
        .replace(/<\/h[2-3]>/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      heading.replace(/<\/?[^>]+(>|$)/g, "");
      return (
        <li key={index}>
          <a href={`#${id}`}>
            {cleanText(text.replace(/<\/?[^>]+(>|$)/g, ""))}
          </a>
        </li>
      );
    });
  };
  const cleanText = (text) => {
    return text
      .replace(/&rsquo;/g, "'") // Replace right single quote entity
      .replace(/&nbsp;/g, " ") // Replace non-breaking space entity
      .replace(/<[^>]+>/g, ""); // Remove any remaining HTML tags
  };
  // Add IDs to headings in the description for TOC linking
  const addHeadingIDs = (content) => {
    return content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  };

  const relatedBogs = () => {
    return (
      <Link key={item.link} href={item.link || "#"} passHref>
        <a
          target={item.link ? "_blank" : "_self"}
          rel={item.link ? "noreferrer" : ""}
        >
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
  };

  return (
    <Section classes="blog-content sec-p" pageWidth="container">
      <div className="blog-content-wrap">
        <div className="flex-layout">
          <div className="toc">
            <h4>Table of Contents</h4>
            <ul>{generateTOC(detailContent.description)}</ul>
          </div>

          <div className="text-wrap">
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: addHeadingIDs(detailContent.description),
              }}
            ></div>
            <div className="written-by">
              <h4>✍️ Written By: </h4>
              <span>{name}</span>
            </div>
          </div>

          
          <div className="sidebar" style={data=='news' && isDesktop ? {"marginTop":"-215px"}:{}}>
            <div className="sd-card">
              <div className="sd-card-head">
                <h3>Recent Blogs</h3>
              </div>
              <div className="sd-latest-blogs">
                {recent.map((blog) => (
                  <Link href={data=='news'?`/news/${blog.slug}`:`/blog/${blog.slug}`} key={blog.id}>
                    <a className="sd-blg-item">
                      <div className="icon">
                        {blog.image ? (
                          <img src={blog.image} layout="fill" alt={blog.title.substring(0,20)} />
                        ) : (
                          <div style={{ width: "60px", height: "60px", background: "#ccc" }} />
                        )}
                      </div>
                      <div className="info">
                        <p className="date">{blog.date}</p>
                        <h3 >{blog.title.substring(0,40)}...</h3>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
