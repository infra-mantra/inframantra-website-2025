import React from "react";
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
    question: "Can Inframantra help me get a home loan?",
    answer:
      "Yes. Beyond the calculators, our advisors help you compare lenders, get the best interest rate and complete the paperwork, alongside finding a RERA-approved property that fits your budget. Submit the enquiry form and we'll get in touch.",
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
          <h2>Plan every rupee of your home purchase</h2>
          <p>
            Buying a home is the biggest financial decision most families make,
            and small differences in interest rate, tenure or down payment can
            change your total cost by lakhs of rupees. Inframantra&apos;s property
            calculators put that maths in your hands so you can plan with
            confidence instead of guesswork.
          </p>
          <h3>Which calculator should I use?</h3>
          <ul>
            <li>
              <strong>Home Loan EMI Calculator</strong> — already know your loan
              amount? See your exact monthly instalment, total interest and a
              year-by-year payment breakup.
            </li>
            <li>
              <strong>Loan Eligibility Calculator</strong> — not sure how much
              you can borrow? Enter your salary to see the loan and property
              budget you qualify for.
            </li>
            <li>
              <strong>Home Buying Planner</strong> — buying in a few years? Find
              the monthly savings target for your down payment, or check the home
              your budget can buy today.
            </li>
          </ul>
          <p>
            Once you know your numbers, browse thousands of RERA-approved
            apartments, villas and plots across Gurgaon, Delhi NCR and beyond —
            and let an Inframantra advisor help you close the right deal.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <LeadForm
          projectName="Calculators - Hub"
          heading="Ready to take the next step?"
          sub="Tell us a little about your plans and an Inframantra advisor will help you with loans and matching properties — completely free."
        />
      </div>
    </Wrapper>
  );
}

export default CalculatorsHub;
