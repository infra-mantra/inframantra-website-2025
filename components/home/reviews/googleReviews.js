/* Curated real Google reviews for Inframantra (positive, with comments),
   used as the displayed Google reviews until the live Places API is enabled
   (it needs billing + a Place ID). When the live API returns reviews, those
   replace this list automatically — see ReviewsWall.jsx. Light copy cleanup
   only (typos / truncation markers removed); meaning preserved. */

export const staticGoogleReviews = [
  {
    name: "Ashish Dhandhania",
    text: "A note for Suchita, the CRM who I felt is very genuine in her approach — I have been very happy with your honest services. You have been the sole reason I stuck with Vatika Seven Elements, rather than withdrawing my money. It was a challenge initially due to a collaborative unit and a potential title issue, but your honest suggestions gave me a lot of comfort and helped me find a way to proceed. Your constant connect and updates really helped. A true customer support — I really appreciate the work.",
  },
  {
    name: "Yuvraj Singh Rana",
    text: "Inframantra is a highly reliable and client-focused real estate consultancy that truly stands out for its commitment to trust and transparency. What makes the company exceptional is its genuine approach toward helping clients make the right decision.",
  },
  {
    name: "Davender Taneja",
    text: "I would like to appreciate Ms. Sucheta from Inframantra for her excellent support and dedicated approach. She is knowledgeable, polite, and always ready to guide with clarity and honesty.",
  },
  {
    name: "Bhavesh Sharma",
    text: "It was a great experience with Inframantra. They knew what we wanted and delivered with great efficiency. Highly recommended — best real estate company in Gurgaon!",
  },
  {
    name: "Himanshu Soni",
    text: "Had a wonderful experience working with Rahul from Inframantra. He was never pushy and helped me in buying my dream home. I wish Rahul and Inframantra all the success and more happy clients in the times to come.",
  },
  {
    name: "Jayant Gupta",
    text: "Usually people in real estate are only interested in selling a property and don't care much about the buyer. I worked with Rahul Thakur — a genuine person who cares about customer interest. I would recommend him as a property consultant.",
  },
  {
    name: "Ashish Basak",
    text: "Very professional, always ready to help. Helped me reach my final decision for buying a home near Dwarka Expressway. Great team, specially Rahul, Ayush and Jayant. Keep it up!",
  },
  {
    name: "Renu Vasishtha",
    text: "I had a very good experience with the team. I especially want to thank Suchitra — she was so helpful through the whole process. Very hardworking and humble. Thank you so much!",
  },
  {
    name: "Anish Gupta",
    text: "Very professional guys. Kudos to the entire team of Inframantra. The way of working and execution of the deal was very smooth.",
  },
  {
    name: "Dinesh Ahuja",
    text: "I bought my first home through Inframantra. I was very cautious while selecting a channel partner for my first home deal, but fortunately came across Inframantra and they made the journey smooth.",
  },
  {
    name: "Shweta Sachan",
    text: "One of the best decisions one can make is choosing Inframantra if you are planning to buy a home. Professionalism is on point and amazing hassle-free service provided by them.",
  },
  {
    name: "Nitish Prasad",
    text: "Always prefer and trust Inframantra in real estate. It was a really wonderful experience with these guys in choosing the best option. So thankful to them.",
  },
  {
    name: "Dileep Singh Kansana",
    text: "The product understanding is excellent and they really understand the consumer's mind with economic feasibility for the product.",
  },
  {
    name: "Ravi Malhotra",
    text: "Great services with honest pricing and personal support. Highly recommend!",
  },
  {
    name: "Jay Singh",
    text: "One of the best proptech real estate companies as of now. I suggest everyone to go with Inframantra.",
  },
  {
    name: "Aayushi Malik",
    text: "Great experience. A one-step solution for your real estate queries, with a highly professional team.",
  },
  {
    name: "Gaurav Kapur",
    text: "An organization with a lot of experience who believe in working with transparency and clear thoughts.",
  },
  {
    name: "Sumon M. Somu",
    text: "Best property dealer in town with the best price and flexibility on the deal. You can feel the friendly behaviour. Everyone should try.",
  },
  {
    name: "Anmol Kumar",
    text: "If you are looking for a property in Gurugram, this is the place you need to contact. A one-stop solution.",
  },
  {
    name: "Medha Tripathi",
    text: "It's the most trusted real estate company in Gurgaon.",
  },
  {
    name: "Anuj Gupta",
    text: "Very good company to start your career in real estate.",
  },
].map((r, i) => ({
  id: `g-static-${i}`,
  name: r.name,
  role: "Google Review",
  text: r.text,
  rating: 5,
  avatar: "",
  source: "google",
}));
