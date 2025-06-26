import React, { useState } from "react";
import Wrapper from "../components/UI/Wrapper";
import FeaturedBlogs from "../components/blogsSections/FeaturedBlogs";
import BlogsGrid from "../components/UI/BlogsGrid";
import moment from "moment/moment";
import Ajax from "../components/helper/Ajax";

function Blogs({ allData }) {
  const [pagination, setPagination] = useState(2); // Page 1 is already loaded
  const [posts, setPosts] = useState(allData?.latest || []);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreBlogs = async () => {
    setIsLoading(true);
    const newBlogs = await Ajax({
      url: `/blog/pageDetail?type=latest&limit=9&pagination=${pagination}`,
      loader: true
    });

    if (newBlogs?.data?.status === 'SUCCESS!') {
      setPagination(prev => prev + 1);
      setPosts(prev => [
        ...prev,
        ...(newBlogs?.data?.result?.latestBlogList || [])
      ]);
    }

    setIsLoading(false);
  };

  return (
    <Wrapper
      title={allData?.meta?.meta_title || "Blogs"}
      description={allData?.meta?.meta_description || ""}
    >
      <FeaturedBlogs
        blogs={allData?.featured || []}
        PRS={allData?.PRSLIST || []}
      />
      <BlogsGrid
        blogs={posts}
        section_title="| Blogs"
        latestNews={allData?.latestNews || []}
        trending={allData?.trending || []}
        loadMore={loadMoreBlogs}
        isLoading={isLoading}
      />
    </Wrapper>
  );
}

export async function getStaticProps() {
  const baseUrl = process.env.apiUrl;

  const [res, newsInfo, PR, articles, Blogs, blogTypes] = await Promise.all([
    fetch(`${baseUrl}/blog/pageDetail?limit=10`),
    fetch(`${baseUrl}/blog/pageDetail?blogType=news&limit=6`),
    fetch(`${baseUrl}/blog/pageDetail?blogType=PressRelease&limit=6`),
    fetch(`${baseUrl}/blog/pageDetail?blogType=article&limit=6`),
    fetch(`${baseUrl}/blog/pageDetail?blogType=blogs&limit=10`),
    fetch(`${baseUrl}/blog/blogType`)
  ]);

  const data = await res.json();
  const news = await newsInfo.json();
  const press = await PR.json();
  const article = await articles.json();
  const blogs = await Blogs.json();
  const blogTypeList = await blogTypes.json();

  const metaData = data?.result?.meta?.[0] || {};

  const meta = {
    bannerTitle: metaData?.title || "",
    meta_title: metaData?.meta_title || "",
    meta_description: metaData?.meta_description || "",
    bannerImage: metaData?.file?.path || ""
  };

  const featuredDataArray = data?.result?.featureBlogList?.map(f => ({
    id: f?._id || "",
    title: f?.name || "",
    date: moment(f?.createdAt).format('DD MMM, YYYY'),
    image: f?.file?.path || "",
    thumbnail: f?.file?.thumbnail || "",
    slug: f?.slug || ""
  })) || [];

  const latestDataArray = blogs?.result?.latestBlogList?.map(l => ({
    _id: l?._id || "",
    name: l?.name || "",
    createdAt: l?.createdAt || "",
    file: l?.file || {},
    slug: l?.slug || "",
    shortDescription: l?.shortDescription || "",
    writer_name: l?.writer_name || ""
  })) || [];

  const latestNewsData = news?.result?.latestBlogList?.map(e => ({
    id: e?._id || "",
    title: e?.name || "",
    image: e?.thumbnail || e?.file?.path || "",
    slug: e?.slug || "",
    createdAt: e?.createdAt || "",
    link: e?.link || "",
    writer_name: e?.writer_name || ""
  })) || [];

  const trending = article?.result?.latestBlogList?.map(e => ({
    id: e?._id || "",
    title: e?.name || "",
    image: e?.thumbnail || e?.file?.path || "",
    slug: e?.slug || "",
    createdAt: e?.createdAt || "",
    shortDescription: e?.shortDescription || "",
    link: e?.link || "",
    writer_name: e?.writer_name || ""
  })) || [];

  const PRSARRAY = press?.result?.latestBlogList?.map(f => ({
    id: f?._id || "",
    title: f?.name || "",
    date: moment(f?.createdAt).format('DD MMM, YYYY'),
    image: f?.file?.thumbnail || "",
    slug: f?.slug || ""
  })) || [];

  const blogDataArray = blogTypeList?.result?.map(l => ({
    _id: l?._id || "",
    name: l?.name || "",
    slug: l?.slug || ""
  })) || [];

  const allData = {
    meta,
    featured: featuredDataArray,
    latest: latestDataArray,
    blogType: blogDataArray,
    latestNews: latestNewsData,
    trending,
    PRSLIST: PRSARRAY
  };

  return {
    props: {
      allData
    },
    revalidate: 10
  };
}

export default Blogs;
