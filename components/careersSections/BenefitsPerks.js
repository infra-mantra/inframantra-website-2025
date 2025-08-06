import Section from "../UI/Section"
import Image from "next/image"
import style from "./benefitsPerk.module.css"

function BenefitsPerks({title, description, list}) {
    let data = [
        {
            _id: 'bnf1',
            img: '/assets/images/bnf-1.png',
            title: 'Highly Competitive Compensation'
        },
        {
            _id: 'bnf2',
            img: '/assets/images/bnf-2.png',
            title: 'Supersonic Growth'
        },
        {
            _id: 'bnf3',
            img: '/assets/images/bnf-3.png',
            title: 'Fun, Dynamic Environment'
        },
        {
            _id: 'bnf4',
            img: '/assets/images/bnf-4.png',
            title: 'Best Incentive Structure'
        },
        {
            _id: 'bnf5',
            img: '/assets/images/bnf-5.png',
            title: 'Bi-Annual Appraisals for Sales'
        },
    ]

  return (
    <Section classes={`${style.careerBenefits} ${style.secP}`} pageWidth="container">
        <div className={`${style.sectionHead}`}>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
        <div className={`${style.benefitsWrapper}`}>
            {list.map((element) => (
                <div className={`${style.bnfItem}`} key={element.id}>
                    <div className={`${style.icon}`}>
                        <Image src={element.image} alt="Benefit 1" layout="fill" objectFit="contain" objectPosition="left" />
                    </div>
                    <div className={`${style.info}`}>
                        <h4>{element.name}</h4>
                    </div>
                </div>
            ))}
        </div>
    </Section>
  )
}

export default BenefitsPerks;