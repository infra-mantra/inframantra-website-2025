import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../components/shared/Wrapper.jsx";
import PageHeader from "../../components/shared/PageHeaderNews.jsx";
import BlogContentNews from "../../components/blog/BlogContentNews.jsx";
import ArticleSchema from "../../components/shared/ArticleSchema.jsx";
import moment from "moment";

import style from "./news.module.css";

const BlogDetail = ({ allData }) => {
  const data = {
    title: allData?.detail?.title,
    ...(allData.detail.image && { image: allData.detail.image }),
    date: allData.detail.date,
  };

  const router = useRouter();
  const { detail } = allData || {};
  const { id, blogType, slug } = detail || {};

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!detail) return;
    let destination = null;
    if (blogType) {
      if (blogType === "Blogs") {
        destination = `/blog/${slug}`;
      } else if (blogType === "Infra Times") {
        destination = `/pr/${slug}`;
      } else if (blogType === "article") {
        destination = `/blog/${slug}`;
      }
    }
    if (!destination && id) {
      const categoryId = Number(id);

      if (categoryId === 5) {
        destination = null;
      } else if (categoryId === 12) {
        destination = `/pr/${slug}`;
      } else if (categoryId === 3 || categoryId === 4) {
        destination = `/blog/${slug}`;
      }
    }
    if (destination) {
      setRedirecting(true);
      setTimeout(() => {
        router.replace(destination);
      }, 100);
    }
  }, [id, blogType, slug, detail, router]);

  if (redirecting) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="loader-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    !redirecting && (
      <Wrapper
        title={allData.detail.metaTitle}
        description={allData.detail.metaDescription}
        image={allData.detail.image}
        keyword={allData.detail.metaKeyword}
      >
        <ArticleSchema detail={detail} type="NewsArticle" path={`/news/${slug}`} />
        <PageHeader classes="" date={data.date} data={data} />
        <BlogContentNews
          detailContent={allData.detail}
          name={allData.detail.name}
          recent={allData.recent}
          data="news"
          date={data.date}
          slug={allData.detail.slug}
        />
      </Wrapper>
    )
  );
};

// Nothing is prerendered at build time. This route sets a short `revalidate`,
// so any page built during `next build` is stale within seconds and gets
// regenerated on demand anyway — prerendering all ~14 of them (plus the slug-list
// fetches) only made the build slower without changing steady-state behaviour.
// `fallback: "blocking"` means the first request for a slug renders on the server
// and is cached from then on, which is what happened after the revalidate window
// regardless.
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = params.newsId;
  let detail = null;
  let relatedDataArray = [];
  let recentDataArray = [];

  // CMS DETAIL
  try {
    const res = await fetch(`${process.env.apiUrl}/blog/pageDetail?slug=${slug}`);
    const data = await res.json();
    const d = data?.result?.detail?.[0];

    if (d) {
      detail = {
        title: d.name,
        description: d.description,
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        metaKeyword: d.metaKeyword,
        ...(d.file && { image: d.file.path }),
        date: moment(d.createdAt).format("DD/MM/YYYY"),
        name: d.writer_name,
        blogType: d.blogType?.name,
        slug: d?.slug,
      };

      relatedDataArray = (data.result.reletedBlogs || []).map((e) => ({
        _id: e._id,
        name: e.name,
        ...(e.file && { file: e.file }),
        slug: e.slug,
      }));
    }
  } catch (err) {
    console.warn("CMS news detail fetch failed:", err.message);
  }

  // WORDPRESS DETAIL FALLBACK
  if (!detail) {
    try {
      const wp = await fetch(
        `https://cms.inframantra.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
      ).then((r) => r.json());

      const post = wp?.[0];

      if (post) {
        const media = post._embedded?.["wp:featuredmedia"]?.[0] || {};
        const yoast = post.yoast_head_json || {};

        const image = media.source_url || yoast?.og_image?.[0]?.url || "";

        detail = {
          title: post.title?.rendered?.replace(/<[^>]*>/g, "") || "Untitled",
          description: post.content?.rendered.replace(/id="h-([^"]+)"/g, 'id="$1"'),
          metaTitle: yoast.title || post.title.rendered,
          metaDescription: yoast.description || post.excerpt?.rendered || "",
          metaKeyword: post.meta?._yoast_wpseo_focuskw || "",
          image,
          date: moment(post.date).format("DD/MM/YYYY"),
          name: post._embedded?.author?.[0]?.name || "",
          id: wp[0].categories[0],
          slug: post.slug,
        };
      }
    } catch (err) {
      console.warn("WP news detail fallback failed:", err.message);
    }
  }

  // RECENT BLOGS — CMS BLOGS ONLY
  try {
    const cmsList = await fetch(
      `${process.env.apiUrl}/blog/pageDetail?blogType=news&limit=10`
    ).then((r) => r.json());

    const cmsRecent = (cmsList?.result?.latestBlogList || [])
      .filter((e) => e.blogType === "637b1be32e436918909f97ce")
      .map((e) => ({
        id: e._id,
        title: e.name,
        image: e.file?.smallFile || "",
        slug: e.slug,
        date: moment(e.createdAt),
      }));

    recentDataArray = [...cmsRecent];
  } catch (err) {
    console.warn("CMS recent blogs fetch failed:", err.message);
  }

  // RECENT BLOGS — WORDPRESS CATEGORY: news ONLY
  try {
    const wpList = await fetch(
      "https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=20"
    ).then((r) => r.json());

    const wpRecent = wpList
      .filter((x) => {
        const cat = x._embedded?.["wp:term"]?.[0]?.find((t) => t.taxonomy === "category");
        return cat?.slug === "news";
      })
      .map((x) => {
        const media = x._embedded?.["wp:featuredmedia"]?.[0];
        const ogImage = x.yoast_head_json?.og_image?.[0]?.url || "";
        const image = media?.source_url || ogImage;

        return {
          id: x.id,
          title: x.title?.rendered?.replace(/<[^>]*>/g, "") || "Untitled",
          image,
          slug: x.slug,
          date: moment(x.date),
        };
      });

    // Merge and dedupe
    const seen = new Set();
    const merged = [...recentDataArray, ...wpRecent]
      .filter((item) => item?.slug)
      .sort((a, b) => b.date.valueOf() - a.date.valueOf())
      .filter((item) => {
        if (seen.has(item.slug)) return false;
        seen.add(item.slug);
        return true;
      })
      .slice(0, 6);

    recentDataArray = merged.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      slug: r.slug,
      date: r.date.format("DD/MM/YYYY"),
    }));
  } catch (err) {
    console.warn("WP recent blogs fetch failed:", err.message);
  }

  if (!detail) {
    return {
      props: {
        allData: null,
      },
      revalidate: 30,
    };
  }

  return {
    props: {
      allData: {
        detail,
        related: relatedDataArray,
        recent: recentDataArray.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          slug: r.slug,
        })),
      },
    },
    revalidate: 10,
  };
}

export default BlogDetail;
