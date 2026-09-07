/*
  Customer testimonial videos for the reviews section.

  `label` is a short human name for the card. The raw YouTube titles are long and
  shouty ("CUSTOMER TESTIMONIAL | INFRAMANTRA | SAAN VERDANTE | SECTOR - 95 |
  GURUGRAM", "Honored as Channel Partner of the Year | Times Realty &
  Infrastructure Conclave 2025 #timesofindia"), so each carries a trimmed version.

  Awards clips live in the Shorts rail higher up the page, not here — this section
  is customer testimonials only.

  Thumbnails are handled in ReviewVideos.jsx — one rule, maxresdefault, for every
  entry regardless of format. See the comment there for why per-format rules break.
*/

const REVIEW_VIDEOS = [
  {
    id: "amvS_XbgT2I",
    label: "Saan Verdante, Sector 95",
    caption: "Customer testimonial",
  },
  {
    id: "QgfzVCo38hk",
    label: "Godrej Air, Sector 85",
    caption: "Customer testimonial",
  },
  {
    id: "rUD62Ie2hbU",
    label: "“I wasn't ready to buy DLF — until this happened”",
    caption: "Client story",
  },
  {
    id: "a7jYt5uxNfk",
    label: "Vatika Seven Elements",
    caption: "Customer review",
  },
  {
    id: "D-PpdJeoivQ",
    label: "Homeowner spotlight",
    caption: "Real experiences",
  },
  {
    id: "XjMixfztk6g",
    label: "Homeowner spotlight",
    caption: "Real experiences",
  },
];

export default REVIEW_VIDEOS;
