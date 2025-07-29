import React,{useState} from "react";
import Section from "../UI/Section";
import Image from "next/image";
import Link from "next/link";
import NoImage from "./NoImage";
import styles from './blogGridIndividual.module.css'

function BlogsGrid({ section_title, title_desc, blogs, button, initial, loadMore, blogBtn, latestNews }) {

    const displayedBlogs = blogs
    

    return (
        <Section classes="sec-p pt-0" pageWidth="container">
            <div className={styles.sectionHead}>
                <h2>{section_title}</h2>
                {title_desc && <p>{title_desc}</p>}
            </div>
                <div className={styles.inFBlogsWrap}>
                    {displayedBlogs.map((item) => (
                        <Link
                            key={item._id}
                            href={item.link || `/blog/${item.slug}`}
                            passHref
                        >
                            <a target={item.link ? "_blank" : "_self"} rel={item.link ? "noreferrer" : ""}>
                                <div className={styles.inFBlogItem}>
                                    <div className={styles.imgWrap}>
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
                                    <div className={styles.info}>
                                        <h4>{item.name}</h4>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
      
        </Section>
    );
}

export default BlogsGrid;
