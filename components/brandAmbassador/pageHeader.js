import Image from "next/image";
import NoImage from "../UI/NoImage";
import Section from "../UI/Section";
import styles from "./pageHeader.module.css";

const PageHeader = (props) => {
const item = props.data;

    return(
        <Section classes= {styles.pageHeader + " " + styles.brandAmbassador} id="" pageWidth="fluid">
            {item.image ?
              <picture>
                <img src={item.image} className={styles.pageHeaderImg} alt="Banner" layout="fill" objectFit="fill" />
              </picture>
            :
            <NoImage />
            }
            <div className={styles.overlay}></div>
            <div className={styles.pageBannerContent}>
                <div className={styles.pageWidth}>
                    <h1>{item.title}</h1>
                  
                </div>
            </div>
        </Section>
    )
}

export default PageHeader;