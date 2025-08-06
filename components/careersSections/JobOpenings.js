import Section from "../UI/Section"
import JobAccordion from "./JobAccordion"
import styles from "./jobOpening.module.css"

function JobOpenings({title, description, jobList}) {
    
  return (
    <Section classes={`${styles.jobOpenings} ${styles.secP}`} pageWidth="container">
        <div className={styles.sectionHead}>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>

        <div className={styles.jobsWrapper}>
            {jobList.map((element) => (
                <JobAccordion data={element} key={element.id}/>
            ))}
        </div>
    </Section>
  )
}

export default JobOpenings