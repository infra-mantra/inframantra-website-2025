import Section from "../UI/Section"
import JobAccordion from "./JobAccordion"

function JobOpenings({title, description, jobList}) {
    
  return (
    <Section classes="job-openings sec-p" pageWidth="container">
        <div className="section-head">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>

        <div className="jobs-wrapper">
            {jobList.map((element) => (
                <JobAccordion data={element} key={element.id}/>
            ))}
        </div>
    </Section>
  )
}

export default JobOpenings