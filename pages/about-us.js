import Wrapper from "../components/UI/Wrapper";



import AboutUsPageHeader from "../components/newComponents/AboutUsPage/aboutUsPageBanner";

function About({allData}){
    const banner_data = {
        image: '/assets/guru/12112212.png',
        title: allData.meta.bannerTitle,
    }  
    return(
        <Wrapper title={allData.meta.meta_title} description={allData.meta.meta_description}>
            <div className="aboutUsPageWrapper">
            <AboutUsPageHeader />
            </div>
        </Wrapper>
    )
}
export async function getStaticProps() {
    const res = await fetch(`${process.env.apiUrl}/about`)
    const data = await res.json()
    const headingsData = data.result.heading[0]
    const heading = {
        "year": headingsData.year,
        "yearExperience": headingsData.yearExperience,
        "description": headingsData.description,
        "milestone": headingsData.milestone,
        "milestoneDescription": headingsData.milestoneDescription,
        "ourTeam": headingsData.ourTeam,
        "teamDescription": headingsData.teamDescription,
        "reraTitle": headingsData.reraTitle,
        "reraDescription": headingsData.reraDescription,
        "ourPartner": headingsData.ourPartner,
        "partnerDescription": headingsData.partnerDescription
    }
    const meta = {
        "bannerTitle": data.result.meta[0].title,
        "meta_title": data.result.meta[0].meta_title,
        "meta_description": data.result.meta[0].meta_description,
        "bannerImage": data.result.meta[0].file.path
    }
    const partnerData = data.result.partnerList
    const partnerDataArray = []
    partnerData.forEach(function(p){
      partnerDataArray.push({
        "id": p._id,
        "name": p.name,
        ...(p.slug && {"slug": p.slug}),
        ...(p.file &&  {"image": p.file.path}),
      })
    })

    const visionData = data.result.visionList
    const visionDataArray = []
    visionData.forEach(function(v){
        visionDataArray.push({
        "id": v._id,
        "name": v.name,
        "description": v.description
      })
    })

    const journeyData = data.result.journeyList
    const journeyDataArray = []
    journeyData.forEach(function(j){
        journeyDataArray.push({
        "id": j._id,
        "year": j.year,
        "description": j.description
      })
    })

    const teamData = data.result.teamList
    const teamDataArray = []
    teamData.forEach(function(t){
        teamDataArray.push({
        "id": t._id,
        "name": t.name,
        "designation": t.designation,
        "slug": t.link,
        ...(t.file && {"image": t.file.path})
      })
    })

    const cityData = data.result.cityList
    const cityDataArray = []
    cityData.forEach(function(c){
        cityDataArray.push({
        "id": c._id,
        "name": c.name,
        "rerano": c.rerano
      })
    })

    const awards = {
        "title": data.result.awardList[0].title,
        "shortdescription": data.result.awardList[0].shortdescription,
        "description": data.result.awardList[0].description,
        "image": data.result.awardList[0].file.path,
    }
  
    const allData = {
        "meta": meta,
        "heading": heading,
        "vision": visionDataArray,
        "journey": journeyDataArray,
        "team" : teamDataArray,
        "partners": partnerDataArray,
        "awards": awards,
        "city": cityDataArray
    }
    return {
      props: {
        allData,
      },
      revalidate: 10,
    }
  }
  
  export default About