import React from 'react';
import Wrapper from "../../components/UI/Wrapper";
import PageHeader from "../../components/UI/blogPageHeader";
import BlogContent from "../../components/blogsSections/BlogContent";
import BlogsGrid from "../../components/UI/BlogGridIndividual";
import moment from 'moment';

const BlogDetail = ({ allData }) => {
  const data = {
    title: allData?.detail?.title || "Untitled Blog",
    ...(allData?.detail?.image ? { image: allData.detail.image } : {}),
    date: allData?.detail?.date || "Unknown Date",
    thumbnail: allData?.detail?.thumbnail || "",
  };

  return (
    <Wrapper
      title={allData?.detail?.metaTitle || "Blog"}
      description={allData?.detail?.metaDescription || "Blog description"}
      image={allData?.detail?.image || ""}
      keyword={allData?.detail?.metaKeyword || ""}
    >
      <PageHeader classes="" date={data.date} data={data} />
      <BlogContent
        detailContent={allData?.detail || {}}
        name={allData?.detail?.name || ""}
        recent={allData?.recent || []}
        popular={allData?.category || []}
        data={data}
        date={data.date}
      />
      <BlogsGrid blogs={allData?.related || []} section_title="Latest Blogs" button="hide" />
    </Wrapper>
  );
};

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.apiUrl}/blog/slugList?active=true&&blogType=blogs`);
    const data = await res.json();

    const paths = data?.result?.map((post) => ({
      params: { blogId: post?.slug || "" },
    })) || [];

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error("Error fetching blog slugs:", error.message);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${process.env.apiUrl}/blog/pageDetail?slug=${params.blogId}`);
    const data = await res.json();

    const blog = data?.result?.detail?.[0];

    if (!blog) return { notFound: true };

    const detail = {
      title: blog?.name || "Untitled Blog",
      description: blog?.description || "No description",
      metaTitle: blog?.metaTitle || "",
      metaDescription: blog?.metaDescription || "",
      metaKeyword: blog?.metaKeyword || "",
      image: blog?.file?.path || "",
      thumbnail: blog?.file?.thumbnail || "",
      date: moment(blog?.createdAt).format('DD/MM/YYYY') || "Unknown Date",
      name: blog?.writer_name || "Anonymous",
    };

    const relatedDataArray = data?.result?.reletedBlogs?.map((e) => ({
      _id: e?._id || "",
      name: e?.name || "",
      image: e?.file?.thumbnail || "",
      slug: e?.slug || "",
    })) || [];

    const recentDataArray = data?.result?.recentBlogs?.map((e) => ({
      id: e?._id || "",
      title: e?.name || "",
      image: e?.file?.smallFile || "",
      slug: e?.slug || "",
    })) || [];

    const allData = {
      detail,
      related: relatedDataArray,
      recent: recentDataArray,
      category: data?.result?.popularBlogs || [], // fallback included here if needed
    };

    return {
      props: {
        allData,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching blog details:", error.message);
    return { notFound: true };
  }
}

export default BlogDetail;
