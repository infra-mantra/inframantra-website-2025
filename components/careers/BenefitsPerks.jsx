import Section from "../shared/Section.jsx";
import Image from "next/image";
import style from "./BenefitsPerk.module.css";

function BenefitsPerks() {
  const data = [
    {
      _id: "bnf1",
      img: "/career/icons/competative-salary.png",
      title: "Competitive Salary",
      content: "Attractive pay packages that reflect your skills and experience",
    },
    {
      _id: "bnf2",
      img: "/career/icons/health.png",
      title: "Health & Wellness",
      content:
        "Comprehensive medical and hospitalization coverage to keep you and your family healthy.",
    },
    {
      _id: "bnf3",
      img: "/career/icons/work-life-balance.png",
      title: "Work-Life Balance",
      content:
        " Set working hours to maintain a healthy balance between personal and professional life.",
    },
    {
      _id: "bnf4",
      img: "/career/icons/self-learning-improvement.png",
      title: "Learning and Development",
      content:
        "Access to ongoing training, workshops, and resources for career growth and skill development.",
    },
    {
      _id: "bnf4",
      img: "/career/icons/recognition.png",
      title: "Employee Recognition",
      content: "Regular acknowledgment and rewards for hard work and achievements.",
    },
    {
      _id: "bnf4",
      img: "/career/icons/team-work.png",
      title: "Collaborative Work Environment  ",
      content:
        "A dynamic, inclusive, and supportive team culture that encourages innovation and creativity.",
    },
    {
      _id: "bnf4",
      img: "/career/icons/career-advancement.png",
      title: "Career Advancement",
      content: "Opportunities for internal promotions and career progression within the company.",
    },
    {
      _id: "bnf4",
      img: "/career/icons/performance-bo.png",
      title: "Performance Bonuses ",
      content:
        "Incentives tied to company and individual performance, ensuring that your contributions are recognized and rewarded.",
    },
  ];

  return (
    <section className={style.perkSection}>
      <h2 className={style.perkHeading}>
        <span className={style.perkYl}>Perks and Benefits </span> at INFRAMANTRA
      </h2>
      <div className={style.perkWrapper}>
        {data.map((item) => (
          <div className={style.perkCard} key={item._id}>
            <div className={style.perkImageBox}>
              <Image src={item.img} alt={item.title} width={50} height={50} />
            </div>

            <div className={style.perkTextBox}>
              <h3 className={style.perkTitle}>{item.title}</h3>
              <p className={style.perkContent}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsPerks;
