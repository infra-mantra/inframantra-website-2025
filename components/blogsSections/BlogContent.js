import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect } from "react";
import Ajax from "../helper/Ajax";
import { useRouter } from "next/router";
import styles from './blogContent.module.css'


/* ------------------------------------------------------------------ */
/* 1.  Universal HTML‑entity decoder (works the same on SSR & client) */
/* ------------------------------------------------------------------ */
const entityMap = {
  nbsp : " ", // non‑breaking space
  amp  : "&",
  quot : "\"",
  lt   : "<",
  gt   : ">",
};

const decodeEntities = (str = "") =>
  str
    // named entities
    .replace(/&([a-z]+);/gi, (_, name) => entityMap[name] || _)
    // numeric entities
    .replace(/&#(x?\d+);?/gi, (_, num) =>
      String.fromCharCode(/^x/i.test(num) ? parseInt(num.slice(1), 16) : +num)
    );

    /* 2.  Strip tags helper */
const stripTags = (html = "") => html.replace(/<[^>]+>/g, "");

/* 3.  Inject IDs into h2‑h4 AFTER decoding entities                 */
const addHeadingIDs = (html = "") =>
  html.replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, lvl, attrs, inner) => {
    const plain = decodeEntities(stripTags(inner));
    const id    = plain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
  });

export default function BlogContent({
  detailContent = {},
  recent        = [],
  data          = {},
  name          = "",
}) { /* viewport breakpoint */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* prepare article & ToC */
  const raw   = detailContent.description || detailContent.content || "";
  const html  = addHeadingIDs(decodeEntities(raw));

  const tocItems =
    [...html.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(([_, __, inner], i) => {
      const txt = decodeEntities(stripTags(inner));
      const id  = txt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return (
        <li key={i}>
          <a href={`#${id}`}>{txt}</a>
        </li>
      );
    });


  return (
    <Section classes={styles.secP} pageWidth="container">
      <div className={styles.blogContentWrap}>
        <div className={styles.flexLayout}>
          <aside className={styles.toc}>
            <h4>Table of Contents</h4>
            <ul>{tocItems}</ul>
          </aside>

          <article className={styles.textWrap}>
            <div
          
             className="content prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
            <p className={styles.writtenby}>
              <b>✍️ Written By: </b>{name}
            </p>
          </article>

          
          <aside className={styles.sidebar} style={data.type =='news' && isDesktop ? {"marginTop":"-215px"}:{}}>
            <div className={styles.sdCard}>
              <div className={styles.sdCardHead}>
                <h3>Recent Blogs</h3>
              </div>
              <div className={styles.sdLatestBlogs}>
                {recent.map((b) => {
                  const title = decodeEntities(b.title);
                  return (
                  <Link href={`/blog/${b.slug}`} key={b.slug}>
                    <a className={styles.sdBlgItem}>
                      <div className="icon">
                        {b.image ? (
                          <img src={b.image} layout="fill" alt={title} />
                        ) : (
                          <div style={{ width: "60px", height: "60px", background: "#ccc" }} />
                        )}
                      </div>
                      <div className={styles.info}>
                        <p className={styles.date}>{b.date}</p>
                        <h3 > {title.length > 40 ? title.slice(0, 37) + "…" : title}</h3>
                      </div>
                    </a>
                  </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
