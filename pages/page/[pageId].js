import React from 'react'
import Wrapper from '../../components/UI/Wrapper'
import Section from '../../components/UI/Section'

const DetailPage = ({allData}) => {
  return (
    <Wrapper title={allData.detail.metaTitle} description={allData.detail.metaDescription} >
        <Section classes="content-page-header" pageWidth="container">
            <h1>{allData.detail.title}</h1>
        </Section>
        <Section classes="content-page-body" pageWidth="container">
            <div className="content" dangerouslySetInnerHTML={{ __html: allData.detail.description}} >
            </div>
        </Section>
    </Wrapper>
  )
}

export async function getStaticPaths() {
  try{
    const res = await fetch(`${process.env.apiUrl}/pages/pageDetail`)
    const data = await res.json()
    const paths = data.result.map((post) => ({
        params: { pageId: post.slug },
    }))
    return { paths, fallback: 'blocking' }
  }catch(err){
    console.log("Error fetching page paths", err)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
 
}
export async function getStaticProps({ params }) {
  try{
    const res = await fetch(`${process.env.apiUrl}/pages/pageDetail?slug=${params.pageId}`)
    const data = await res.json()

    const detail = {
        "title": data.result[0].title,
        "description": data.result[0].description,
        "metaTitle": data.result[0].meta_title,
        "metaDescription": data.result[0].meta_description,
    }

    const allData = {
        "detail": detail,
    }
    return {
      props: {
        allData,
      },
      revalidate: 10,
    }
  }catch(err){
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}

export default DetailPage
