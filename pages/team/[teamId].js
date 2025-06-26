import React from 'react';
import Wrapper from '../../components/UI/Wrapper';
import TeamBanner from '../../components/TeamDetailsSections/TeamBanner';
import MemberTimeline from '../../components/TeamDetailsSections/MemberTimeline';
import ArticleSlider from '../../components/TeamDetailsSections/ArticleSlider';
import Section from '../../components/UI/Section';
import NoImage from '../../components/UI/NoImage';
import Image from 'next/image';
import Link from 'next/link';

const TeamDetail = ({ allData }) => {
    return (
        <Wrapper
            title={allData.heading.meta_title || 'Team Details'}
            description={allData.heading.meta_description || ''}
            keyword={allData.heading.meta_keywords || ''}
            image={allData.heading.image || '/default-image.jpg'}
        >
            <TeamBanner
                bg_img="/assets/images/team-detail_banner.jpg"
                member_image={allData.heading.image || '/default-image.jpg'}
                title={allData.heading.name || 'Team Member'}
                position={allData.heading.designation || 'Position'}
            />
            <MemberTimeline journey={allData.journey} content={allData.heading} />
            <div className="desk-show">
                <ArticleSlider heading={allData.blogHeading} articles={allData.articles} />
            </div>
            <div className="mob-show">
                <Section classes="featured-blogs sec-p pt-0" pageWidth="container">
                    <div className="section-head">
                        <h2>{allData.blogHeading.title || 'Related Blogs'}</h2>
                        {allData.blogHeading.description && <p>{allData.blogHeading.description}</p>}
                    </div>
                    <div className="f-blogs-wrap team-blogs">
                        {allData.articles.map((item) => (
                            <div key={`key-${item.id}`} className="f-blog-item">
                                <div className="img-wrap">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title || 'Blog Image'}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    ) : (
                                        <NoImage />
                                    )}
                                </div>
                                <div className="info">
                                    <h4>{item.title}</h4>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noreferrer" className="lrn-btn">
                                            Read More
                                            <svg
                                                width="13"
                                                height="12"
                                                viewBox="0 0 13 12"
                                                fill="none"
                                            >
                                                <path
                                                    d="M1.93896 6H11.9654"
                                                    stroke="#E7B554"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M6.95215 1L11.9653 6L6.95215 11"
                                                    stroke="#E7B554"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    ) : (
                                        <Link href={`/blog/${item.slug}`}>
                                            <a className="lrn-btn">
                                                Read More
                                                <svg
                                                    width="13"
                                                    height="12"
                                                    viewBox="0 0 13 12"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M1.93896 6H11.9654"
                                                        stroke="#E7B554"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6.95215 1L11.9653 6L6.95215 11"
                                                        stroke="#E7B554"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </a>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </Wrapper>
    );
};

export async function getStaticPaths() {
    const res = await fetch(`${process.env.apiUrl}/team/slugList`);
    const data = await res.json();
    // console.log('data',data)
    const paths = data.result.map((post) => ({
        params: { teamId: post.link },
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    try {
        const res = await fetch(`${process.env.apiUrl}/team/detail?link=${params.teamId}`);
        const data = await res.json();

        if (!data?.result) {
            throw new Error('Invalid data from API');
        }

        const heading = {
            name: data?.result?.detail?.[0]?.name || null,
            designation: data?.result?.detail?.[0]?.designation || null,
            description: data?.result?.detail?.[0]?.description || null,
            image: data?.result?.detail?.[0]?.file?.path || null,
            meta_title: data?.result?.detail?.[0]?.meta_title || null,
            meta_description: data?.result?.detail?.[0]?.meta_description || null,
            meta_keywords: data?.result?.detail?.[0]?.meta_keyword || null,
        };

        const blogHeading = {
            title: data?.result?.heading?.[0]?.title || null,
            description: data?.result?.heading?.[0]?.description || null,
        };

        const journeyDataArray = (data?.result?.journey || []).map((e) => ({
            id: e._id,
            title: e.year,
            description: e.description,
            ...(e.file && { image: e.file.path }),
        }));

        const articleDataArray = (data?.result?.BlogList || []).map((e) => ({
            id: e._id,
            title: e.name,
            ...(e.file && { image: e.file.path }),
            ...(e.link && { link: e.link }),
            ...(e.slug && { slug: e.slug }),
        }));

        const allData = {
            heading,
            journey: journeyDataArray,
            articles: articleDataArray,
            blogHeading,
        };

        return {
            props: {
                allData,
            },
            revalidate: 10,
        };
    } catch (error) {
        console.error('Error fetching team details:', error.message);
        return {
            notFound: true,
        };
    }
}

export default TeamDetail;
