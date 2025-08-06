import React, { useState } from 'react';
import Wrapper from '../../components/UI/Wrapper';
import Share from '../share';
import moment from 'moment';
import BottomBar from "../../components/UI/Bottombar";
import useMediaQuery from '../../utils/useMediaQuery';
import styles from './media.module.css';

function News({ allData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const isDesktop = useMediaQuery(768);

  const filteredPosts = allData?.recent?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Wrapper 
    title={allData?.detail?.metaTitle || ''}
    description={allData?.detail?.metaDescription || ''} 
    image={allData?.detail?.image || null} 
    keyword={allData?.detail?.metaKeyword || ''}
    >
      <div className={styles['media-container-individual']}>
        {/* Search Section */}
        <div className={styles['search-section']}>
          <h2>Search Articles</h2>
          <div className={styles['search-bar']}>
            <span className={styles['search-icon']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 16" fill="none">
                <path
                  d="M17.5694 15.3887L10.7485 9.73773C10.2038 10.1222 9.57753 10.4197 8.86951 10.6302C8.1615 10.8408 7.44986 10.9461 6.73458 10.9461C4.99032 10.9461 3.51402 10.4458 2.30568 9.44534C1.09734 8.44486 0.493164 7.22208 0.493164 5.77701C0.493164 4.33194 1.09661 3.10856 2.3035 2.10687C3.51039 1.10519 4.98597 0.603744 6.73022 0.602541C8.47448 0.601338 9.95151 1.10188 11.1613 2.10417C12.3711 3.10645 12.976 4.32983 12.976 5.7743C12.976 6.40118 12.842 7.00791 12.5741 7.59448C12.3061 8.18105 11.9539 8.6828 11.5175 9.09972L18.3384 14.7498L17.5694 15.3887ZM6.73567 10.0427C8.18074 10.0427 9.40071 9.63064 10.3956 8.80643C11.3904 7.98222 11.8878 6.97121 11.8878 5.7734C11.8878 4.57559 11.3904 3.56488 10.3956 2.74127C9.40071 1.91767 8.18074 1.50556 6.73567 1.50496C5.29059 1.50436 4.07027 1.91646 3.07469 2.74127C2.07912 3.56608 1.58169 4.57679 1.58242 5.7734C1.58314 6.97001 2.08057 7.98072 3.07469 8.80553C4.06882 9.63034 5.28878 10.0424 6.73458 10.0418"
                  fill="#E4A951"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for your"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className={styles['search-button']}>Search</button>
          </div>
        </div>

        <div className={styles['media-page']}>
          {/* Content Section */}
          <div className={styles['media-content']}>
            {allData?.isCMSPost && !isDesktop && (
              <div className={styles['media-image-placeholder']}>
                <img src={allData?.detail?.image} alt={allData?.detail?.title || 'Media Image'} />
              </div>
            )}

            <h2>{allData?.detail?.title}</h2>

            {allData?.isCMSPost && isDesktop && (
              <div className={styles['media-image-placeholder']}>
                <img src={allData?.detail?.image} alt={allData?.detail?.title || 'Media Image'} />
              </div>
            )}

            <div
              className="content-media"
              dangerouslySetInnerHTML={{ __html: allData?.detail?.description || '' }}
            ></div> 
            <div>
            {isDesktop && <Share content={allData?.detail?.title || ''} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles['media-sidebar']}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className={styles['media-sidebar-item']}>
                  {post.image && <img src={post.image} alt={post.title} className={styles['media-sidebar-img']} />}
                  <div className={styles['media-sidebar-content']}>
                    <p className={styles['media-sidebar-date']}>
                      {moment(post.date).format('MMM YYYY')} | 8 Mins Read
                    </p>
                    <h4 className={styles['media-sidebar-title']}>{post.title}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>

        {/* Related Blogs */}
        <div className={styles['media-grid']}>
          <h3>Related Blogs</h3>
          <div className={styles['media-container']}>
            {allData?.related?.length > 0 ? (
              allData.related.map((post) => (
                <a
                  key={post._id}
                  href={post.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles['blog-item']} ${styles['blogs-media-item']}`}
                >
                  {post.image && <img src={post.image} alt={post.name} className={styles['blogs-media-img']} />}
                  <div>
                    <h4 className={styles['blogs-media-title']}>{post.name}</h4>
                  </div>
                </a>
              ))
            ) : (
              <p>No related blogs available</p>
            )}
          </div>
        </div>
      </div>

      {!isDesktop && <BottomBar />}
    </Wrapper>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl}/blog/slugList?active=true&blogType=PressRelease`);
  const data = await res.json();

  const paths = data.result.map((post) => ({
    params: { media: post?.slug },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const slug = params.media;
  const apiUrl = process.env.apiUrl;

  // Fetch CMS PRs
  const cmsPRRes = await fetch(`${apiUrl}/blog/pageDetail?blogType=PressRelease&limit=100`);
  const cmsPRRaw = await cmsPRRes.json();
  const cmsRecent = (cmsPRRaw?.result?.latestBlogList || []).map((e) => ({
    id: e._id,
    title: e.name,
    image: e.file?.thumbnail || e.file?.path || '',
    slug: e.slug,
    source: 'cms',
  }));

  // Fetch WP PRs
  let wpRecent = [];
  try {
    const wpRes = await fetch(`https://cms.inframantra.com/wp-json/wp/v2/posts?_embed&per_page=50`);
    const wpRaw = await wpRes.json();

    wpRecent = wpRaw
      .filter((p) => {
        const cat = p._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category');
        return cat?.slug === 'pr-media';
      })
      .map((p) => ({
        id: p.id,
        title: p.title.rendered.replace(/<[^>]+>/g, ''),
        image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        slug: p.slug,
        source: 'wp',
      }));
  } catch (err) {
    console.warn('⚠️ WP PR fetch failed:', err.message);
  }

  const recent = [...cmsRecent, ...wpRecent].slice(0, 6);

  // Try CMS post
  const cmsRes = await fetch(`${apiUrl}/blog/pageDetail?slug=${slug}`);
  const cmsData = await cmsRes.json();
  const cmsPost = cmsData?.result?.detail?.[0];

  if (cmsPost) {
    const detail = {
      title: cmsPost.name || '',
      description: cmsPost.description || '',
      metaTitle: cmsPost.metaTitle || '',
      metaDescription: cmsPost.metaDescription || '',
      metaKeyword: cmsPost.metaKeyword || '',
      image: cmsPost.file?.path || '',
      date: moment(cmsPost.createdAt).format('DD/MM/YYYY'),
      name: cmsPost.writer_name || '',
    };

    const related = (cmsData?.result?.reletedBlogs || []).map((e) => ({
      _id: e._id,
      name: e.name,
      image: e.file?.thumbnail || '',
      slug: e.slug,
      link: `/pr/${e.slug}`,
    }));

    return {
      props: {
        allData: {
          isCMSPost: true,
          detail,
          related,
          recent,
        },
      },
      revalidate: 10,
    };
  }

  // Fallback to WordPress
  try {
    const wpSingleRes = await fetch(`https://cms.inframantra.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
    const wpPost = (await wpSingleRes.json())?.[0];
    if (!wpPost) return { notFound: true };
const focusKeyword = wpPost.meta?._yoast_wpseo_focuskw || "";
    const detail = {
      title: wpPost.title.rendered,
      description: wpPost.content.rendered,
      metaTitle: wpPost.title.rendered,
      metaDescription: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''),
      metaKeyword: focusKeyword,
      image: '',
      date: moment(wpPost.date).format('DD/MM/YYYY'),
      name: wpPost._embedded?.author?.[0]?.name || '',
    };

    return {
      props: {
        allData: {
          isCMSPost: false,
          detail,
          related: [],
          recent,
        },
      },
      revalidate: 10,
    };
  } catch (err) {
    return { notFound: true };
  }
}

export default News;
