import Image from "next/image";
import Section from "../UI/Section";
import style from "../TeamDetailsSections/teamBanner.module.css";

function TeamBanner(props) {
  return (
    <Section classes={style.teamPageHeader} id="" pageWidth="fluid">
      <picture>
        <img src={props.bg_img} alt="Banner" layout="fill" objectFit="cover" />
      </picture>
      <div className={style.overlay}></div>
      <div className={style.pageBannerContent}>
        <div className={style.pageWidth}>
          <h1>{props.title}</h1>
          <p className={style.position}>{props.position}</p>
        </div>
      </div>
      <div className={style.teamMemberImg}>
        <picture>
          <img
            src={props.member_image}
            alt="Member Image"
            layout="fill"
          />
        </picture>
      </div>
    </Section>
  );
}

export default TeamBanner