import React from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import style from "./BlogsMedia.module.css";
import Image from "next/image";
import CustomBackdrop from "../shared/Backdrop.jsx";

// Same treatment as the property card: the enquiry form is only fetched when a
// card's "Enquire Now" is actually pressed, so it costs the home page nothing.
const PropertyPageFloatingContact = dynamic(
  () => import("../property-detail/PropertyPageFloatingContact.jsx"),
  { ssr: false }
);

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay } from "swiper";

const fetcher = (url) => fetch(url).then((r) => r.json());

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

function BlogsMedia(props) {
  // Which post's enquiry form is open, or null. Held here rather than per card so
  // there is one modal in the tree instead of one per slide.
  const [enquiryPost, setEnquiryPost] = React.useState(null);

  // `?_embed` returns every post's full content plus all embedded authors and
  // terms — 467 KB of JSON for a carousel that reads six fields. `_fields` trims
  // the posts and `_embed=wp:featuredmedia` embeds only the featured image,
  // taking the response to ~43 KB. It was the largest request on the homepage and
  // landed at High priority, starving the LCP hero of bandwidth on mobile.
  // NOTE: `_links.wp:featuredmedia` must stay in `_fields` or `_embedded` comes
  // back empty and every card falls back to /placeholder.jpg.
  const { data } = useSWR(
    "https://cms.inframantra.com/wp-json/wp/v2/posts" +
      "?_embed=wp:featuredmedia" +
      "&_fields=id,slug,date,categories,title,_links.wp:featuredmedia" +
      "&per_page=10",
    fetcher,
    // Was 60 s: a homepage blog carousel does not need minute-by-minute polling,
    // and every tick re-downloaded the payload and re-rendered the Swiper.
    { refreshInterval: 300000 }
  );
  const getPostUrl = (post) => {
    const categories = post?.categories || [];
    const categoryId = Number(categories[0]); // WP gives array of IDs

    if (categoryId === 5) return `/news/${post.slug}`;
    if (categoryId === 12) return `/pr/${post.slug}`;
    if (categoryId === 3 || categoryId === 4) return `/blog/${post.slug}`;

    return `/blog/${post.slug}`;
  };

  return (
    <div className={style.blogsMediaSectionWrapper}>
      <h3>
        Media and Latest <span>Updates</span>
      </h3>

      {data && (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          autoplay={{ delay: 3000 }}
          loop={true}
          /* Same steps as the property carousel in PremiumPicksSection.jsx, so a blog
             card is exactly as wide as a property card at every breakpoint — three
             per row here against four there was the visible size mismatch. */
          breakpoints={{
            320: { slidesPerView: 1.5, spaceBetween: 16 },
            480: { slidesPerView: 1.8, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className={style.blogPostSwiper}
        >
          {data.map((post) => {
            const media = post._embedded?.["wp:featuredmedia"]?.[0];
            return (
              <SwiperSlide key={post.id}>
                <div className={style.blogPostCard}>
                  <a href={getPostUrl(post)}>
                    <div className={style.blogPostImgWrap}>
                      <Image
                        src={media?.source_url || "/placeholder.jpg"}
                        alt={post.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={90}
                        sizes="(max-width: 480px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 25vw, 300px"
                      />
                    </div>
                    <div className={style.blogPostBody}>
                      {post.date && (
                        <span className={style.blogPostDate}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {formatDate(post.date)}
                        </span>
                      )}
                      <h3>{post.title.rendered}</h3>
                    </div>
                  </a>

                  {/* Matches the property card's action row. "Read article" was a
                      text link doing the same job as View More, so it is folded in
                      rather than sitting alongside a button that repeats it. */}
                  <div className={style.blogPostActions}>
                    <a
                      href={getPostUrl(post)}
                      className={`${style.blogPostBtn} ${style.blogPostBtnView}`}
                    >
                      View More
                    </a>
                    <button
                      type="button"
                      onClick={() => setEnquiryPost(post)}
                      className={`${style.blogPostBtn} ${style.blogPostBtnEnquire}`}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      <a className={style.moreBlogs} href={`/blog`}>
        Explore More
      </a>

      {enquiryPost &&
        typeof document !== "undefined" &&
        createPortal(
          <CustomBackdrop open onClose={() => setEnquiryPost(null)}>
            <PropertyPageFloatingContact
              name={enquiryPost.title?.rendered}
              onClose={() => setEnquiryPost(null)}
            />
          </CustomBackdrop>,
          document.body
        )}
    </div>
  );
}

export default BlogsMedia;
