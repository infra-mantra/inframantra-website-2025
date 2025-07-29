import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import { useRouter } from "next/router";
import styles from './blogContent.module.css'

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

  const handleSelectClick = () => {
    props.toggleSelection(props.item); 
  };

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
      .replace(/&rsquo;/g, "'") 
      .replace(/&nbsp;/g, " ") 
      .replace(/<[^>]+>/g, ""); 
  };
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
          <div className={styles.toc}>
            <h4>Table of Contents</h4>
            <ul>{generateTOC(detailContent.description)}</ul>
          </div>

          <div className={styles.textWrap}>
            <div
          
              dangerouslySetInnerHTML={{
                __html: addHeadingIDs(detailContent.description),
              }}
            ></div>
            <div className={styles.writtenby}>
              <h4>✍️ Written By: </h4>
              <span>{name}</span>
            </div>
          </div>

          
          <div className={styles.sidebar} style={data=='news' && isDesktop ? {"marginTop":"-215px"}:{}}>
            <div className={styles.sdCard}>
              <div className={styles.sdCardHead}>
                <h3>Recent Blogs</h3>
              </div>
              <div className={styles.sdLatestBlogs}>
                {recent.map((blog) => (
                  <Link href={data=='news'?`/news/${blog.slug}`:`/blog/${blog.slug}`} key={blog.id}>
                    <a className={styles.sdBlgItem}>
                      <div className="icon">
                        {blog.image ? (
                          <img src={blog.image} layout="fill" alt={blog.title.substring(0,20)} />
                        ) : (
                          <div style={{ width: "60px", height: "60px", background: "#ccc" }} />
                        )}
                      </div>
                      <div className={styles.info}>
                        <p className={styles.date}>{blog.date}</p>
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
