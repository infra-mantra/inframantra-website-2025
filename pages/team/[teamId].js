import React from "react";
import Wrapper from "../../components/shared/Wrapper.jsx";
import DirectorProfile from "../../components/team/DirectorProfile.jsx";
import { resolveProfileImage, resolveTeamImage } from "../../components/lib/teamImages.js";
import {
  fetchDirectorArticles,
  fetchTestimonials,
  AWARD_IMAGES,
} from "../../components/lib/teamContent.js";

const TeamDetail = ({ allData }) => (
  <Wrapper
    title={allData.heading.meta_title || "Team Details"}
    description={allData.heading.meta_description || ""}
    keyword={allData.heading.meta_keywords || ""}
    image={allData.heading.image || "/default-image.jpg"}
  >
    <DirectorProfile data={allData} />
  </Wrapper>
);

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl}/team/slugList`);
  const data = await res.json();

  const paths = (data?.result || []).map((post) => ({
    params: { teamId: post.link },
  }));

  return { paths, fallback: false };
}

/**
 * "2017 - Present" -> { yearHead: "2017", yearTail: "Present" }
 * "2009-2011"      -> { yearHead: "2009", yearTail: "2011" }
 * "2012"           -> { yearHead: "2012", yearTail: null }
 * Splitting here rather than at render keeps the component free of parsing.
 */
const splitYear = (year) => {
  const parts = String(year || "")
    .split(/\s*[–-]\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { yearHead: parts[0] || String(year || ""), yearTail: parts[1] || null };
};

/**
 * Most journey entries open by restating their own year ("In 2012, he started…"),
 * which reads as a stutter once the year is set beside it as a large numeral.
 * The pattern is built from THAT entry's own year, so it no-ops on any mismatch
 * and a CMS edit can never truncate real copy.
 */
const stripYearPrefix = (description, year) => {
  const text = String(description || "").trim();
  const head = String(year || "").trim();
  if (!text || !head) return text;

  const prefix = "in " + head.toLowerCase();
  if (!text.toLowerCase().startsWith(prefix)) return text;

  let rest = text.slice(prefix.length);
  while (rest.length && (rest[0] === "," || rest[0] === " ")) rest = rest.slice(1);
  if (!rest) return text;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
};

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${process.env.apiUrl}/team/detail?link=${params.teamId}`);
    const data = await res.json();

    if (!data?.result) {
      throw new Error("Invalid data from API");
    }

    const heading = {
      name: data?.result?.detail?.[0]?.name || null,
      designation: data?.result?.detail?.[0]?.designation || null,
      description: data?.result?.detail?.[0]?.description || null,
      // The CMS still points one director's images at a retired S3 bucket; see
      // components/lib/teamImages.js. Dead URLs become a known-good portrait, or
      // null so the layout switches to its image-free mode.
      image: resolveProfileImage(data?.result?.detail?.[0]?.file?.path, params.teamId),
      meta_title: data?.result?.detail?.[0]?.meta_title || null,
      meta_description: data?.result?.detail?.[0]?.meta_description || null,
      meta_keywords: data?.result?.detail?.[0]?.meta_keyword || null,
    };

    const journey = (data?.result?.journey || []).map((e) => {
      const { yearHead, yearTail } = splitYear(e.year);
      return {
        id: e._id,
        title: e.year,
        yearHead,
        yearTail,
        description: stripYearPrefix(e.description, e.year),
        ...(e.file?.path && resolveTeamImage(e.file.path) && { image: e.file.path }),
      };
    });

    // The team endpoint's own BlogList comes back empty, so real coverage is
    // pulled from the blog/news/press collections and filtered to items that
    // actually name this director. Testimonials and awards are company-wide.
    const [pressArticles, testimonials] = await Promise.all([
      fetchDirectorArticles(process.env.apiUrl, params.teamId, 12),
      fetchTestimonials(process.env.apiUrl1, 8),
    ]);

    // Publications that wrote ABOUT him — not pieces he wrote, and not the
    // company's own byline. Drives the "Featured in" band.
    const publishers = [
      ...new Set(
        pressArticles
          .filter((a) => !a.authored && a.source && a.source !== "Inframantra")
          .map((a) => a.source)
      ),
    ];

    // One build-time boolean decides the journey layout, so the component has no
    // runtime branching. False for Garvit today (all six of his images are dead).
    const journeyHasFigures = journey.filter((j) => j.image).length * 2 >= journey.length;

    // Three quotes nearest ~320 characters, so the columns balance. Chosen at build
    // time and in stable order — picking at render would diverge from the SSG HTML.
    const featuredTestimonials = testimonials
      .map((t, index) => ({ t, index }))
      .sort((a, b) => Math.abs(a.t.quote.length - 320) - Math.abs(b.t.quote.length - 320))
      .slice(0, 3)
      .sort((a, b) => a.index - b.index)
      .map(({ t }) => t);

    return {
      props: {
        allData: {
          heading,
          journey,
          journeyHasFigures,
          pressArticles,
          publishers,
          testimonials: featuredTestimonials,
          awards: AWARD_IMAGES,
        },
      },
      // Was 10s, which re-ran four upstream calls (team/detail plus three
      // blog/pageDetail at limit=100) every ten seconds for content that changes
      // monthly at most.
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching team details:", error.message);
    return {
      notFound: true,
    };
  }
}

export default TeamDetail;
