import React from "react";
import Wrapper from "../../components/UI/Wrapper";
import EmiCalculator from "../../components/newComponents/propertyIndividualPage/emiCalculator";
import CalcHero from "../../components/calculators/CalcHero";
import HowItWorks from "../../components/calculators/HowItWorks";
import LeadForm from "../../components/calculators/LeadForm";
import RelatedCalculators from "../../components/calculators/RelatedCalculators";
import FaqBlock from "../../components/calculators/FaqBlock";
import styles from "../../components/calculators/calculators.module.css";

const faqs = [
  {
    question: "How is the home loan EMI calculated?",
    answer:
      "EMI is calculated using the reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments. Our calculator applies this automatically as you move the sliders.",
  },
  {
    question: "What is a good interest rate for a home loan in India?",
    answer:
      "Home loan interest rates in India typically range between 8% and 9.5% per annum, depending on the lender, your credit score and loan amount. Try different rates in the calculator to see how each affects your EMI.",
  },
  {
    question: "Does a longer tenure reduce my EMI?",
    answer:
      "Yes. A longer tenure lowers your monthly EMI but increases the total interest you pay over the life of the loan. A shorter tenure raises the EMI but saves on overall interest. The year-by-year breakup shows this clearly.",
  },
  {
    question: "Can I prepay my home loan to save interest?",
    answer:
      "Most lenders allow prepayment of floating-rate home loans without penalty. Prepaying reduces your outstanding principal and the total interest payable. Use the outstanding-balance chart to see how your loan reduces over time.",
  },
  {
    question: "What is the maximum home loan tenure in India?",
    answer:
      "Most banks offer home loan tenures of up to 30 years, subject to your age at loan maturity (usually capped at 60–70 years). This calculator lets you model tenures from 1 to 30 years.",
  },
];

const steps = [
  {
    title: "Enter your loan amount",
    text: "Set the amount you plan to borrow — either the full property price or the price minus your down payment.",
  },
  {
    title: "Set rate & tenure",
    text: "Adjust the interest rate offered by your bank and how many years you want to repay over.",
  },
  {
    title: "Review the breakup",
    text: "See your monthly EMI, total interest, payment charts and the full year-by-year schedule.",
  },
];

function HomeLoanEmiPage() {
  return (
    <Wrapper
      title="Home Loan EMI Calculator | Inframantra"
      description="Calculate your home loan EMI online for free. Adjust loan amount, interest rate and tenure to see your monthly instalment, total interest and a year-by-year payment breakup."
      keyword="home loan EMI calculator, EMI calculator, housing loan EMI, monthly EMI calculator, home loan interest calculator India"
      faq={faqs}
    >
      <CalcHero
        crumbLeaf="Home Loan EMI"
        title="Home Loan"
        highlight="EMI Calculator"
        lede="Estimate your monthly home loan instalment in seconds. Adjust the loan amount, interest rate and tenure to see exactly how much principal and interest you pay each year."
        badges={["Reducing-balance method", "Full amortization schedule", "Visual charts"]}
      />

      <div className={styles.shell}>
        <EmiCalculator />

        <HowItWorks steps={steps} />

        <section className={styles.seoContent}>
          <h2>Understand your home loan EMI</h2>
          <p>
            Your EMI (Equated Monthly Instalment) is the fixed amount you pay
            your lender every month until the loan is fully repaid. Each EMI is
            split into two parts — interest on the outstanding balance and
            repayment of the principal. In the early years most of the EMI goes
            towards interest; as the balance falls, more of it pays down the
            principal. The charts above visualise exactly this shift.
          </p>
          <h3>How to reduce your total interest</h3>
          <ul>
            <li>Choose a shorter tenure if your budget allows a higher EMI.</li>
            <li>Make a larger down payment so you borrow less.</li>
            <li>Negotiate a lower interest rate or transfer your loan to a cheaper lender.</li>
            <li>Make part-prepayments whenever you have surplus funds.</li>
          </ul>
          <p>
            Once you&apos;re comfortable with the EMI, check how much loan your
            salary supports with our{" "}
            <a href="/calculators/loan-eligibility">Loan Eligibility Calculator</a>{" "}
            and plan your down payment with the{" "}
            <a href="/calculators/home-buying-plan">Home Buying Planner</a>.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <LeadForm
          projectName="Calculators - Home Loan EMI"
          heading="Need help with your home loan?"
          sub="Alongside finding you the right property, our advisors offer home loan assistance — connecting you with options from top lenders and helping with the documentation, at no cost to you."
        />

        <RelatedCalculators exclude="home-loan-emi" />
      </div>
    </Wrapper>
  );
}

export default HomeLoanEmiPage;
