/* The site's existing ("current") testimonials, normalised to the review-wall
   shape. Merged with the Google reviews in the wall. */

export const currentReviews = [
  {
    name: "Manish Himthani",
    text: "I am so glad that I found Inframantra. They were patient and helpful throughout the process. The Inframantra property expert listened to my needs and expectations and showed us the best properties in the prime locations of the city. My journey of finding my dream home was stress-free and hassle-free. Thank you INFRAMANTRA!",
    avatar:
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/manishhimthani/manishhimthani.png",
  },
  {
    name: "Amit Verma",
    text: "It was an absolute pleasure dealing with Inframantra. They are not only dedicated but also efficient. Apart from providing complete information about the properties, they made sure I had options to choose from. Be it property site visit or documentation, every step was seamless. I found my home with Inframantra. Highly recommended!",
    avatar:
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/amitverma/amitverma.png",
  },
  {
    name: "Deepika Grover",
    text: "I am a happy home-owner in Gurgaon today, all thanks to Inframantra. The entire process was very seamless, be it site visit or finding best loan options, documentation or key-handover, everything was on time and efficiently managed. We would highly recommend Inframantra.",
    avatar:
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/deepikagrover/client1.png",
  },
  {
    name: "Alka Sharma",
    text: "Very helpful and experienced team, dedicated professionals, timely delivery of service, and seamless communication. In short - fantastic experience. Highly recommended!",
    avatar:
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/alkasharma/client2.png",
  },
].map((c, i) => ({
  id: `c-${i}`,
  name: c.name,
  role: "Verified Buyer",
  text: c.text,
  rating: 5,
  avatar: c.avatar || "",
  source: "inframantra",
}));
