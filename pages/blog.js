/*  pages/blog.js  */

import React, { useState } from "react";
import Wrapper from "../components/UI/Wrapper";
import FeaturedBlogs from "../components/blogsSections/FeaturedBlogs";
import BlogsGrid from "../components/UI/BlogsGrid";
import moment from "moment";
import Ajax from "../components/helper/Ajax";
import he from "he";

function Blogs({ allData }) {
  if (!allData) return null;

  const [pagination, setPagination] = useState(2);
  const [posts, setPosts] = useState(allData.latest || []);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreBlogs = async () => {
    setIsLoading(true);
    try {
      const newBlogs = await Ajax({
        url: `/blog/pageDetail?type=latest&limit=9&pagination=${pagination}`,
        loader: true,
      });

      if (newBlogs?.data?.status === "SUCCESS!") {
        setPagination((p) => p + 1);
        setPosts((prev) => [
          ...prev,
          ...(newBlogs?.data?.result?.latestBlogList || []),
        ]);
      }
    } catch (e) {
      console.warn("Load more blogs failed");
    }
    setIsLoading(false);
  };

  return (
    <Wrapper
      title={allData?.meta?.meta_title || ""}
      description={allData?.meta?.meta_description || ""}
    >
      <FeaturedBlogs blogs={allData.featured || []} PRS={allData.PRSLIST || []} />
      <BlogsGrid
        blogs={posts}
        section_title="| Blogs"
        latestNews={allData.latestNews || []}
        trending={allData.trending || []}
        loadMore={loadMoreBlogs}
        isLoading={isLoading}
      />
    </Wrapper>
  );
}

export default Blogs;

/* ------------------------------------------------------------------ */
/*  Static data — CMS + WordPress merge                               */
/* ------------------------------------------------------------------ */

export async function getStaticProps() {
  const baseUrl = process.env.apiUrl;

  /* ---------------- WordPress ---------------- */
  let wpPosts = [];
  try {
    const wpRes = await fetch(
      "https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=20"
    );
    if (!wpRes.ok) throw new Error("WP failed");
    const wpRaw = await wpRes.json();

    wpPosts = wpRaw.map((p) => {
      const media = p._embedded?.["wp:featuredmedia"]?.[0];
      const ogImage = p.yoast_head_json?.og_image?.[0]?.url || "";
      const img = media?.source_url || ogImage || "";

      const cat =
        p._embedded?.["wp:term"]?.[0]?.find(
          (t) => t.taxonomy === "category"
        ) || {};

      return {
        _id: p.id,
        id: p.id,
        name: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
        title: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
        createdAt: p.date,
        file: { path: img, thumbnail: img },
        slug: p.slug,
        shortDescription: he.decode(
          p.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || ""
        ),
        writer_name: p._embedded?.author?.[0]?.name || "",
        blogType: cat.slug || "blogs",
        link: `/blog/${p.slug}`,
      };
    });
  } catch (e) {
    console.warn("WP fetch failed");
  }

  /* ---------------- CMS fetches ---------------- */
  let data = null,
    newsJson = {},
    prJson = {},
    articleJson = {},
    blogJson = {},
    typeJson = {};

  try {
    const [
      res,
      newsInfo,
      PR,
      articles,
      Blogs,
      blogTypes,
    ] = await Promise.all([
      fetch(`${baseUrl}/blog/pageDetail?limit=10`),
      fetch(`${baseUrl}/blog/pageDetail?blogType=news&limit=6`),
      fetch(`${baseUrl}/blog/pageDetail?blogType=PressRelease&limit=6`),
      fetch(`${baseUrl}/blog/pageDetail?blogType=article&limit=6`),
      fetch(`${baseUrl}/blog/pageDetail?blogType=blogs&limit=10`),
      fetch(`${baseUrl}/blog/blogType`),
    ]);

    data = await res.json();
    newsJson = await newsInfo.json();
    prJson = await PR.json();
    articleJson = await articles.json();
    blogJson = await Blogs.json();
    typeJson = await blogTypes.json();
  } catch (e) {
    console.warn("CMS fetch failed");
  }

  /* ---------------- Featured ---------------- */
  const featured =
    data?.result?.featureBlogList?.map((f) => ({
      id: f._id,
      title: f.name,
      date: moment(f.createdAt).format("DD MMM, YYYY"),
      image: f.file?.path || "",
      thumbnail: f.file?.thumbnail || "",
      slug: f.slug,
    })) || [];

  /* ---------------- PR ---------------- */
  const cmsPR =
    prJson?.result?.latestBlogList?.map((p) => ({
      id: p._id,
      title: p.name,
      date: moment(p.createdAt).format("DD MMM, YYYY"),
      image: p.file?.thumbnail || p.file?.path || "",
      slug: p.slug,
      createdAt: p.createdAt,
      link: p.link,
      writer_name: p.writer_name,
    })) || [];

  const wpPR = wpPosts.filter(
    (p) => p.blogType?.toLowerCase() === "pr-media"
  ) .map((p) => ({
    id   : p.id,
    title: p.title,
    date : moment(p.createdAt).format("DD MMM, YYYY"),
    image: p.file?.thumbnail || p.file?.path || "",
    slug : p.slug,
    createdAt: p.createdAt,
    link : p.link,
    writer_name: p.writer_name,
  }));


  const PRSLIST = [...cmsPR, ...wpPR]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  /* ---------------- News ---------------- */
  const cmsNews =
    newsJson?.result?.latestBlogList?.map((e) => ({
      id: e._id,
      title: e.name,
      image: e.file?.thumbnail || "",
      slug: e.slug,
      createdAt: e.createdAt,
      link: e.link,
      writer_name: e.writer_name,
    })) || [];

  const latestNews = [...cmsNews, ...wpPosts.filter((p) => p.blogType === "article")]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* ---------------- Trending ---------------- */
  const cmsArticles =
    articleJson?.result?.latestBlogList?.map((e) => ({
      id: e._id,
      title: e.name,
      image: e.file?.path || "",
      slug: e.slug,
      createdAt: e.createdAt,
      shortDescription: e.shortDescription,
      link: e.link,
      writer_name: e.writer_name,
    })) || [];

  const trending = [...cmsArticles, ...wpPosts.filter((p) => p.blogType === "news")]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* ---------------- Latest Blogs ---------------- */
  const cmsLatest =
    blogJson?.result?.latestBlogList || [];

  const latest = [...cmsLatest, ...wpPosts.filter((p) => p.blogType === "blogs")]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* ---------------- Meta ---------------- */
  const metaSource = data?.result?.meta?.[0] || {};
  const meta = {
    bannerTitle: metaSource.title || "",
    meta_title: metaSource.meta_title || "",
    meta_description: metaSource.meta_description || "",
    bannerImage: metaSource?.file?.path || "",
  };

  const blogType =
    typeJson?.result?.map((t) => ({
      _id: t._id,
      name: t.name,
      slug: t.slug,
    })) || [];

  return {
    props: {
      allData: {
        meta,
        featured,
        latest,
        blogType,
        latestNews,
        trending,
        PRSLIST,
      },
    },
    revalidate: 60,
  };
}
