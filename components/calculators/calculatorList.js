import { FiHome, FiPieChart, FiTarget } from "react-icons/fi";

/* Single source of truth for the calculator cards/links, reused by the hub
   page and the "Related calculators" footer on each sub-page. */

export const CALCULATORS = [
  {
    slug: "home-loan-emi",
    href: "/calculators/home-loan-emi",
    Icon: FiHome,
    title: "Home Loan EMI Calculator",
    desc: "Estimate your monthly instalment for any loan amount, interest rate and tenure, with a full year-by-year breakup.",
  },
  {
    slug: "loan-eligibility",
    href: "/calculators/loan-eligibility",
    Icon: FiPieChart,
    title: "Loan Eligibility Calculator",
    desc: "See how much home loan you qualify for based on your monthly salary and existing obligations.",
  },
  {
    slug: "home-buying-plan",
    href: "/calculators/home-buying-plan",
    Icon: FiTarget,
    title: "Make Your Purpose a Plan",
    desc: "Set a target home and date to know your monthly savings, or check the home your budget can buy today.",
  },
];
