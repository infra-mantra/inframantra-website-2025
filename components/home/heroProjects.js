/*
  Projects shown in the home hero banner and the Featured Project card.
  Edit prices, locations or BHK text here — no other file needs to change.

  Images live in /public/banner/hero/ and are named after `key`:
    {key}-d1440/1920/2560/3200.avif|webp   desktop photo, 3:1
    {key}-m780/1170.avif|webp              phone/tablet photo, 6:5
    pl-{key}-{variant}.webp                project logo  (w = white, c = colour, d/g = other cut-outs)
    dv-{developer}-{variant}.webp          developer logo

  Fields
    key        file-name prefix for this project's images
    slug       page opened on click: /property/{slug}
    name, developer, location, price      text shown on the slide
    logo       [width, height] of pl-{key}.webp (keeps the layout steady while it loads)

    place      desktop layout — where the copy sits on the photo
      head       BHK headline, e.g. "3 & 4 BHK"
      sub        line under it (default "Luxury Residences")
      info       copy block on the "left" or "right" of the photo
      top        copy block's distance from the top, e.g. "22%"
      x          optional: exact left position of a left copy block, e.g. "57%"
      theme      "light" = white text (dark photos), "dark" = navy text (pale skies)
      strong     true = deeper shade behind the copy (busy photos)
      brand      where the logos go:
                   "tl" / "tr"  own block in the top-left / top-right corner
                   "stack"      above the copy
                   "row"        beside the copy
      brandX     optional: exact left position of a corner logo block
      brandStrong  true = outline the corner logo instead of shading behind it
      logo       project logo file for desktop: v = variant letter, w/h = size
      dev        developer logo: k = file name, v = variant (default: w on light theme,
                 c on dark theme; "box" = coloured tile), w/h = size

    mobile     phone/tablet layout (poster: logos left, text right, photo below)
      bg         band colour behind the logos/text; matches the top of the photo
      light      true = pale band, so navy text and colour logos
      logo       optional: a different project logo file (without .webp)
      dev        optional: a different developer logo file (without .webp)
      chip       true = colour logos on a dark band (soft white glow, no background)

*/
// Added to every banner photo URL. Bump it when any photo is regenerated under
// the same file name, so browsers download the new file instead of a cached one.
// (pages/_document.js uses it too, for the preload of the first photo.)
export const PHOTO_VERSION = "?v=8";

export const PROJECTS = [
  {
    key: "aura",
    slug: "aura-the-aerth-sector-79-gurugram",
    name: "Aura The Aerth",
    developer: "Aura The World",
    location: "Sector 79, Southern Peripheral Road",
    price: "1.91 Cr.",
    logo: [420, 272],
    place: {
      head: "2.5, 3 & 3.5 BHK",
      info: "right",
      top: "30%",
      theme: "light",
      brand: "tl",
      logo: { v: "hd", w: 420, h: 272 },
      dev: { k: "aura", w: 424, h: 120 },
    },
    mobile: { bg: "#0b2c51", logo: "pl-aura-hd" },
  },
  {
    key: "satya",
    slug: "satya-levante-residences-sector-104-gurgaon",
    name: "Satya Levante Residences",
    developer: "Satya Group",
    location: "Sector 104, Dwarka Expressway",
    price: "3.30 Cr.",
    logo: [312, 180],
    place: {
      head: "3, 4 & 5 BHK",
      info: "left",
      x: "57%",
      top: "18%",
      theme: "light",
      brand: "tl",
      brandX: "21%",
      brandStrong: true,
      logo: { v: "c", w: 351, h: 200 },
      dev: { k: "satya", v: "box", w: 450, h: 450 },
    },
    mobile: { bg: "#0c326f", logo: "pl-satya-mc", dev: "dv-satya-box" },
  },
  {
    key: "westin",
    slug: "whiteland-the-westin-residences-sector-103-gurugram",
    name: "Westin Residences Gurugram",
    developer: "Whiteland Corporations",
    location: "Sector 103, Dwarka Expressway",
    price: "7 Cr.",
    logo: [466, 180],
    place: {
      head: "3 & 4 BHK",
      sub: "Branded Residences",
      info: "right",
      top: "17%",
      theme: "light",
      strong: true,
      brand: "stack",
      logo: { v: "w", w: 533, h: 200 },
      dev: { k: "whiteland", w: 551, h: 120 },
    },
    mobile: { bg: "#211a14", logo: "pl-westin-mw" },
  },
  {
    key: "ambience",
    slug: "ambience-creacions-sector-22-gurugram",
    name: "Ambience Creacions",
    developer: "Ambience Group",
    location: "Sector 22, Old Gurgaon",
    price: "5.95 Cr.",
    logo: [371, 180],
    place: {
      head: "3, 4 & 5 BHK",
      info: "right",
      top: "24%",
      theme: "light",
      brand: "tl",
      logo: { v: "w", w: 552, h: 200 },
      dev: { k: "ambience", v: "c", w: 219, h: 120 },
    },
    mobile: { bg: "#4f5781", logo: "pl-ambience-c", dev: "dv-ambience-c", chip: true },
  },
  {
    key: "vatika",
    slug: "vatika-seven-elements-sector-89a-gurgaon",
    name: "Vatika Seven Elements",
    developer: "Vatika Group",
    location: "Sector 89A, New Gurgaon",
    price: "2.60 Cr.",
    logo: [164, 180],
    place: {
      head: "2, 3 & 4 BHK",
      sub: "Residences & Penthouses",
      info: "right",
      top: "18%",
      theme: "light",
      brand: "stack",
      logo: { v: "c", w: 186, h: 200 },
      dev: { k: "vatika", v: "c", w: 182, h: 120 },
    },
    mobile: { bg: "#bed4e3", light: true },
  },
  {
    key: "monsella",
    slug: "tulip-monsella-sector-53-gurgaon",
    name: "Tulip Monsella",
    developer: "Tulip Infratech",
    location: "Sector 53, Golf Course Road",
    price: "7.99 Cr.",
    logo: [297, 180],
    place: {
      head: "3.5, 4.5 & 5.5 BHK",
      info: "left",
      x: "60%",
      top: "17%",
      theme: "light",
      brand: "tl",
      logo: { v: "g", w: 299, h: 200 },
      dev: { k: "tulip", v: "g", w: 323, h: 120 },
    },
    mobile: { bg: "#1e4978" },
  },
  {
    key: "crimson",
    slug: "tulip-crimson-sector-70-gurgaon",
    name: "Tulip Crimson",
    developer: "Tulip Infratech",
    location: "Sector 70, Southern Peripheral Road",
    price: "4.78 Cr.",
    logo: [207, 180],
    place: {
      head: "4 BHK",
      info: "left",
      top: "22%",
      theme: "dark",
      brand: "tr",
      logo: { v: "c", w: 231, h: 200 },
      dev: { k: "tulip", w: 323, h: 120 },
    },
    mobile: { bg: "#a9cdee", light: true },
  },
  {
    key: "melrose",
    slug: "tulip-melrose-sector-70-gurgaon",
    name: "Tulip Melrose",
    developer: "Tulip Infratech",
    location: "Sector 70, Southern Peripheral Road",
    price: "4.74 Cr.",
    logo: [900, 280],
    place: {
      head: "5.5 BHK",
      info: "left",
      top: "22%",
      theme: "dark",
      brand: "tr",
      logo: { v: "hd", w: 900, h: 280 },
      dev: { k: "tulip", w: 323, h: 120 },
    },
    mobile: { bg: "#77b5f5", light: true, logo: "pl-melrose-hd" },
  },
];
