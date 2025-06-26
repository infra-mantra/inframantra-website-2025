import Section from "../UI/Section";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function FeaturedBlogs({ blogs, PRS }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const storyRefs = useRef([]);
  const [activeImage, setActiveImage] = useState(""); // Start with empty image
  const [activeTitle, setActiveTitle] = useState(""); // Default main title
  const [activeSlug, setActiveSlug] = useState(blogs[0]?.slug || ""); // Default main slug
  const [activeIndex, setActiveIndex] = useState(0); // Track active index for bullet navigation

  useEffect(() => {
    // Initial device check based on window size
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth >= 768); // Assume desktop if >= 768px
    // Set the default active image based on device type
    setActiveImage(screenWidth >= 768 ? blogs[0]?.image : blogs[0]?.thumbnail); // Set active image conditionally
    setActiveTitle(blogs[0]?.title || ""); // Default main title

    // Add event listener to handle window resize
    function handleResize() {
      const newScreenWidth = window.innerWidth;
      setIsDesktop(newScreenWidth >= 768); // Update device type
    }

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [blogs]);

  // Update background image, title, and link when clicking on a story card
  const handleStoryClick = (image, title, slug, index = null) => {
    setActiveImage(image); // Set active image
    setActiveTitle(title);
    setActiveSlug(slug);
    setActiveIndex(index);

    // Scroll to the respective story card if the index is provided
    if (index !== null && storyRefs.current[index]) {
      storyRefs.current[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Section classes="featured-blog" pageWidth="container">
      <div className="section-head-category">BLOGS AND TRENDING NEWS</div>
      {blogs && blogs.length > 0 && (
        <div className="featured-blog-container">
          {/* Different HTML structure for PC and Mobile */}
          {isDesktop ? (
            // PC HTML Structure
            <div className="featured-blog-main-story">
              <Link href={`/blog/${activeSlug}`} className="featured-blog-read-button">
                <img
                  src={activeImage} // Use the active image for desktop
                  alt="Featured Background"
                  className="featured-blog-main-image"
                />
              </Link>
              <div className="featured-blog-content"></div>
              <div className="featured-blog-overlay">
                <div className="featured-blog-other-stories">
                  <h3 className="featured-blog-other-heading">Other Stories</h3>
                  <div className="featured-blog-story-cards">
                    {blogs.slice(1).map((item, index) => (
                      <div
                        key={item.slug} // Use a unique identifier like slug
                        className="featured-blog-story-card"
                        ref={(el) => (storyRefs.current[index] = el)}
                        onClick={() =>
                          handleStoryClick(item.image, item.title, item.slug, index)
                        }
                      >
                        <div className="featured-blog-story-number">{index + 2}</div>
                        <p className="featured-blog-story-title">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Mobile HTML Structure
            <>
              <div className="featured-blog-main-story">
                <Link href={`/blog/${activeSlug}`}>
                  <img
                    src={activeImage} // Use the active image for mobile
                    alt="Featured Background"
                    className="featured-blog-main-image"
                  />
                </Link>
                <div className="featured-blog-content"></div>
              </div>
              <div className="featured-blog-mobile-overlay">
                <div className="featured-blog-other-stories">
                  <h3 className="featured-blog-other-heading">Other Stories</h3>
                  <div className="featured-blog-story-cards">
                    {blogs.slice(1).map((item, index) => (
                      <div
                        key={item.slug} // Use a unique identifier like slug
                        className="featured-blog-story-card"
                        ref={(el) => (storyRefs.current[index] = el)}
                        onClick={() =>
                          handleStoryClick(item.thumbnail, item.title, item.slug, index) // Use the thumbnail for mobile
                        }
                      >
                        <div className="featured-blog-story-number">{index + 2}</div>
                        <p className="featured-blog-story-title">{item.title}</p>
                      </div>
                    ))}
                  </div>
                  {/* New Bullet Navigation */}
                  <div className="mobile-bullet-navigation">
                    {blogs.slice(1).map((_, index) => (
                      <span
                        key={index}
                        className={`mobile-bullet ${activeIndex === index ? "active" : ""}`}
                        onClick={() =>
                          handleStoryClick(
                            blogs[index + 1]?.thumbnail, // Use the thumbnail for mobile
                            blogs[index + 1]?.title,
                            blogs[index + 1]?.slug,
                            index
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Custom Slider for Featured Blogs */}
      {PRS && PRS.length > 0 && (
        <div>
          <div className="section-blog section-head">
            <h2>| Featured Media</h2>
          </div>
          <div className="custom-slider">
            {PRS.map((item, index) => (
              <div key={index} className="blog-slide">
                <Link href={`/pr/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="blog-slide-image"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export default FeaturedBlogs;
