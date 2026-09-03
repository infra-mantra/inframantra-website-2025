import BannerVideo from "./BannerVideo.jsx";
import React from "react";
import dynamic from "next/dynamic";
import style from "./MainBanner.module.css";
import { SearchBarSkeleton } from "./HomeSkeletons.jsx";

/*
  The search bar was in the critical bundle purely because MainBanner imported it
  statically — it drags in the autocomplete, its icon sets and the suggestion
  fetching, none of which is needed to paint the hero. The home page's problem is
  script evaluation (1449ms, driving 650ms of blocking time and a 1339ms render
  delay), not bytes on the wire, so moving this out of the first evaluation pass
  is the useful lever.

  It keeps its place in the layout the whole time: SearchOptions already renders
  SearchBarSkeleton until it knows the viewport, so the same placeholder now also
  covers the chunk load. Nothing moves when the real bar arrives.
*/
const SearchOptions = dynamic(() => import("./search/SearchOptions.jsx"), {
  loading: () => <SearchBarSkeleton />,
});

const HeaderSection = () => {
  return (
    <section className={style.homePageheaderContainer}>
      <section className={style.homePageheader}>
        <h1 style={{ display: "none" }}>INFRAMANTRA - Making Realty A Reality For You</h1>
        <BannerVideo />
        <SearchOptions />
      </section>
    </section>
  );
};

export default HeaderSection;
