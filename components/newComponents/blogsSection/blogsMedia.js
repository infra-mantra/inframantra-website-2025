import React from "react";
import useSWR from "swr";
import style from "./blogsMedia.module.css";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay } from 'swiper';


const fetcher = (url) => fetch(url).then((r) => r.json());

function BlogsMedia(props) {
  const { data } = useSWR(
    "https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=10",
    fetcher,
    { refreshInterval: 60000 }
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
      <h3>Media and Latest Updates</h3>

      {data && (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          autoplay={{ delay: 3000 }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1.5, spaceBetween: 15 }, // mobile
            768: { slidesPerView: 3, spaceBetween: 20 }, // desktop
          }}
          className={style.blogPostSwiper}
        >
          {data.map((post) => (
            <SwiperSlide key={post.id}>
              <a href={getPostUrl(post)}>
                <div className={style.blogPostCard}>
                  <Image
                    src={
                      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "/placeholder.jpg"
                    }
                    alt={post.title.rendered}
                    width={500}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <h3>{post.title.rendered}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.rendered.substring(0, 100),
                    }}
                  />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <a className={style.moreBlogs} href={`/blog`}>
        Explore More
      </a>
    </div>
  );
}

export default BlogsMedia;
