import React from "react";
import Wrapper from "../../components/UI/Wrapper";
import PlanCalculator from "../../components/calculators/PlanCalculator";
import CalcHero from "../../components/calculators/CalcHero";
import HowItWorks from "../../components/calculators/HowItWorks";
import LeadForm from "../../components/calculators/LeadForm";
import RelatedCalculators from "../../components/calculators/RelatedCalculators";
import FaqBlock from "../../components/calculators/FaqBlock";
import styles from "../../components/calculators/calculators.module.css";

const faqs = [
  {
    question: "How much should I save each month to buy a home?",
    answer:
      "Start with your down payment target — usually 20% of the home price. In 'Plan a goal' mode, enter the home price, when you want to buy and your current savings, and the calculator tells you the monthly amount to save, accounting for returns on your savings.",
  },
  {
    question: "How much down payment do I need for a house in India?",
    answer:
      "Banks typically finance up to 80% of the property value, so you need at least a 20% down payment plus registration and stamp-duty costs. The planner uses a 20% down payment assumption by default.",
  },
  {
    question: "How do I know what home I can afford?",
    answer:
      "Switch to 'What can I afford' mode and enter your income, the EMI you can comfortably pay, your savings, interest rate and tenure. The calculator shows the maximum property price you can buy, split into the loan and your down payment.",
  },
  {
    question: "Should I wait and save more or buy now with a loan?",
    answer:
      "It depends on rents, property appreciation and your savings returns. Use 'Plan a goal' to see the monthly saving for a future purchase and 'What can I afford' to see what's possible today, then compare the EMI in both against your budget.",
  },
  {
    question: "Does the planner account for returns on my savings?",
    answer:
      "Yes. In goal mode you can set an expected annual return on your savings (for example from a recurring deposit or mutual fund SIP). The calculator compounds your monthly savings at that rate, so you save a little less to reach the same target.",
  },
];

const steps = [
  {
    title: "Choose your mode",
    text: "Pick 'Plan a goal' to save towards a future home, or 'What can I afford' to see what your budget buys today.",
  },
  {
    title: "Enter your numbers",
    text: "Add your target home or income, savings and timeline. The planner does the compounding and loan maths for you.",
  },
  {
    title: "Act on the plan",
    text: "Get your monthly savings target or maximum price, with charts and tables, then shortlist matching homes.",
  },
];

function HomeBuyingPlanPage() {
  return (
    <Wrapper
      title="Home Buying Plan & Affordability Calculator | Inframantra"
      description="Turn your home-buying dream into a plan. See how much to save each month for your target home, or find the property you can afford today based on your income and budget."
      keyword="home affordability calculator, home buying planner, how much house can I afford, down payment savings calculator, property goal planner India"
      faq={faqs}
    >
      <CalcHero
        crumbLeaf="Home Buying Plan"
        title="Make Your Purpose"
        highlight="a Plan"
        lede="Two tools in one. Set a target home and date to discover your monthly savings goal, or enter your income and budget to see the property you can afford right now."
        badges={["Goal planner", "Affordability mode", "Savings + EMI charts"]}
      />

      <div className={styles.shell}>
        <PlanCalculator />

        <HowItWorks steps={steps} />

        <section className={styles.seoContent}>
          <h2>From home-buying dream to a concrete plan</h2>
          <p>
            Most people know the home they want but not the path to afford it.
            This planner bridges that gap. In <strong>goal mode</strong>, you set
            a target home price and a date, and it calculates the exact amount to
            save every month for your 20% down payment — compounding your savings
            at the return you expect. In <strong>affordability mode</strong>, you
            enter what you earn and can comfortably pay, and it reveals the
            maximum property price within reach today.
          </p>
          <h3>Why a down payment plan matters</h3>
          <ul>
            <li>A bigger down payment means a smaller loan and lower lifetime interest.</li>
            <li>Saving steadily towards a goal beats scrambling for funds at the last minute.</li>
            <li>Knowing your affordable price prevents overstretching on EMIs.</li>
          </ul>
          <p>
            When your plan is ready, confirm the instalment with our{" "}
            <a href="/calculators/home-loan-emi">EMI Calculator</a> and check the
            loan your salary supports with the{" "}
            <a href="/calculators/loan-eligibility">Eligibility Calculator</a>.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <LeadForm
          projectName="Calculators - Home Buying Plan"
          heading="Turn your plan into a home"
          sub="Share your goal and an Inframantra advisor will help you find a property that fits your budget and timeline — free of cost."
        />

        <RelatedCalculators exclude="home-buying-plan" />
      </div>
    </Wrapper>
  );
}

export default HomeBuyingPlanPage;
