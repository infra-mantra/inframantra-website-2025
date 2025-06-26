const Section = (props) => {
  const sectionClasses = "infra-section " + props.classes;

  return (
    <section className={sectionClasses}>
      {props.pageWidth == "fluid" ? (
        <div>{props.children}</div>
      ) : (
        <div className={`page-width ${props.pageWidth == "container" && 'container'}`}>{props.children}</div>
      )}
    </section>
  );
};

export default Section;
