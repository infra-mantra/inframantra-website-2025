import CareerText from "../components/careersSections/CareerText";
import PageHeader from "../components/UI/PageHeader"
import Wrapper from "../components/UI/Wrapper"
import BenefitsPerks from "../components/careersSections/BenefitsPerks";
import JobOpenings from "../components/careersSections/JobOpenings";

function Careers({allData}) {

const banner_data = {
    image: allData.meta.bannerImage,
    title: allData.meta.bannerTitle,
};
let main_title = banner_data.title;

  return (
    <Wrapper 
        title={allData.meta.meta_title}
        description={allData.meta.meta_description}
        keyword={allData.meta.meta_keyword}
    >
        <PageHeader data={banner_data}/>
        <CareerText
          title={allData.heading.title}
          description={allData.heading.description}
          image={allData.heading.rightImage}
        />
        {/* <CareerGallery
          images={allData.gallery}
        /> */}
        <BenefitsPerks
          title={allData.heading.benafitTitle}
          description={allData.heading.benafitDescription}
          list={allData.benefits}
        />
        <JobOpenings
          title={allData.heading.positionTitle}
          description={allData.heading.positionDescription}
          jobList={allData.jobs}
        />
    </Wrapper>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.apiUrl}/career/pageDetail`)
  const data = await res.json()
  const headingsData = data.result.heading[0]
  const heading = {
      "title": headingsData.title,
      "description": headingsData.description,
      "benafitTitle": headingsData.benafitTitle,
      "benafitDescription": headingsData.benafitDescription,
      "positionTitle": headingsData.positionTitle,
      "positionDescription": headingsData.positionDescription,
      "rightImage": headingsData.file.path
  }
  
  const galleryData = data.result.gallery
  const galleryDataArray = []
  galleryData.forEach(function(g){
    galleryDataArray.push({
      "id": g._id,
      "image": g.file.path,
    })
  })

  const benefitData = data.result.benafitsList
  const benefitDataArray = []
  benefitData.forEach(function(b){
    benefitDataArray.push({
      "id": b._id,
      "name": b.name,
      "image": b.file.path,
    })
  })

  const jobData = data.result.jobsList
  const jobDataArray = []
  jobData.forEach(function(j){
    jobDataArray.push({
      "id": j._id,
      "title": j.name,
      "location": j.location,
      "jobType": j.jobType,
      "description": j.description,
    })
  })

  const meta = {
    "bannerTitle": data.result.meta[0].title,
    "meta_title": data.result.meta[0].meta_title,
    "meta_description": data.result.meta[0].meta_description,
    "meta_keyword": data.result.meta[0].meta_keyword,
    "bannerImage": data.result.meta[0].file.path
}

  const allData = {
      "meta": meta,
      "heading": heading,
      "gallery": galleryDataArray,
      "benefits": benefitDataArray,
      "jobs": jobDataArray
  }
  return {
    props: {
      allData,
    },
    revalidate: 10,
  }
}

export default Careers