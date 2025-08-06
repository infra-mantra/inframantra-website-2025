import React from 'react';
import Wrapper from "../../components/UI/Wrapper";
import PageHeader from '../../components/UI/PageHeaderNews';
import BlogContentNews from "../../components/blogsSections/BlogContentNews";
import moment from 'moment';
import style from './news.module.css';

const BlogDetail = ({ allData }) => {
  const data = {
    title: allData.detail.title,
    ...(allData.detail.image && { image: allData.detail.image }),
    date: allData.detail.date
  };

  return (
    <Wrapper
      title={allData.detail.metaTitle}
      description={allData.detail.metaDescription}
      image={allData.detail.image}
      keyword={allData.detail.metaKeyword}
    >
      <PageHeader classes="" date={data.date} data={data} />
      <BlogContentNews
        detailContent={allData.detail}
        name={allData.detail.name}
        recent={allData.recent}
        data="news"
        date={data.date}
      />
    </Wrapper>
  );
};

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl}/blog/slugList?active=true&blogType=news`);
  const data = await res.json();

  const paths = data.result.map((post) => ({
    params: { newsId: post.slug }
  }));

  return { paths, fallback: 'blocking' };
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
        name: d.writer_name
      };

      relatedDataArray = (data.result.reletedBlogs || []).map((e) => ({
        _id: e._id,
        name: e.name,
        ...(e.file && { file: e.file }),
        slug: e.slug
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
          name: post._embedded?.author?.[0]?.name || ""
        };
      }
    } catch (err) {
      console.warn("WP news detail fallback failed:", err.message);
    }
  }

  // RECENT BLOGS — CMS BLOGS ONLY
  try {
    const cmsList = await fetch(`${process.env.apiUrl}/blog/pageDetail?blogType=news&limit=10`)
      .then((r) => r.json());

    const cmsRecent = (cmsList?.result?.latestBlogList || [])
      .filter((e) => e.blogType === "637b1be32e436918909f97ce")
      .map((e) => ({
        id: e._id,
        title: e.name,
        image: e.file?.smallFile || "",
        slug: e.slug,
        date: moment(e.createdAt)
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
          date: moment(x.date)
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
      date: r.date.format("DD/MM/YYYY")
    }));
  } catch (err) {
    console.warn("WP recent blogs fetch failed:", err.message);
  }

  if (!detail) return { notFound: true };

  return {
    props: {
      allData: {
        detail,
        related: relatedDataArray,
        recent: recentDataArray.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          slug: r.slug
        }))
      }
    },
    revalidate: 10
  };
}

export default BlogDetail;
