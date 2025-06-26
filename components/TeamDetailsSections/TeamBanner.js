import Image from "next/image";
import Section from "../UI/Section";

function TeamBanner(props) {
  return (
    <Section classes="team-page-header" id="" pageWidth="fluid">
      <picture>
        <img src={props.bg_img} alt="Banner" layout="fill" objectFit="cover" />
      </picture>
      <div className="overlay"></div>
      <div className="page-banner-content">
        <div className="page-width">
          <h1>{props.title}</h1>
          <p className="postion">{props.position}</p>
        </div>
      </div>
      <div className="team-member-img">
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