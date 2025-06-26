import Image from "next/image";
import NoImage from "../UI/NoImage";
import Section from "../UI/Section";

const PageHeader = (props) => {
const item = props.data;

    return(
        <Section classes="page-header brand-ambassador" id="" pageWidth="fluid">
            {item.image ?
              <picture>
                <img src={item.image} className="page-header-img" alt="Banner" layout="fill" objectFit="fill" />
              </picture>
            :
            <NoImage />
            }
            <div className="overlay"></div>
            <div className="page-banner-content">
                <div className="page-width">
                    <h1>{item.title}</h1>
                    <p className="date">{item.date}</p>
                </div>
            </div>
        </Section>
    )
}

export default PageHeader;