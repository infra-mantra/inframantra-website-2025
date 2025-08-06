import Section from "../UI/Section"
import Image from "next/image"
import style from "./careerText.module.css"
function CareerText({title, description, image}) {
  return (
    <Section classes={`${style.careerTextImage} ${style.secP}`} pageWidth="container">
        <div className={style.row}>
            <div className={`${style.cl6} ${style.order2}`}>
                <div className={`${style.sectionHead} ${style.mb0}`}>
                    <h2>{title}</h2>
                </div>
                <div className={`${style.imgWrap} ${style.mobShow}`}>
                    <Image src={image} layout="fill" alt="career-img" objectFit="cover"/>
                </div>
                <div className={`${style.textWrap}`} dangerouslySetInnerHTML={{__html: description}} />
            </div>
            <div className={`${style.cl6} ${style.order1} ${style.deskShow}`}>
                <div className={style.imgWrap}>
                    <Image src={image} layout="fill" alt="career-img" objectFit="cover"/>
                </div>
            </div>
        </div>
    </Section>
  )
}

export default CareerText