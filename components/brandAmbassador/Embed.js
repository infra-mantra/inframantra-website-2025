import React from "react";
import Section from "../UI/Section";
import style from "./embed.module.css";
const VideoEmbed = () => {
    return(
        <Section classes={style.brandAmb}>
          <div className={style.container}>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/qkVm2pUXGQM?si=HdUNnIfbre5YoXCj"
              title="YouTube video player"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>
        </Section>
    )
}

export default VideoEmbed;