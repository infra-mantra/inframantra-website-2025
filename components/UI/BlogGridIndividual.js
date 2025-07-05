import React,{useState} from "react";
import Section from "../UI/Section";
import Image from "next/image";
import Link from "next/link";
import NoImage from "./NoImage";

function BlogsGrid({ section_title, title_desc, blogs, button, initial, loadMore, blogBtn, latestNews }) {

    const displayedBlogs = blogs
    

    return (
        <Section classes="featured-blogs sec-p pt-0" pageWidth="container">
            <div className="section-head">
                <h2>{section_title}</h2>
                {title_desc && <p>{title_desc}</p>}
            </div>
                <div className="in-f-blogs-wrap">
                    {displayedBlogs.map((item) => (
                        <Link
                            key={item._id}
                            href={item.link || `/blog/${item.slug}`}
                            passHref
                        >
                            <a target={item.link ? "_blank" : "_self"} rel={item.link ? "noreferrer" : ""}>
                                <div className="in-f-blog-item">
                                    <div className="img-wrap">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.image}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <NoImage />
                                        )}
                                    </div>
                                    <div className="info">
                                        <h4>{item.name}</h4>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
            {button !== "hide" && blogs && blogs.length === 2 && (
                <div className="btn-wrap text-center mt-5">
                    <button type="button" className="theme-btn" onClick={loadMore}>
                        Load More
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                        >
                            <path
                                d="M1 6H11"
                                stroke="#E7B554"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 1L11 6L6 11"
                                stroke="#E7B554"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            )}
       
        </Section>
    );
}

export default BlogsGrid;
