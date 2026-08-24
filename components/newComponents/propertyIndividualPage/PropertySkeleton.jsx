import s from './PropertySkeleton.module.css';

/*
  Loading skeleton for the property (individual) page. It mirrors the page
  layout: hero gallery -> title + config -> section tabs -> left content
  sections + right enquiry form.

  Built from one grey box (<B/>). To change a shape, add/remove a <B/> here
  or edit a size in PropertySkeleton.module.css.
*/
function B({ className = '' }) {
  return <div className={`${s.block} ${className}`} />;
}

// One content section: a heading, a couple of lines, and a small grid.
function Section() {
  return (
    <div>
      <B className={s.secHeading} />
      <B className={s.line} />
      <B className={s.line} />
      <B className={`${s.line} ${s.lineShort}`} />
      <div className={s.grid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <B key={i} className={s.gridItem} />
        ))}
      </div>
    </div>
  );
}

export default function PropertySkeleton() {
  return (
    <div className={s.wrap} aria-hidden="true">
      {/* Hero image gallery */}
      <div className={s.hero}>
        <B className={s.heroMain} />
        <div className={s.heroSide}>
          <B />
          <B />
        </div>
      </div>

      {/* Title + location + config cards */}
      <div className={s.header}>
        <B className={s.title} />
        <B className={s.loc} />
        <div className={s.configGrid}>
          {[0, 1, 2, 3].map((i) => (
            <B key={i} className={s.configItem} />
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div className={s.nav}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <B key={i} className={s.navTab} />
        ))}
      </div>

      {/* Left content sections + right enquiry form */}
      <div className={s.body}>
        <div className={s.left}>
          {[0, 1, 2].map((i) => (
            <Section key={i} />
          ))}
        </div>
        <div className={s.right}>
          <B className={s.formCard} />
        </div>
      </div>
    </div>
  );
}
