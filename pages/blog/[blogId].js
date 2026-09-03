import React, { useState, useEffect } from "react";
import moment from "moment";

import { useRouter } from "next/router";

import Wrapper from "../../components/shared/Wrapper.jsx";
import PageHeader from "../../components/shared/BlogPageHeader.jsx";
import BlogContent from "../../components/blog/BlogContent.jsx";
import HomePageCta from "../../components/shared/forms/SinglePropertyCta.jsx";
import ArticleSchema from "../../components/shared/ArticleSchema.jsx";

const BlogDetail = ({ allData }) => {
  // getStaticProps deliberately returns `allData: null` as a soft fallback when
  // the CMS fetch fails (rather than notFound), so this has to tolerate null —
  // destructuring it directly threw "Cannot destructure property 'detail' of
  // 'allData' as it is null" and failed the whole `next build`.
  const { detail, recent, related, source } = allData || {};
  const router = useRouter();

  const { id, blogType, slug } = detail || {};

  const [popForm, setPopForm] = useState(false);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const onClickOff = (val) => setPopForm(val);
  const handleform = () => setPopForm(true);

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!detail) return;

    let destination = null;

    if (blogType) {
      if (blogType === "News") {
        destination = `/news/${slug}`;
      } else if (blogType === "Infra Times") {
        destination = `/pr/${slug}`;
      } else if (blogType === "Blogs") {
        destination = null;
      }
    }

    if (!destination && id) {
      const categoryId = Number(id);

      if (categoryId === 5) {
        destination = `/news/${slug}`;
      } else if (categoryId === 12) {
        destination = `/pr/${slug}`;
      } else if (categoryId === 3 || categoryId === 4) {
        destination = null;
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

  // Same soft fallback when the CMS returned nothing at all: show the loader
  // rather than reading .title off an undefined `detail`. ISR (revalidate: 30)
  // retries the fetch, so a transient CMS failure resolves on a later request.
  if (!detail) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="loader-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const headerData = {
    title: detail.title,
    image: detail.image || "",
    date: detail.date,
    thumbnail: detail.thumbnail || "",
    imageAlt: detail.imageAlt || "Blog Image",
  };

  return (
    !redirecting && (
      <Wrapper
        title={detail.metaTitle || headerData.title}
        description={detail.metaDescription || ""}
        image={headerData.image}
        keyword={detail.metaKeyword || ""}
      >
        <ArticleSchema detail={detail} type="BlogPosting" path={`/blog/${slug}`} />
        <PageHeader classes="" date={headerData.date} data={headerData} />
        <BlogContent
          detailContent={detail}
          name={detail.name}
          recent={recent}
          popular={[]}
          data={headerData}
          slug={slug}
        />
      </Wrapper>
    )
  );
};

export default BlogDetail;

// Nothing is prerendered at build time. This route sets a short `revalidate`,
// so any page built during `next build` is stale within seconds and gets
// regenerated on demand anyway — prerendering all ~145 of them (plus the slug-list
// fetches) only made the build slower without changing steady-state behaviour.
// `fallback: "blocking"` means the first request for a slug renders on the server
// and is cached from then on, which is what happened after the revalidate window
// regardless.
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = params.blogId;

  // ---------------- CMS Fetch ----------------
  try {
    const res = await fetch(`${process.env.apiUrl}/blog/pageDetail?slug=${slug}`);

    const cms = await res.json();
    const d = cms?.result?.detail?.[0];

    if (d) {
      const detail = {
        title: d.name,
        description: d.description,
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        metaKeyword: d.metaKeyword,
        image: d.file?.path || "",
        thumbnail: d.file?.thumbnail || "",
        imageAlt: d.imageAlt || "Blog Image",
        date: moment(d.createdAt).format("DD MMM YYYY"),
        name: d.writer_name,
        blogType: d.blogType?.name,
        slug: d.slug,
      };

      const related =
        cms.result.reletedBlogs?.map((b) => ({
          _id: b._id,
          name: b.name,
          image: b.file?.thumbnail || "",
          slug: b.slug,
        })) || [];

      const [cmsListRes, wpListRes] = await Promise.all([
        fetch(`${process.env.apiUrl}/blog/pageDetail?blogType=blogs&limit=8`),
        fetch("https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=8"),
      ]);

      const cmsRecentArr = (await cmsListRes.json()).result?.latestBlogList || [];
      const wpRecentArr = await wpListRes.json();

      const cmsRecents = cmsRecentArr.map((e) => ({
        id: e._id,
        title: e.name,
        image: e.file?.path || e.file?.thumbnail || "",
        slug: e.slug,
        date: moment(e.createdAt).format("DD MMM YYYY"),
      }));

      const wpRecents = wpRecentArr.map((x) => ({
        id: x.id,
        title: x.title?.rendered?.replace(/<[^>]*>/g, "") || "",
        image: x._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
        slug: x.slug,
        date: moment(x.date).format("DD MMM YYYY"),
      }));

      const merged = Array.from(
        new Map(
          [...cmsRecents, ...wpRecents]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => [item.slug, item])
        ).values()
      );

      return {
        props: {
          allData: {
            detail,
            recent: merged.slice(0, 4),
            related,
            source: "cms",
          },
        },
        revalidate: 60,
      };
    }
  } catch (err) {
    console.warn("CMS detail fetch error:", err.message);
  }

  // ---------------- WordPress Fallback ----------------
  try {
    const wpArr = await fetch(
      `https://cms.inframantra.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
    ).then((r) => r.json());
    const post = Array.isArray(wpArr) && wpArr[0];

    const id = wpArr[0].categories[0];

    if (post) {
      const media = post._embedded?.["wp:featuredmedia"]?.[0] || {};
      const yoast = post.yoast_head_json || {};

      const detail = {
        title: post.title?.rendered?.replace(/<[^>]*>/g, ""),
        description:
          post.content?.rendered
            .replace(/id="h-([^"]+)"/g, 'id="$1"')
            .replace(/href="#h-([^"]+)"/g, 'href="#$1"') || "",
        metaTitle: yoast.title || post.title.rendered,
        metaDescription: yoast.description || post.excerpt?.rendered,
        metaKeyword: post.meta?._yoast_wpseo_focuskw || "",
        image: yoast.og_image?.[0]?.url || media.source_url || "",
        thumbnail: yoast.og_image?.[0]?.url || media.source_url || "",
        imageAlt: media.alt_text || "",
        date: moment(post.date).format("DD MMM YYYY"),
        name: post._embedded?.author?.[0]?.name || "",
        id: wpArr[0].categories[0],
        slug: post.slug,
      };

      const [cmsListRes, wpListRes] = await Promise.all([
        fetch(`${process.env.apiUrl}/blog/pageDetail?blogType=blogs&limit=8`),
        fetch("https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=8"),
      ]);

      const cmsRecentArr = (await cmsListRes.json()).result?.latestBlogList || [];
      const wpRecentArr = await wpListRes.json();

      const cmsRecents = cmsRecentArr.map((e) => ({
        id: e._id,
        title: e.name,
        image: e.file?.path || e.file?.thumbnail || "",
        slug: e.slug,
        date: moment(e.createdAt).format("DD MMM YYYY"),
      }));

      const wpRecents = wpRecentArr.map((x) => ({
        id: x.id,
        title: x.title?.rendered?.replace(/<[^>]*>/g, "") || "",
        image:
          x.yoast_head_json?.og_image?.[0]?.url ||
          x._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          "",
        slug: x.slug,
        date: moment(x.date).format("DD MMM YYYY"),
      }));

      const merged = Array.from(
        new Map(
          [...cmsRecents, ...wpRecents]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => [item.slug, item])
        ).values()
      );

      return {
        props: {
          allData: {
            detail,
            recent: merged.slice(0, 4),
            related: [],
            source: "wordpress",
          },
        },
        revalidate: 10,
      };
    }
  } catch (err) {
    console.warn("WP detail fetch error:", err.message);
  }

  // ---------------- Soft Fallback ----------------
  return {
    props: {
      allData: null, // <-- no poisoning with notFound:true
    },
    revalidate: 30,
  };
}
