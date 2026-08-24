import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import { useRouter } from "next/router";
import styles from "./blogContentNews.module.css";
import HomePageCta from "../../components/detailSections/CTA_NEW";
import { submitEnquiry } from "../helper/formApi";
import SubmitEnquiry from "../helper/formApi"; // 👈 Make sure this exports component

/* ==============================
   🔥 CMS FORM INSERTION FUNCTION
============================== */

const insertFormByMarker = (html) => {
  const marker = '<div id="blog-enquiry-form"></div>';

  if (!html || !html.includes(marker)) {
    return { before: html, after: null };
  }

  const parts = html.split(marker);

  return {
    before: parts[0],
    after: parts[1] || "",
  };
};

export default function BlogContent({
  detailContent,
  popular,
  recent,
  data,
  name,
  slug
}) {
  const router = useRouter();

  const [isDesktop, setIsDesktop] = useState(false);
  const [blogtype, setBlogType] = useState(null);
  const [popForm, setPopForm] = useState(false);

  const onClickOff = (val) => setPopForm(val);

  /* ==============================
     Window Functions
  ============================== */

  useEffect(() => {
    window.submitEnquiryForm = (values) =>
      submitEnquiry(values, router, slug);

    window.handleform = () => setPopForm(true);

    return () => {
      delete window.handleform;
      delete window.submitEnquiryForm;
    };
  }, [router, slug]);

  /* ==============================
     Resize
  ============================== */

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  /* ==============================
     Fetch Blog Type
  ============================== */

  useEffect(() => {
    const fetchBlogType = async () => {
      const getData = await Ajax({
        url: `/blog/blogType/`,
        loader: true,
      });
      setBlogType(getData?.data?.result);
    };

    fetchBlogType();
  }, []);

  /* ==============================
     TOC Generator
  ============================== */

  const generateTOC = (content = "") => {
    const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g);
    if (!headings) return [];

    return headings.map((heading, index) => {
      const rawText = heading.replace(/<[^>]*>/g, "");
      const id = rawText
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return (
        <li key={index}>
          <a href={`#${id}`}>{rawText}</a>
        </li>
      );
    });
  };

  const addHeadingIDs = (content = "") => {
    return content.replace(
      /<h([2-3])>(.*?)<\/h\1>/g,
      (match, level, text) => {
        const cleanText = text.replace(/<[^>]*>/g, "");
        const id = cleanText
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        return `<h${level} id="${id}">${text}</h${level}>`;
      }
    );
  };

  /* ==============================
     Prepare Blog Content
  ============================== */

  const htmlWithIDs = addHeadingIDs(
    detailContent?.description || ""
  );

  const {
    before: contentBeforeCTA,
    after: contentAfterCTA,
  } = insertFormByMarker(htmlWithIDs);

  /* ==============================
     UI
  ============================== */

  return (
    <Section classes={styles.secP} pageWidth="container">
      <div className={styles.blogContentWrap}>
        <div className={styles.flexLayout}>

          {/* ================= TOC ================= */}
          <div className={styles.toc}>
            <h1>Table of Contents</h1>
            <ul>
              {generateTOC(detailContent?.description)}
            </ul>
          </div>

          {/* ================= BLOG CONTENT ================= */}
          <div className={styles.textWrap}>

            {/* Content Before Marker */}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: contentBeforeCTA,
              }}
            />

            {/* If Marker Exists → Show Form */}
            {contentAfterCTA !== null && (
              <>
                <div style={{ margin: "40px 0" }}>
                  {!isDesktop &&(  <SubmitEnquiry slug={slug} />)}
                </div>

                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: contentAfterCTA,
                  }}
                />
              </>
            )}

            <div className={styles.writtenBy}>
              <h4>✍️ Written By: </h4>
              <span>{name}</span>
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className={styles.sidebar}>
            <div className={styles.sdCardNews}>
              <div className={styles.sdCardHeadNews}>
                <h3>Recent Blogs</h3>
              </div>

              <div className={styles.sdLatestBlogsNews}>
                {recent?.map((blog) => (
                  <Link
                    href={
                      data === "news"
                        ? `/news/${blog.slug}`
                        : `/blog/${blog.slug}`
                    }
                    key={blog.id}
                  >
                    <a className={styles.sdBlgItemNews}>
                      <p className="date">{blog.date}</p>
                      <h3>
                        {blog.title.substring(0, 200)}
                      </h3>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ================= Sticky CTA ================= */}
          <div className="stickyBlog">
            <HomePageCta
              popUpenable={popForm}
              onClickOff={onClickOff}
              text="OUR EXPERT TEAM IS HERE TO HELP YOU WITH YOUR QUERY."
              name={slug}
            />
          </div>

        </div>
      </div>
    </Section>
  );
}
