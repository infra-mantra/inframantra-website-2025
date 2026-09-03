import styles from "./Header.module.css";

const Hero = () => {
  const handleScroll = () => {
    const section = document.getElementById("job");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={styles.hero}>
        {/* LEFT CONTENT */}
        <div className={styles.heroLeft}>
          <h1>
            Discover Yourself at <br />
            <span>INFRAMANTRA</span>
          </h1>

          {/* BUTTON */}
          <div className={styles.heroBtn}>
            <button className={styles.btnContent} onClick={handleScroll}>
              <span className={styles.exlr}>Explore Roles</span>

              <span className={styles.strk}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 77 22" fill="none">
                  <path
                    d="M1.54162 10.7915L74.6342 10.7915M74.6342 10.7915L64.788 20.0415M74.6342 10.7915L64.788 1.5415"
                    stroke="#E4A951"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.heroRight}>
          <img src="/career/career.avif" alt="laptop" />
        </div>
      </div>
    </>
  );
};

export default Hero;
