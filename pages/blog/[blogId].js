import React from "react";
import moment from "moment";

import Wrapper from "../../components/UI/Wrapper";
import PageHeader from "../../components/UI/blogPageHeader";
import BlogContent from "../../components/blogsSections/BlogContent";
import BlogsGrid from "../../components/UI/BlogGridIndividual";

const BlogDetail = ({ allData }) => {
  const { detail, recent, related, source } = allData;
  if (!detail) return <p>Something went wrong loading this post.</p>;

  const headerData = {
    title: detail.title,
    image: detail.image || "",
    date: detail.date,
    thumbnail: detail.thumbnail || "",
    imageAlt: detail.imageAlt || "Blog Image",
  };

  return (
    <Wrapper
      title={detail.metaTitle || headerData.title}
      description={detail.metaDescription || ""}
      image={headerData.image}
      keyword={detail.metaKeyword || ""}
    >
      <PageHeader classes="" date={headerData.date} data={headerData} />
      <BlogContent
        detailContent={detail}
        name={detail.name}
        recent={recent}
        popular={[]}
        data={headerData}
      />
      <BlogsGrid blogs={recent} section_title="Latest Blogs" button="hide" />
    </Wrapper>
  );
};

export default BlogDetail;

export async function getStaticPaths() {
  const paths = [];

  try {
    const res = await fetch(`${process.env.apiUrl}/blog/slugList?active=true&blogType=blogs`);
    const json = await res.json();
    json.result?.forEach(p => paths.push({ params: { blogId: p.slug } }));
  } catch (err) {
    console.warn("CMS slugs fetch failed:", err.message);
  }

  try {
    const wpRes = await fetch("https://cms.inframantra.com/wp-json/wp/v2/posts?_fields=slug&per_page=100");
    const wpArr = await wpRes.json();
    wpArr.forEach(p => paths.push({ params: { blogId: p.slug } }));
  } catch (err) {
    console.warn("WP slugs fetch failed:", err.message);
  }

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = params.blogId;

  // Try CMS first
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
      };

      const related = cms.result.reletedBlogs?.map(b => ({
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

      const cmsRecents = cmsRecentArr.map(e => ({
        id: e._id,
        title: e.name,
        image: e.file?.thumbnail || "",
        slug: e.slug,
        date: moment(e.createdAt).format("DD MMM YYYY"),
      }));

      const wpRecents = wpRecentArr.map(x => ({
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
            .map(item => [item.slug, item])
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
        revalidate: 10,
      };
    }
  } catch (err) {
    console.warn("CMS detail fetch error:", err.message);
  }

  // Try WordPress fallback
  try {
    const wpArr = await fetch(`https://cms.inframantra.com/wp-json/wp/v2/posts?slug=${slug}&_embed`).then(r => r.json());
    const post = Array.isArray(wpArr) && wpArr[0];
    if (post) {
      const media = post._embedded?.["wp:featuredmedia"]?.[0] || {};
      const yoast = post.yoast_head_json || {};

      const detail = {
        title: post.title?.rendered?.replace(/<[^>]*>/g, ""),
        description: post.content?.rendered.replace(/id="h-([^"]+)"/g, 'id="$1"')
  .replace(/href="#h-([^"]+)"/g, 'href="#$1"') || "",
        metaTitle: yoast.title || post.title.rendered,
        metaDescription: yoast.description || post.excerpt?.rendered,
        metaKeyword: post.meta?._yoast_wpseo_focuskw || "",
       image: yoast.og_image?.[0]?.url || media.source_url || "",
thumbnail: yoast.og_image?.[0]?.url || media.source_url || "",
        imageAlt: media.alt_text || "",
        date: moment(post.date).format("DD MMM YYYY"),
        name: post._embedded?.author?.[0]?.name || "",
      };

      const [cmsListRes, wpListRes] = await Promise.all([
        fetch(`${process.env.apiUrl}/blog/pageDetail?blogType=blogs&limit=8`),
        fetch("https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=8"),
      ]);

      const cmsRecentArr = (await cmsListRes.json()).result?.latestBlogList || [];
      const wpRecentArr = await wpListRes.json();

      const cmsRecents = cmsRecentArr.map(e => ({
        id: e._id,
        title: e.name,
        image: e.file?.thumbnail || "",
        slug: e.slug,
        date: moment(e.createdAt).format("DD MMM YYYY"),
      }));

      const wpRecents = wpRecentArr.map(x => ({
        id: x.id,
        title: x.title?.rendered?.replace(/<[^>]*>/g, "") || "",
       image: x.yoast_head_json?.og_image?.[0]?.url || x._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
        slug: x.slug,
        date: moment(x.date).format("DD MMM YYYY"),
      }));

      const merged = Array.from(
        new Map(
          [...cmsRecents, ...wpRecents]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(item => [item.slug, item])
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

  return { notFound: true };
}
