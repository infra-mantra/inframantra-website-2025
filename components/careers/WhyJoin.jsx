import styles from "./WhyJoin.module.css";

const WhyJoin = () => {
  return (
    <section className={styles.section_cr}>
      <div className={styles.container}>
        {/* IMAGE SIDE */}
        <div className={styles.imageWrapper_career}>
          <img
            src="/career/join-us.avif"
            alt="Working professional"
            className={styles.imageCareer}
          />
        </div>

        {/* CONTENT SIDE */}
        <div className={styles.content_career}>
          <h2 className={styles.label}>
            {/* WHY&nbsp;<span className={styles.join}>JOIN</span>&nbsp;US? */}
            Ready to accelerate your career in one of India’s fastest-growing prop-tech companies?
          </h2>

          <p className={styles.description}>
            <span className={styles.httext}>Welcome to Inframantra! </span>
            <br />
            <br />
            At Inframantra, ambition meets opportunity. We’re building a workplace where innovation
            thrives, ideas are celebrated, and people grow faster than ever before. If you’re
            passionate about making an impact and shaping the future of real estate, you’ll fit
            right in.
            <br />
            <br />
            Note: <span className={styles.httext}>We Reward Excellence.</span> Our sales personnel
            often multiply their earnings by 2–3x with powerful incentive structures at Inframantra.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
