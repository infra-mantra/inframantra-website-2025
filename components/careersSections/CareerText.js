import Section from "../UI/Section"
import Image from "next/image"

function CareerText({title, description, image}) {
  return (
    <Section classes="career-text-image sec-p" pageWidth="container">
        <div className="row">
            <div className="cl-6 order-2">
                <div className="section-head mb-0">
                    <h2>{title}</h2>
                </div>
                <div className="img-wrap mob-show">
                    <Image src={image} layout="fill" alt="career-img" objectFit="cover"/>
                </div>
                <div className="text-wrap" dangerouslySetInnerHTML={{__html: description}} />
            </div>
            <div className="cl-6 order-1 desk-show">
                <div className="img-wrap">
                    <Image src={image} layout="fill" alt="career-img" objectFit="cover"/>
                </div>
            </div>
        </div>
    </Section>
  )
}

export default CareerText