import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./blogContent.module.css";
import HomePageCta from "../../components/detailSections/CTA_NEW";
import { useRouter } from "next/router";
import SubmitEnquiry from "../helper/formApi";

/* ==============================
   HTML Helpers
============================== */

const entityMap = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  lt: "<",
  gt: ">",
};

const decodeEntities = (str = "") =>
  str
    .replace(/&([a-z]+);/gi, (_, name) => entityMap[name] || _)
    .replace(/&#(x?\d+);?/gi, (_, num) =>
      String.fromCharCode(
        /^x/i.test(num) ? parseInt(num.slice(1), 16) : +num
      )
    );

const stripTags = (html = "") =>
  html.replace(/<[^>]+>/g, "");

const addHeadingIDs = (html = "") =>
  html.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, lvl, attrs, inner) => {
      const plain = decodeEntities(stripTags(inner));
      const id = plain
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
    }
  );

/* ==============================
   🔥 MANUAL CMS FORM INSERTION
============================== */

const insertFormByMarker = (html) => {
  const marker = '<div id="blog-enquiry-form"></div>';

  if (!html.includes(marker)) {
    return { before: html, after: null };
  }

  const parts = html.split(marker);

  return {
    before: parts[0],
    after: parts[1] || "",
  };
};

/* ==============================
   COMPONENT
============================== */

export default function BlogContent({
  detailContent = {},
  recent = [],
  data = {},
  name = "",
  slug,
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [popForm, setPopForm] = useState(false);

  const router = useRouter();

  const onClickOff = (val) => setPopForm(val);

  useEffect(() => {
    window.handleform = () => setPopForm(true);
    return () => {
      delete window.handleform;
    };
  }, []);

  useEffect(() => {
    const update = () =>
      setIsDesktop(window.innerWidth >= 768);

    update();
    window.addEventListener("resize", update);
    return () =>
      window.removeEventListener("resize", update);
  }, []);

  /* ==============================
     Prepare Blog HTML
  ============================== */

  const raw =
    detailContent.description ||
    detailContent.content ||
    "";

  let html = addHeadingIDs(
    decodeEntities(raw)
  );

  const {
    before: contentBeforeCTA,
    after: contentAfterCTA,
  } = insertFormByMarker(html);

  /* ==============================
     Table of Contents
  ============================== */

  const tocItems = [
    ...html.matchAll(
      /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi
    ),
  ].map(([_, __, inner], i) => {
    const txt = decodeEntities(
      stripTags(inner)
    );
    const id = txt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return (
      <li key={i}>
        <a href={`#${id}`}>{txt}</a>
      </li>
    );
  });

  return (
    <Section
      classes={styles.secP}
      pageWidth="container"
    >
      <div className={styles.blogContentWrap}>
        <div className={styles.flexLayout}>

          {/* ================= TOC ================= */}
          <aside className={styles.toc}>
            <h4>Table of Contents</h4>
            <ul>{tocItems}</ul>
          </aside>

          {/* ================= BLOG ================= */}
          <article className={styles.textWrap}>

            {/* Content Before Marker */}
            <div
              className="content prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: contentBeforeCTA,
              }}
            />

            {/* If Marker Exists → Show Form */}
            {contentAfterCTA !== null && (
              <>
                <div
                  style={{
                    margin: "40px 0",
                  }}
                >
                {!isDesktop &&(  <SubmitEnquiry slug={slug} />)}
                </div>

                {/* Remaining Content */}
                <div
                  className="content prose lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: contentAfterCTA,
                  }}
                />
              </>
            )}

            <p className={styles.writtenby}>
              <b>✍️ Written By: </b>
              {name}
            </p>
          </article>

          {/* ================= SIDEBAR ================= */}
          <aside
            className={styles.sidebar}
            style={
              data.type === "news" &&
              isDesktop
                ? { marginTop: "-215px" }
                : {}
            }
          >
            <div className={styles.sdCard}>
              <div className={styles.sdCardHead}>
                <h3>Recent Blogs</h3>
              </div>

              <div
                className={
                  styles.sdLatestBlogs
                }
              >
                {recent.map((b) => {
                  const title =
                    decodeEntities(b.title);

                  return (
                    <Link
                      href={`/blog/${b.slug}`}
                      key={b.slug}
                    >
                      <a
                        className={
                          styles.sdBlgItem
                        }
                      >
                        <div className="icon">
                          {b.image ? (
                            <img
                              src={b.image}
                              alt={title}
                            />
                          ) : (
                            <div
                              style={{
                                width: "60px",
                                height:
                                  "60px",
                                background:
                                  "#ccc",
                              }}
                            />
                          )}
                        </div>

                        <div
                          className={
                            styles.info
                          }
                        >
                          <p
                            className={
                              styles.date
                            }
                          >
                            {b.date}
                          </p>
                          <h3>
                            {title.length >
                            40
                              ? title.slice(
                                  0,
                                  37
                                ) +
                                "…"
                              : title}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  );
                })}

                <div className="stickyBlog">
                  <HomePageCta
                    popUpenable={
                      popForm
                    }
                    onClickOff={
                      onClickOff
                    }
                    text="OUR EXPERT TEAM IS HERE TO HELP YOU WITH YOUR QUERY."
                    name={slug}
                  />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </Section>
  );
}
