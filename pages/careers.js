import Wrapper from "../components/shared/Wrapper.jsx";
import Header from "../components/careers/Header.jsx";
import WhyJoin from "../components/careers/WhyJoin.jsx";
import CultureValues from "../components/careers/Cuvalues.jsx";
import BenefitsPerks from "../components/careers/BenefitsPerks.jsx";
import CreativeSlider from "../components/careers/slider.js";
import JobSection from "../components/careers/JobOpenings.jsx";
import FaqSection from "../components/careers/Faq.jsx";
import Award from "../components/careers/Award.jsx";
import SliderJ from "../components/careers/SliderJ.jsx";

function Careers({ allData }) {
  const faqs = [
    {
      id: 1,
      question: "Where is Inframantra located?",
      answer:
        "Inframantra is located at Plot no. 95, 3rd Floor, Sector 32, Institutional Area, Gurugram.",
    },
    {
      id: 2,
      question: "What does Inframantra do?",
      answer:
        "Inframantra is one of the fastest-growing prop-tech consulting firms in Gurgaon, Noida, Delhi, Pune, and Jaipur. We offer seamless property buying experience to home-buyers and investors with honesty, simplicity and transparency. With integrity in its core, Inframantra is committed to “Making Realty a Reality for You.”",
    },
    {
      id: 3,
      question: "How can I apply for a job at Inframantra?",
      answer:
        "To apply, simply visit our careers page, browse the available job openings, and submit your application through the online portal. We will review your profile and contact you if your qualifications match any open positions.",
    },
    {
      id: 4,
      question: "What should I expect during the interview process?",
      answer:
        "During the interview process, we’ll discuss your skills, expertise, experience, and how you align with Inframantra’s culture. Depending on the position, you may be asked to complete a technical test or project to demonstrate your abilities.",
    },
    {
      id: 5,
      question: "Do you hire interns or entry-level candidates?",
      answer:
        "Yes, we actively seek motivated interns and entry-level candidates for various roles. These positions provide great opportunities to gain hands-on experience and kickstart your career with Inframantra.",
    },
  ];

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
      <Header />
      <WhyJoin />
      <CultureValues />
      <BenefitsPerks />
      <Award />
      <JobSection data={allData.jobs} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FaqSection faq={faqs} />
      </div>
    </Wrapper>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.apiUrl}/career/pageDetail`);
  const data = await res.json();
  const headingsData = data.result.heading[0];
  const heading = {
    title: headingsData.title,
    description: headingsData.description,
    benafitTitle: headingsData.benafitTitle,
    benafitDescription: headingsData.benafitDescription,
    positionTitle: headingsData.positionTitle,
    positionDescription: headingsData.positionDescription,
    rightImage: headingsData.file.path,
  };

  const galleryData = data.result.gallery;
  const galleryDataArray = [];
  galleryData.forEach(function (g) {
    galleryDataArray.push({
      id: g._id,
      image: g.file.path,
    });
  });

  const benefitData = data.result.benafitsList;
  const benefitDataArray = [];
  benefitData.forEach(function (b) {
    benefitDataArray.push({
      id: b._id,
      name: b.name,
      image: b.file.path,
    });
  });

  const jobData = data.result.jobsList;

  const jobDataArray = [];
  jobData.forEach(function (j) {
    jobDataArray.push({
      id: j._id,
      title: j.name,
      location: j.location,
      jobType: j.jobType,
      description: j.description,
      department: j.department,
      experience: j.experience,
    });
  });

  const meta = {
    bannerTitle: data.result.meta[0].title,
    meta_title: data.result.meta[0].meta_title,
    meta_description: data.result.meta[0].meta_description,
    meta_keyword: data.result.meta[0].meta_keyword,
    bannerImage: data.result.meta[0].file.path,
  };

  const allData = {
    meta: meta,
    heading: heading,
    gallery: galleryDataArray,
    benefits: benefitDataArray,
    jobs: jobDataArray,
  };
  return {
    props: {
      allData,
    },
    revalidate: 10,
  };
}

export default Careers;
