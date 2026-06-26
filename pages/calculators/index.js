import React from "react";
import Link from "next/link";
import Wrapper from "../../components/UI/Wrapper";
import CalcHero from "../../components/calculators/CalcHero";
import CalculatorCards from "../../components/calculators/CalculatorCards";
import HowItWorks from "../../components/calculators/HowItWorks";
import LeadForm from "../../components/calculators/LeadForm";
import FaqBlock from "../../components/calculators/FaqBlock";
import styles from "../../components/calculators/calculators.module.css";

const faqs = [
  {
    question: "What financial calculators does Inframantra offer?",
    answer:
      "Inframantra offers a free Home Loan EMI Calculator, a Loan Eligibility Calculator based on your salary, and a home-buying planner that tells you how much to save each month or the property you can afford today.",
  },
  {
    question: "Are these property calculators free to use?",
    answer:
      "Yes. All Inframantra calculators are completely free, work instantly in your browser and do not require any sign-up or login.",
  },
  {
    question: "How accurate are the calculator results?",
    answer:
      "The results are indicative estimates based on standard banking formulas (reducing-balance EMI, FOIR-based eligibility and 80% loan-to-value). Your actual loan amount, interest rate and EMI depend on your lender, credit score and property valuation.",
  },
  {
    question: "Can Inframantra help with my home loan?",
    answer:
      "Inframantra's core service is helping you find and buy the right RERA-approved property. Alongside that, our advisors offer home loan assistance — connecting you with options from top lenders and helping with the documentation. Submit the enquiry form and we'll get in touch.",
  },
];

const steps = [
  {
    title: "Pick a calculator",
    text: "Choose the EMI, eligibility or home-buying planner depending on what you want to work out.",
  },
  {
    title: "Move the sliders",
    text: "Enter your loan amount, income or target home. Results, charts and tables update instantly.",
  },
  {
    title: "Plan your purchase",
    text: "Use the numbers to shortlist properties in your budget and talk to an Inframantra advisor.",
  },
];

function CalculatorsHub() {
  return (
    <Wrapper
      title="Home Loan & Property Calculators | Inframantra"
      description="Free home loan EMI calculator, loan eligibility calculator based on salary and a home-buying planner. Plan your property purchase with Inframantra's instant calculators."
      keyword="home loan calculator, EMI calculator, loan eligibility calculator, home affordability calculator, property calculator India, Inframantra"
      faq={faqs}
    >
      <CalcHero
        title="Property & Home Loan"
        highlight="Calculators"
        lede="Make confident property decisions with Inframantra's free calculators. Work out your EMI, check the loan your salary qualifies for, and turn your home-buying dream into a clear month-by-month plan."
        badges={["100% free", "Instant results", "No sign-up", "RERA-approved properties"]}
      />

      <div className={styles.shell}>
        <div className={styles.statStrip}>
          <div className={styles.stat}>
            <span className={styles.statValue}>3</span>
            <span className={styles.statLabel}>Smart calculators</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>₹0</span>
            <span className={styles.statLabel}>Cost to use</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>30 yrs</span>
            <span className={styles.statLabel}>Max tenure modelled</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>10s</span>
            <span className={styles.statLabel}>To your answer</span>
          </div>
        </div>

        <CalculatorCards />

        <HowItWorks steps={steps} />

        <section className={styles.seoContent}>
          <h2>Free home loan and property calculators, online and instant</h2>
          <p>
            Buying a home is the biggest financial decision most families make,
            and small differences in interest rate, tenure or down payment can
            change your total cost by lakhs of rupees. Inframantra&apos;s free
            home loan calculator and property calculator tools put that maths in
            your hands so you can plan your purchase with confidence instead of
            guesswork. Every calculator works instantly in your browser, with no
            sign-up and no cost.
          </p>
          <h3>Which property calculator should I use?</h3>
          <ul>
            <li>
              <Link href="/calculators/home-loan-emi">
                <a><strong>Home Loan EMI Calculator</strong></a>
              </Link>{" "}
              — already know your loan amount? Our EMI calculator shows your
              exact monthly instalment, total interest payable and a
              year-by-year payment breakup for any loan amount, interest rate
              and tenure.
            </li>
            <li>
              <Link href="/calculators/loan-eligibility">
                <a><strong>Loan Eligibility Calculator</strong></a>
              </Link>{" "}
              — not sure how much you can borrow? This home loan eligibility
              calculator uses your monthly salary and existing obligations to
              show the loan and property budget you qualify for.
            </li>
            <li>
              <Link href="/calculators/home-buying-plan">
                <a><strong>Home Buying Planner</strong></a>
              </Link>{" "}
              — buying in a few years? Use this home affordability calculator to
              find the monthly savings target for your down payment, or check the
              home your budget can buy today.
            </li>
          </ul>
          <h3>How a home loan EMI calculator helps you plan</h3>
          <p>
            A home loan EMI calculator uses the standard reducing-balance
            formula to turn your loan amount, interest rate and tenure into a
            single monthly figure, so you can compare lenders and tenures before
            you commit. Pair it with the loan eligibility calculator to confirm
            the amount a bank is likely to sanction on your salary, then use the
            home affordability calculator to map out a realistic down payment and
            buying timeline. Together, these property calculators give you a
            clear, month-by-month picture of what your next home will really
            cost.
          </p>
          <p>
            Once you know your numbers, browse thousands of RERA-approved
            apartments, villas and plots across Gurgaon, Delhi NCR and beyond —
            and let an Inframantra advisor help you find the right property, with
            home loan assistance and documentation support along the way.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <LeadForm
          projectName="Calculators - Hub"
          heading="Ready to take the next step?"
          sub="Tell us a little about your plans and an Inframantra advisor will help you find a matching property, with home loan assistance along the way — completely free."
        />
      </div>
    </Wrapper>
  );
}

export default CalculatorsHub;
