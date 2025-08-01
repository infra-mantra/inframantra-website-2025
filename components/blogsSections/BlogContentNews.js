import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import styles from './blogContentNews.module.css'

export default function BlogContent({ detailContent, popular, recent, data, name }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [blogtype, setBlogType] = useState(null);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth >= 768);

    function handleResize() {
      const newScreenWidth = window.innerWidth;
      setIsDesktop(newScreenWidth >= 768);
    }

    window.addEventListener("resize", handleResize);
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
      const text = heading.replace(/<h[2-3][^>]*>/, "").replace(/<\/h[2-3]>/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <li key={index}>
          <a href={`#${id}`}>{text}</a>
        </li>
      );
    });
  };

  // Add IDs to headings in the description for TOC linking
  const addHeadingIDs = (content) => {
    return content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  };

  return (
    <Section classes={styles.secP} pageWidth="container">
      <div className={styles.blogContentWrap}>
        <div className={styles.flexLayout}>
          {/* Table of Contents */}
          <div className={styles.toc}>
            <h1>Table of Contents</h1>
            <ul>{generateTOC(detailContent.description)}</ul>
          </div>

          {/* Blog Content */}
          <div className={styles.textWrap}>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: addHeadingIDs(detailContent.description) }}
            ></div>
            <div className={styles.writtenBy}>
              <h4>✍️ Written By: </h4>
              <span>{name}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar} style={data === "news" && isDesktop ? { marginTop: "-215px" } : {}}>
            <div className={styles.sdCardNews}>
              <div className={styles.sdCardHeadNews}>
                <h3>Recent Blogs</h3>
              </div>
              <div className={styles.sdLatestBlogsNews}>
                {recent.map((blog) => (
                  <Link href={data === "news" ? `/news/${blog.slug}` : `/blog/${blog.slug}`} key={blog.id}>
                    <a className={styles.sdBlgItemNews}>
                      <div>
                        <p className="date">{blog.date}</p>
                        <h3>{blog.title.substring(0, 200)}</h3>
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
