/* pages/blog.js */

import React, { useState } from "react";
import Wrapper from "../components/shared/Wrapper.jsx";
import FeaturedBlogs from "../components/blog/FeaturedBlogs.jsx";
import BlogsGrid from "../components/shared/BlogsGrid.jsx";
import moment from "moment";
import Ajax from "../components/lib/ajax.js";
import he from "he";

/* ---------------- Date Fix ---------------- */

const normalizeDate = (date) => {
  if (!date) return 0;

  if (typeof date === "string" && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}`).getTime();
  }

  return new Date(date).getTime() || 0;
};

const sortByCreatedAt = (data = []) =>
  [...data].sort((a, b) => normalizeDate(b.createdAt) - normalizeDate(a.createdAt));

function Blogs({ allData }) {
  if (!allData) return null;

  const [pagination, setPagination] = useState(2);
  const [posts, setPosts] = useState(allData.latest || []);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreBlogs = async () => {
    setIsLoading(true);

    try {
      const [newBlogs, wpRes] = await Promise.all([
        Ajax({
          url: `/blog/pageDetail?type=latest&limit=9&pagination=${pagination}`,
          loader: true,
        }),
        fetch(
          `https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=9&page=${pagination}&orderby=date&order=desc`
        ),
      ]);

      const cmsBlogs =
        newBlogs?.data?.result?.latestBlogList?.map((blog) => ({
          ...blog,
          createdAt: normalizeDate(blog.createdAt),
        })) || [];

      let wpBlogs = [];

      if (wpRes.ok) {
        const wpRaw = await wpRes.json();

        wpBlogs = wpRaw.map((p) => {
          const media = p._embedded?.["wp:featuredmedia"]?.[0];
          const ogImage = p.yoast_head_json?.og_image?.[0]?.url || "";
          const img = media?.source_url || ogImage || "";

          const cat = p._embedded?.["wp:term"]?.[0]?.find((t) => t.taxonomy === "category") || {};

          return {
            _id: p.id,
            id: p.id,
            name: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
            title: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
            createdAt: normalizeDate(p.date),
            file: {
              path: img,
              thumbnail: img,
            },
            slug: p.slug,
            shortDescription: he.decode(p.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || ""),
            writer_name: p._embedded?.author?.[0]?.name || "",
            blogType: cat.slug || "blogs",
            link: `/blog/${p.slug}`,
          };
        });
      }

      const filteredWpBlogs = wpBlogs.filter((p) => p.blogType === "blogs");

      const mergedBlogs = sortByCreatedAt([...cmsBlogs, ...filteredWpBlogs]);

      if (newBlogs?.data?.status === "SUCCESS!") {
        setPagination((p) => p + 1);

        setPosts((prev) => {
          const combined = [...prev, ...mergedBlogs];

          const unique = combined.filter(
            (item, index, self) =>
              index === self.findIndex((b) => String(b.id || b._id) === String(item.id || item._id))
          );

          return sortByCreatedAt(unique);
        });
      }
    } catch (e) {
      console.warn("Load more blogs failed", e);
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

export async function getStaticProps() {
  const baseUrl = process.env.apiUrl;

  let wpPosts = [];

  try {
    const wpRes = await fetch(
      "https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=20&orderby=date&order=desc"
    );

    if (!wpRes.ok) throw new Error("WP failed");

    const wpRaw = await wpRes.json();

    wpPosts = wpRaw.map((p) => {
      const media = p._embedded?.["wp:featuredmedia"]?.[0];
      const ogImage = p.yoast_head_json?.og_image?.[0]?.url || "";
      const img = media?.source_url || ogImage || "";

      const cat = p._embedded?.["wp:term"]?.[0]?.find((t) => t.taxonomy === "category") || {};

      return {
        _id: p.id,
        id: p.id,
        name: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
        title: p.title?.rendered?.replace(/<[^>]*>/g, "").trim() || "",
        createdAt: normalizeDate(p.date),
        file: { path: img, thumbnail: img },
        slug: p.slug,
        shortDescription: he.decode(p.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || ""),
        writer_name: p._embedded?.author?.[0]?.name || "",
        blogType: cat.slug || "blogs",
        link: `/blog/${p.slug}`,
      };
    });
  } catch (e) {
    console.warn("WP fetch failed");
  }

  let data = null,
    newsJson = {},
    prJson = {},
    articleJson = {},
    blogJson = {},
    typeJson = {};

  try {
    const [res, newsInfo, PR, articles, Blogs, blogTypes] = await Promise.all([
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

  const featured =
    data?.result?.featureBlogList?.map((f) => ({
      id: f._id,
      title: f.name,
      date: moment(f.createdAt).format("DD MMM, YYYY"),
      image: f.file?.path || "",
      thumbnail: f.file?.thumbnail || "",
      slug: f.slug,
      createdAt: normalizeDate(f.createdAt),
    })) || [];

  const cmsPR =
    prJson?.result?.latestBlogList?.map((p) => ({
      ...p,
      id: p._id,
      title: p.name,
      date: moment(p.createdAt).format("DD MMM, YYYY"),
      image: p.file?.thumbnail || p.file?.path || "",
      slug: p.slug,

      link: p.link,
      writer_name: p.writer_name,
      createdAt: normalizeDate(p.createdAt),
    })) || [];

  const cmsNews =
    newsJson?.result?.latestBlogList?.map((e) => ({
      ...e,
      id: e._id,
      title: e.name,
      createdAt: normalizeDate(e.createdAt),
    })) || [];

  const cmsArticles =
    articleJson?.result?.latestBlogList?.map((e) => ({
      ...e,
      id: e._id,
      title: e.name,
      createdAt: normalizeDate(e.createdAt),
    })) || [];

  const cmsLatest =
    blogJson?.result?.latestBlogList?.map((e) => ({
      ...e,
      createdAt: normalizeDate(e.createdAt),
    })) || [];

  const PRSLIST = sortByCreatedAt([
    ...cmsPR,
    ...wpPosts.filter((p) => p.blogType?.toLowerCase() === "pr-media"),
  ]).slice(0, 6);

  const latestNews = sortByCreatedAt([
    ...cmsNews,
    ...wpPosts.filter((p) => p.blogType === "article"),
  ]);

  const trending = sortByCreatedAt([
    ...cmsArticles,
    ...wpPosts.filter((p) => p.blogType === "news"),
  ]);

  const latest = sortByCreatedAt([...cmsLatest, ...wpPosts.filter((p) => p.blogType === "blogs")]);

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
