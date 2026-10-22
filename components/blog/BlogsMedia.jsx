import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { PremiumCardsSkeleton } from "../home/HomeSkeletons.jsx";
import style from "./BlogsMedia.module.css";

const fetcher = (url) => fetch(url).then((r) => r.json());

// `_fields` keeps the WordPress response small (~43 KB instead of ~467 KB).
// NOTE: `_links.wp:featuredmedia` must stay in `_fields` or `_embedded` comes back
// empty and every card falls back to /placeholder.jpg.
const POSTS_URL =
  "https://cms.inframantra.com/wp-json/wp/v2/posts" +
  "?_embed=wp:featuredmedia" +
  "&_fields=id,slug,date,categories,title,_links.wp:featuredmedia" +
  "&per_page=8";

// WordPress category id -> where the article lives + the chip label on the card.
const getPostInfo = (post) => {
  const categoryId = Number((post?.categories || [])[0]);
  if (categoryId === 5) return { url: `/news/${post.slug}`, label: "News" };
  if (categoryId === 12) return { url: `/pr/${post.slug}`, label: "Press" };
  return { url: `/blog/${post.slug}`, label: "Blog" };
};

// "2026-08-12T10:30:00" -> "12 Aug 2026"
const formatDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

// WordPress titles arrive HTML-encoded (e.g. "&#8217;"), so decode them for display.
const decode = (html) =>
  typeof window === "undefined"
    ? html
    : new DOMParser().parseFromString(html, "text/html").documentElement.textContent;

function BlogsMedia() {
  // A homepage blog row does not need minute-by-minute polling: refresh every 5 min.
  const { data } = useSWR(POSTS_URL, fetcher, { refreshInterval: 300000 });
  const posts = Array.isArray(data) ? data : [];

  return (
    <section className={style.blogsMediaSectionWrapper} aria-labelledby="home-media-title">
      {/* Section header: eyebrow + title on the left, "View all" on the right */}
      <div className={style.bmHead} data-reveal>
        <div>
          <h2 id="home-media-title" className={style.bmTitle}>
            Media and Latest <span>Updates</span>
          </h2>
        </div>
        <Link href="/blog">
          <a className={style.bmViewAll}>
            View all <span aria-hidden="true">→</span>
          </a>
        </Link>
      </div>

      {/* Skeleton cards until the WordPress posts arrive (same row, no jump). */}
      {!data && <PremiumCardsSkeleton />}

      {data && (
        // Plain CSS layout: 4-up grid on desktop, 2-up on tablet, swipe row on phones.
        <ul className={style.bmGrid} data-reveal="stagger">
          {posts.map((post) => {
            const media = post._embedded?.["wp:featuredmedia"]?.[0];
            const { url, label } = getPostInfo(post);
            const title = decode(post.title.rendered);
            return (
              <li key={post.id} className={style.bmItem}>
                {/* The whole card is one link to the article */}
                <a href={url} className={style.bmCard}>
                  <div className={style.bmImg}>
                    <Image
                      src={media?.source_url || "/placeholder.jpg"}
                      alt={title}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 320px"
                    />
                  </div>
                  <div className={style.bmBody}>
                    {/* category chip + date (kept off the image so the banner text stays readable) */}
                    <p className={style.bmMeta}>
                      <span className={style.bmChip}>{label}</span>
                      {post.date && (
                        <time className={style.bmDate} dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      )}
                    </p>
                    <h3 className={style.bmCardTitle}>{title}</h3>
                    <span className={style.bmRead}>
                      Read article <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default BlogsMedia;
