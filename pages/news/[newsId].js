import React from 'react'
import Wrapper from "../../components/UI/Wrapper"
// import PageHeader from "../../components/UI/blogPageHeader"
import PageHeader from '../../components/UI/PageHeaderNews'
import BlogContentNews from "../../components/blogsSections/BlogContentNews"
import moment from 'moment/moment'
import styles from './news.module.css'
const BlogDetail = ({allData}) => {
    const data = {
        title: allData.detail.title,
        ...(allData.detail.image &&{image: allData.detail.image}),
        date: allData.detail.date   
    }
    return (
        <Wrapper title={allData.detail.metaTitle} description={allData.detail.metaDescription} image={allData.detail.image} keyword={allData.detail.metaKeyword}>
            <PageHeader classes="" date={data.date} data={data}/>
            <BlogContentNews detailContent={allData.detail} name={allData.detail.name}  recent={allData.recent}  data='news' date={data.date} />
            {/* <BlogsGrid blogs={allData.related}   section_title="Latest Blogs" button='hide' /> */}
        </Wrapper>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${process.env.apiUrl}/blog/slugList?active=true&blogType=news`)
    const data = await res.json()
    
    const paths = data.result.map((post) => ({
        params: { newsId: post.slug },
    })) 
    return { paths, fallback: 'blocking' }
}
export async function getStaticProps({ params }) {
    // const news='news'
    const res = await fetch(`${process.env.apiUrl}/blog/pageDetail?slug=${params.newsId}`)
    
    
    const data = await res.json()

    const detail = {    
        "title": data?.result?.detail[0].name,
        "description": data?.result?.detail[0].description,
        "metaTitle": data?.result?.detail[0]?.metaTitle,
        "metaDescription": data.result.detail[0].metaDescription,
        "metaKeyword": data.result.detail[0].metaKeyword,
        ...(data.result.detail[0].file && {"image": data.result.detail[0].file.path}),
        "date": moment(data.result.detail[0].createdAt).format('DD/MM/YYYY'),
        "name" : data.result.detail[0].writer_name,
    }
    
    const relatedData = data.result.reletedBlogs
    const relatedDataArray = []
    relatedData.forEach(function(e){
        relatedDataArray.push({
        "_id": e._id,
        "name": e.name,
        ...(e.file && {"file": e.file}),
        "slug": e.slug
        })
    })

    const recentData = data.result.recentBlogs
    const recentDataArray = []
    recentData.forEach(function(e){
        recentDataArray.push({
        "id": e._id,
        "title": e.name,
        "image":(e.file ? e.file.smallFile : ""),
        "slug": e.slug
        })
    })

   
    const allData = {
        "detail": detail,
        "related": relatedDataArray,
        "recent": recentDataArray,
       
    }
    return {
      props: {
        allData,
      },
      revalidate: 10,
    }
}

export default BlogDetail