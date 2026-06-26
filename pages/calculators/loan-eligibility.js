import React from "react";
import Wrapper from "../../components/UI/Wrapper";
import EligibilityCalculator from "../../components/calculators/EligibilityCalculator";
import CalcHero from "../../components/calculators/CalcHero";
import HowItWorks from "../../components/calculators/HowItWorks";
import LeadForm from "../../components/calculators/LeadForm";
import RelatedCalculators from "../../components/calculators/RelatedCalculators";
import FaqBlock from "../../components/calculators/FaqBlock";
import styles from "../../components/calculators/calculators.module.css";

const faqs = [
  {
    question: "How is home loan eligibility calculated from salary?",
    answer:
      "Lenders use a Fixed Obligations to Income Ratio (FOIR). Your maximum affordable EMI is roughly 50–60% of your net monthly income minus your existing EMIs. That EMI is then converted into the largest loan it can support at the chosen interest rate and tenure.",
  },
  {
    question: "What salary do I need for a 50 lakh home loan?",
    answer:
      "As a rough guide, a ₹50 lakh loan over 20 years at 8.5% needs an EMI of about ₹43,000, which usually requires a net monthly income of around ₹85,000–₹90,000 with no other EMIs. Enter your own numbers above for a personalised estimate.",
  },
  {
    question: "Do existing EMIs reduce my loan eligibility?",
    answer:
      "Yes. Any existing car loan, personal loan or credit-card EMI is deducted from the income available for a new home loan, which lowers your eligibility. Reducing existing obligations increases the loan you qualify for.",
  },
  {
    question: "How can I increase my home loan eligibility?",
    answer:
      "You can increase eligibility by adding a co-applicant's income, choosing a longer tenure, closing existing loans, improving your credit score, or making a larger down payment so you need a smaller loan.",
  },
  {
    question: "Does my credit score affect eligibility?",
    answer:
      "Yes. A higher CIBIL score (typically 750+) improves your chances of approval and can get you a lower interest rate, which in turn increases the loan amount you qualify for at the same EMI.",
  },
];

const steps = [
  {
    title: "Enter your income",
    text: "Add your net monthly salary and any existing EMIs or loan obligations you currently pay.",
  },
  {
    title: "Set rate & tenure",
    text: "Pick the interest rate and the number of years you'd like to repay the loan over.",
  },
  {
    title: "See your eligibility",
    text: "Get your eligible loan amount, affordable EMI and the property budget it unlocks, with charts and rate comparisons.",
  },
];

function LoanEligibilityPage() {
  return (
    <Wrapper
      title="Home Loan Eligibility Calculator Based on Salary | Inframantra"
      description="Check your home loan eligibility based on your monthly salary. See how much loan you qualify for, your affordable EMI and the property budget it supports — instantly and free."
      keyword="loan eligibility calculator, home loan eligibility based on salary, how much home loan can I get, FOIR calculator, home loan eligibility India"
      faq={faqs}
    >
      <CalcHero
        crumbLeaf="Loan Eligibility"
        title="Home Loan"
        highlight="Eligibility Calculator"
        lede="Find out how much home loan you can get based on your salary. Enter your income, existing EMIs, interest rate and tenure to see your eligible loan amount and property budget."
        badges={["FOIR-based estimate", "Rate comparison table", "Property budget"]}
      />

      <div className={styles.shell}>
        <EligibilityCalculator />

        <HowItWorks steps={steps} />

        <section className={styles.seoContent}>
          <h2>How much home loan can you get on your salary?</h2>
          <p>
            Banks decide your home loan eligibility primarily on your repayment
            capacity, measured through the Fixed Obligations to Income Ratio
            (FOIR). In simple terms, your total monthly EMIs — including the new
            home loan — should not exceed 50–60% of your net monthly income. The
            higher your income and the fewer your existing obligations, the
            larger the loan you qualify for.
          </p>
          <h3>What lenders look at</h3>
          <ul>
            <li><strong>Net monthly income</strong> — higher take-home pay means higher eligibility.</li>
            <li><strong>Existing EMIs</strong> — car loans, personal loans and credit-card dues reduce the income available for a home loan.</li>
            <li><strong>Loan tenure</strong> — a longer tenure lowers the EMI and raises eligibility.</li>
            <li><strong>Interest rate</strong> — a lower rate means a bigger loan at the same EMI.</li>
            <li><strong>Credit score</strong> — a strong CIBIL score improves both approval odds and the rate offered.</li>
          </ul>
          <p>
            Use the rate-comparison table above to see how even a 0.5% difference
            in interest changes your eligible amount. Then estimate the monthly
            instalment with our{" "}
            <a href="/calculators/home-loan-emi">Home Loan EMI Calculator</a>.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <LeadForm
          projectName="Calculators - Loan Eligibility"
          heading="Found your number? Let's find the home."
          sub="Our advisors help you find a RERA-approved property that fits your budget, and offer home loan assistance with options from top lenders and the documentation. Free, no obligation."
        />

        <RelatedCalculators exclude="loan-eligibility" />
      </div>
    </Wrapper>
  );
}

export default LoanEligibilityPage;
