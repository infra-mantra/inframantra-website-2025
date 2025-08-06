/*  pages/blog.js  */

import React, { useState } from "react";
import Wrapper        from "../components/UI/Wrapper";
import FeaturedBlogs  from "../components/blogsSections/FeaturedBlogs";
import BlogsGrid      from "../components/UI/BlogsGrid";
import moment         from "moment";
import Ajax           from "../components/helper/Ajax";
import he             from "he";

function Blogs({ allData }) {
  const [pagination, setPagination] = useState(2); // first page is pre‑loaded
  const [posts, setPosts]           = useState(allData.latest);
  const [isLoading, setIsLoading]   = useState(false);

  const loadMoreBlogs = async () => {
    setIsLoading(true);
    const newBlogs = await Ajax({
      url: `/blog/pageDetail?type=latest&limit=9&pagination=${pagination}`,
      loader: true,
    });
    if (newBlogs.data.status === "SUCCESS!") {
      setPagination(pagination + 1);
      setPosts((prev) => [...prev, ...newBlogs.data.result.latestBlogList]);
    }
    setIsLoading(false);
  };

  return (
    <Wrapper title={allData.meta.meta_title} description={allData.meta.meta_description}>
      <FeaturedBlogs blogs={allData.featured} PRS={allData.PRSLIST} />
      <BlogsGrid
        blogs={posts}
        section_title="| Blogs"
        latestNews={allData.latestNews}
        trending={allData.trending}
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

  /* 1️⃣  WordPress fetch (safe) ----------------------------------- */
  let wpPosts = [];
  try {
    const wpRes = await fetch(
      "https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=20",
      { next: { revalidate: 60 } }                       // optional: ISR cache hint
    );
    if (!wpRes.ok) throw new Error("WP API " + wpRes.status);
    const wpRaw = await wpRes.json();

    wpPosts = wpRaw.map((p) => {
      const media = p._embedded?.["wp:featuredmedia"]?.[0];
      const ogImage = p.yoast_head_json?.og_image?.[0]?.url || "";
      const img   = media?.source_url || ogImage ||"";
     
      const cat   =
        p._embedded?.["wp:term"]?.[0]?.find((t) => t.taxonomy === "category") ||
        {};

      return {
        _id   : p.id,
        id    : p.id,
        name  : p.title.rendered.replace(/<[^>]*>/g, "").trim(),
        title : p.title.rendered.replace(/<[^>]*>/g, "").trim(),
        createdAt: p.date,
        file  : { path: img, thumbnail: img },
        slug  : p.slug,
        shortDescription: he.decode(p.excerpt?.rendered.replace(/<[^>]*>/g, "").trim()),
        writer_name: p._embedded?.author?.[0]?.name || "",
        blogType   : cat.slug || "blogs",          // default to 'blogs'
        link       : `/blog/${p.slug}`,
      };
    });
  } catch (err) {
    console.warn("⚠️ WordPress fetch failed:", err.message);
    wpPosts = []; // fallback = no WP posts; site still builds
  }

  /* 2️⃣  CMS fetches ---------------------------------------------- */
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

  const data = await res.json();

  /* ---------- Featured (CMS only) ---------- */
  const featured = data.result.featureBlogList.map((f) => ({
    id       : f._id,
    title    : f.name,
    date     : moment(f.createdAt).format("DD MMM, YYYY"),
    image    : f.file?.path,
    thumbnail: f.file?.thumbnail,
    slug     : f.slug,
  }));


 /* ---------- PR list (CMS + WP category: PR Media) ---------- */
const cmsPR = (await PR.json()).result.latestBlogList.map((p) => ({
  id   : p._id,
  title: p.name,
  date : moment(p.createdAt).format("DD MMM, YYYY"),
  image: p.file?.thumbnail || p.file?.path || "",
  slug : p.slug,
  createdAt: p.createdAt,
  link : p.link,
  writer_name: p.writer_name,
}));

const wpPR = wpPosts
  .filter((p) => p.blogType?.toLowerCase() === "pr-media")
  .map((p) => ({
    id   : p.id,
    title: p.title,
    date : moment(p.createdAt).format("DD MMM, YYYY"),
    image: p.file?.thumbnail || p.file?.path || "",
    slug : p.slug,
    createdAt: p.createdAt,
    link : p.link,
    writer_name: p.writer_name,
  }));

const PRSARRAY = [...cmsPR, ...wpPR]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 6);


  /* ---------- Latest NEWS (CMS + WP) ---------- */
  const cmsNews = (await newsInfo.json()).result.latestBlogList.map((e) => ({
    id   : e._id,
    title: e.name,
    image: e.file?.thumbnail || "",
    slug : e.slug,
    createdAt: e.createdAt,
    link : e.link,
    writer_name: e.writer_name,
  }));
  const wpNews   = wpPosts.filter((p) => p.blogType === "article");
  const latestNews = [...cmsNews, ...wpNews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  /* ---------- Trending (articles) ---------- */
  const cmsArticles = (await articles.json()).result.latestBlogList.map((e) => ({
    id   : e._id,
    title: e.name,
    image: e.thumbnail || e.file?.path || "",
    slug : e.slug,
    createdAt: e.createdAt,
    shortDescription: e.shortDescription,
    link : e.link,
    writer_name: e.writer_name,
  }));
  const wpArticles = wpPosts.filter((p) => p.blogType === "news");
  const trending   = [...cmsArticles, ...wpArticles].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  /* ---------- Latest BLOGS (blogs) ---------- */
  const cmsLatest = (await Blogs.json()).result.latestBlogList.map((l) => ({
    _id   : l._id,
    name  : l.name,
    createdAt: l.createdAt,
    file  : l.file,
    slug  : l.slug,
    shortDescription: l.shortDescription,
    writer_name: l.writer_name,
  }));
  const wpBlogs = wpPosts.filter((p) => p.blogType === "blogs");
  const latest  = [...cmsLatest, ...wpBlogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  /* ---------- Misc meta ---------- */
  const meta = {
    bannerTitle     : data.result.meta[0].title,
    meta_title      : data.result.meta[0].meta_title,
    meta_description: data.result.meta[0].meta_description,
    bannerImage     : data.result.meta[0].file.path,
  };

  const blogTypeList = (await blogTypes.json()).result.map((t) => ({
    _id : t._id,
    name: t.name,
    slug: t.slug,
  }));

  /* ---------- Final Props ---------- */
  const allData = {
    meta,
    featured,
    latest,
    blogType : blogTypeList,
    latestNews,
    trending,
    PRSLIST : PRSARRAY,
  };

  return {
    props: { allData },
    revalidate: 60,           // ISR – rebuild at most every 60 s
  };
}
