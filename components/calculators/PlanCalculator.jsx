import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import styles from "./Calculators.module.css";
import SplitDonut from "./SplitDonut.jsx";
import MiniBarChart from "./MiniBarChart.jsx";
import AnimatedNumber from "./AnimatedNumber.jsx";
import { formatINR, formatShort, emiFor, maxLoanForEmi, sanitizeAmount } from "./calcUtils.js";

// Monthly saving needed to reach a future amount, given a monthly return.
function monthlySavingFor(gap, months, annualReturn) {
  if (months <= 0) return gap;
  const r = annualReturn / 12 / 100;
  if (r === 0) return gap / months;
  return (gap * r) / (Math.pow(1 + r, months) - 1);
}

/* "Make Your Purpose a Plan" -------------------------------------------
   Two modes in one tool:
     goal   -> set a target home & date, see what to save each month
     afford -> set income & budget, see the home you can buy today
----------------------------------------------------------------------- */

const DOWN_PCT = 0.2; // 20% down payment, banks fund the rest

function fill(value, min, max) {
  return ((value - min) / (max - min)) * 100;
}

function PlanCalculator() {
  const [mode, setMode] = useState("goal"); // "goal" | "afford"

  // --- Goal mode inputs ---
  const [target, setTarget] = useState(10000000); // 1 Cr
  const [years, setYears] = useState(5);
  const [savings, setSavings] = useState(500000);
  const [returns, setReturns] = useState(8); // expected p.a. on savings
  const [goalRate, setGoalRate] = useState(8.5);
  const [goalTenure, setGoalTenure] = useState(20);

  // --- Afford mode inputs ---
  const [income, setIncome] = useState(120000);
  const [budget, setBudget] = useState(40000); // monthly EMI you can pay
  const [haveSavings, setHaveSavings] = useState(1500000);
  const [affRate, setAffRate] = useState(8.5);
  const [affTenure, setAffTenure] = useState(20);

  const trackStyle = (value, min, max) => ({
    background: `linear-gradient(to right, var(--c-accent) 0%, var(--c-accent) ${fill(
      value,
      min,
      max
    )}%, #ececec ${fill(value, min, max)}%, #ececec 100%)`,
  });

  /* ---- Goal: monthly savings needed for the down payment ---- */
  const goal = useMemo(() => {
    const downPayment = target * DOWN_PCT;
    const gap = Math.max(downPayment - savings, 0);
    const months = years * 12;
    const monthlySaving = monthlySavingFor(gap, months, returns);
    const loan = target - downPayment;
    const emi = emiFor(loan, goalRate, goalTenure);
    return { downPayment, gap, monthlySaving, loan, emi };
  }, [target, years, savings, returns, goalRate, goalTenure]);

  /* ---- Afford: biggest home this budget buys ---- */
  const afford = useMemo(() => {
    const loan = maxLoanForEmi(budget, affRate, affTenure);
    // Down payment is whichever caps the deal: savings on hand, or 20% of the
    // price the loan supports. Use savings, but never less than 20% of price.
    const priceFromLoan = loan / (1 - DOWN_PCT);
    const priceFromSavings = haveSavings / DOWN_PCT;
    const maxPrice = Math.min(priceFromLoan, priceFromSavings);
    const usedLoan = maxPrice * (1 - DOWN_PCT);
    const downPayment = maxPrice - usedLoan;
    return { maxPrice, usedLoan, downPayment };
  }, [budget, haveSavings, affRate, affTenure]);

  const incomeRatio = budget > 0 && income > 0 ? (budget / income) * 100 : 0;

  // Goal: monthly saving needed across different time horizons (bar chart).
  const goalScenarios = useMemo(() => {
    const downPayment = target * DOWN_PCT;
    const gap = Math.max(downPayment - savings, 0);
    return [3, 5, 7, 10, 15].map((y) => ({
      label: `${y}y`,
      value: monthlySavingFor(gap, y * 12, returns),
    }));
  }, [target, savings, returns]);

  // Afford: max property price across tenures (comparison table).
  const affordScenarios = useMemo(() => {
    return [10, 15, 20, 25, 30].map((t) => {
      const loan = maxLoanForEmi(budget, affRate, t);
      const priceFromLoan = loan / (1 - DOWN_PCT);
      const priceFromSavings = haveSavings / DOWN_PCT;
      const price = Math.min(priceFromLoan, priceFromSavings);
      return {
        tenure: t,
        price,
        loan: price * (1 - DOWN_PCT),
        current: t === affTenure,
      };
    });
  }, [budget, haveSavings, affRate, affTenure]);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Make Your Purpose a Plan</h2>
      <p className={styles.sub}>
        Turn your home-buying dream into a concrete plan. Either set a target home and date to see
        how much to save each month, or enter your budget to see the home you can buy right now.
      </p>

      <div className={styles.modeToggle} role="group" aria-label="Calculator mode">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "goal" ? styles.active : ""}`}
          onClick={() => setMode("goal")}
        >
          Plan a goal
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "afford" ? styles.active : ""}`}
          onClick={() => setMode("afford")}
        >
          What can I afford
        </button>
      </div>

      {/* ============================ GOAL MODE ============================ */}
      {mode === "goal" && (
        <div className={styles.body}>
          <div className={styles.controls}>
            {/* Target home price */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="g-target">Target Home Price</label>
                <div className={styles.amountBox}>
                  <span className={styles.rupee}>₹</span>
                  <input
                    id="g-target"
                    type="text"
                    inputMode="numeric"
                    value={target.toLocaleString("en-IN")}
                    onChange={(e) => setTarget(sanitizeAmount(e.target.value, 200000000))}
                  />
                </div>
              </div>
              <input
                type="range"
                min={2000000}
                max={100000000}
                step={500000}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(target, 2000000, 100000000)}
                aria-label="Target home price"
              />
              <div className={styles.rangeHints}>
                <span>{formatShort(2000000)}</span>
                <span>{formatShort(100000000)}</span>
              </div>
            </div>

            {/* Years to purchase */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="g-years">Buy In (Years)</label>
                <div className={styles.amountBox}>
                  <input
                    id="g-years"
                    type="number"
                    min={1}
                    max={20}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                  <span className={styles.unit}>Yr</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(years, 1, 20)}
                aria-label="Years to purchase"
              />
              <div className={styles.rangeHints}>
                <span>1 Yr</span>
                <span>20 Yr</span>
              </div>
            </div>

            {/* Current savings */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="g-savings">Current Savings</label>
                <div className={styles.amountBox}>
                  <span className={styles.rupee}>₹</span>
                  <input
                    id="g-savings"
                    type="text"
                    inputMode="numeric"
                    value={savings.toLocaleString("en-IN")}
                    onChange={(e) => setSavings(sanitizeAmount(e.target.value, 200000000))}
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(target * DOWN_PCT, 1000000)}
                step={50000}
                value={Math.min(savings, Math.max(target * DOWN_PCT, 1000000))}
                onChange={(e) => setSavings(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(
                  Math.min(savings, Math.max(target * DOWN_PCT, 1000000)),
                  0,
                  Math.max(target * DOWN_PCT, 1000000)
                )}
                aria-label="Current savings"
              />
              <div className={styles.rangeHints}>
                <span>₹0</span>
                <span>{formatShort(Math.max(target * DOWN_PCT, 1000000))}</span>
              </div>
            </div>

            {/* Expected return on savings */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="g-returns">Expected Return on Savings (% p.a.)</label>
                <div className={styles.amountBox}>
                  <input
                    id="g-returns"
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={returns}
                    onChange={(e) => setReturns(Number(e.target.value))}
                  />
                  <span className={styles.unit}>%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={returns}
                onChange={(e) => setReturns(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(returns, 0, 15)}
                aria-label="Expected return on savings"
              />
              <div className={styles.rangeHints}>
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          <div className={styles.result}>
            <div className={styles.resultLead}>
              <span className={styles.resultLeadLabel}>Save each month for {years} years</span>
              <span className={styles.resultLeadValue}>
                <AnimatedNumber value={goal.monthlySaving} format={formatINR} />
              </span>
              <span className={styles.resultLeadNote}>
                to reach your {formatShort(goal.downPayment)} down payment
              </span>
            </div>

            <ul className={styles.breakdown}>
              <li>
                <span className={`${styles.dot} ${styles.dotPrincipal}`} />
                <span className={styles.bLabel}>Down payment needed (20%)</span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={goal.downPayment} format={formatINR} />
                </span>
              </li>
              <li>
                <span className={`${styles.dot} ${styles.dotInterest}`} />
                <span className={styles.bLabel}>Still to save</span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={goal.gap} format={formatINR} />
                </span>
              </li>
              <li>
                <span className={styles.bLabel} style={{ paddingLeft: 20 }}>
                  Home loan at purchase
                </span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={goal.loan} format={formatINR} />
                </span>
              </li>
              <li className={styles.totalRow}>
                <span className={styles.bLabel}>
                  Future EMI (~{goalRate}%, {goalTenure}y)
                </span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={goal.emi} format={formatINR} />
                  /mo
                </span>
              </li>
            </ul>

            <SplitDonut
              primary={Math.min(savings, goal.downPayment)}
              secondary={goal.gap}
              centerLabel="Down payment"
              centerValue={formatShort(goal.downPayment)}
              legend={[
                {
                  label: "Already saved",
                  color: "var(--c-accent)",
                  value: formatShort(Math.min(savings, goal.downPayment)),
                },
                {
                  label: "Still to save",
                  color: "var(--c-interest)",
                  value: formatShort(goal.gap),
                },
              ]}
            />

            <div className={styles.ctaRow}>
              <Link href="/property-listing/search/property-in-india">
                <a className={styles.cta}>
                  <FiSearch style={{ verticalAlign: "-2px", marginRight: 6 }} />
                  Browse homes in this range
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}

      {mode === "goal" && (
        <div className={styles.chartRow}>
          <MiniBarChart
            title="Monthly saving by time horizon"
            footLabel="Buy sooner and you must save more each month"
            data={goalScenarios}
          />
          <div className={styles.tableCard}>
            <h3 className={styles.tableTitle}>Your plan at a glance</h3>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Target home price</td>
                  <td>{formatINR(target)}</td>
                </tr>
                <tr>
                  <td>Down payment (20%)</td>
                  <td>{formatINR(goal.downPayment)}</td>
                </tr>
                <tr>
                  <td>Current savings</td>
                  <td>{formatINR(savings)}</td>
                </tr>
                <tr className={styles.rowHighlight}>
                  <td>Save / month for {years}y</td>
                  <td>{formatINR(goal.monthlySaving)}</td>
                </tr>
                <tr>
                  <td>Home loan at purchase</td>
                  <td>{formatINR(goal.loan)}</td>
                </tr>
                <tr>
                  <td>Future EMI</td>
                  <td>{formatINR(goal.emi)}/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================== AFFORD MODE =========================== */}
      {mode === "afford" && (
        <div className={styles.body}>
          <div className={styles.controls}>
            {/* Monthly income */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="a-income">Net Monthly Income</label>
                <div className={styles.amountBox}>
                  <span className={styles.rupee}>₹</span>
                  <input
                    id="a-income"
                    type="text"
                    inputMode="numeric"
                    value={income.toLocaleString("en-IN")}
                    onChange={(e) => setIncome(sanitizeAmount(e.target.value, 5000000))}
                  />
                </div>
              </div>
              <input
                type="range"
                min={15000}
                max={1000000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(income, 15000, 1000000)}
                aria-label="Net monthly income"
              />
              <div className={styles.rangeHints}>
                <span>{formatShort(15000)}</span>
                <span>{formatShort(1000000)}</span>
              </div>
            </div>

            {/* Monthly EMI budget */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="a-budget">Monthly EMI Budget</label>
                <div className={styles.amountBox}>
                  <span className={styles.rupee}>₹</span>
                  <input
                    id="a-budget"
                    type="text"
                    inputMode="numeric"
                    value={budget.toLocaleString("en-IN")}
                    onChange={(e) => setBudget(sanitizeAmount(e.target.value, income))}
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={income}
                step={1000}
                value={Math.min(budget, income)}
                onChange={(e) => setBudget(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(Math.min(budget, income), 0, income || 1)}
                aria-label="Monthly EMI budget"
              />
              <div className={styles.rangeHints}>
                <span>₹0</span>
                <span>{Math.round(incomeRatio)}% of income</span>
              </div>
            </div>

            {/* Savings on hand */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="a-savings">Savings For Down Payment</label>
                <div className={styles.amountBox}>
                  <span className={styles.rupee}>₹</span>
                  <input
                    id="a-savings"
                    type="text"
                    inputMode="numeric"
                    value={haveSavings.toLocaleString("en-IN")}
                    onChange={(e) => setHaveSavings(sanitizeAmount(e.target.value, 200000000))}
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={100000}
                value={Math.min(haveSavings, 20000000)}
                onChange={(e) => setHaveSavings(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(Math.min(haveSavings, 20000000), 0, 20000000)}
                aria-label="Savings for down payment"
              />
              <div className={styles.rangeHints}>
                <span>₹0</span>
                <span>{formatShort(20000000)}</span>
              </div>
            </div>

            {/* Rate */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="a-rate">Interest Rate (% p.a.)</label>
                <div className={styles.amountBox}>
                  <input
                    id="a-rate"
                    type="number"
                    min={5}
                    max={20}
                    step={0.05}
                    value={affRate}
                    onChange={(e) => setAffRate(Number(e.target.value))}
                  />
                  <span className={styles.unit}>%</span>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={0.05}
                value={affRate}
                onChange={(e) => setAffRate(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(affRate, 5, 20)}
                aria-label="Interest rate"
              />
              <div className={styles.rangeHints}>
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className={styles.field}>
              <div className={styles.fieldTop}>
                <label htmlFor="a-tenure">Loan Tenure (Years)</label>
                <div className={styles.amountBox}>
                  <input
                    id="a-tenure"
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={affTenure}
                    onChange={(e) => setAffTenure(Number(e.target.value))}
                  />
                  <span className={styles.unit}>Yr</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={affTenure}
                onChange={(e) => setAffTenure(Number(e.target.value))}
                className={styles.slider}
                style={trackStyle(affTenure, 1, 30)}
                aria-label="Loan tenure in years"
              />
              <div className={styles.rangeHints}>
                <span>1 Yr</span>
                <span>30 Yr</span>
              </div>
            </div>
          </div>

          <div className={styles.result}>
            <div className={styles.resultLead}>
              <span className={styles.resultLeadLabel}>You can buy a home up to</span>
              <span className={styles.resultLeadValue}>
                <AnimatedNumber value={afford.maxPrice} format={formatINR} />
              </span>
              <span className={styles.resultLeadNote}>
                {formatShort(afford.maxPrice)} with your current budget
              </span>
            </div>

            <ul className={styles.breakdown}>
              <li>
                <span className={`${styles.dot} ${styles.dotPrincipal}`} />
                <span className={styles.bLabel}>Home loan</span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={afford.usedLoan} format={formatINR} />
                </span>
              </li>
              <li>
                <span className={`${styles.dot} ${styles.dotInterest}`} />
                <span className={styles.bLabel}>Down payment</span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={afford.downPayment} format={formatINR} />
                </span>
              </li>
              <li className={styles.totalRow}>
                <span className={styles.bLabel}>Max property price</span>
                <span className={styles.bValue}>
                  <AnimatedNumber value={afford.maxPrice} format={formatINR} />
                </span>
              </li>
            </ul>

            <SplitDonut
              primary={afford.usedLoan}
              secondary={afford.downPayment}
              centerLabel="Max price"
              centerValue={formatShort(afford.maxPrice)}
              legend={[
                {
                  label: "Home loan",
                  color: "var(--c-accent)",
                  value: formatShort(afford.usedLoan),
                },
                {
                  label: "Down payment",
                  color: "var(--c-interest)",
                  value: formatShort(afford.downPayment),
                },
              ]}
            />

            <div className={styles.ctaRow}>
              <Link href="/property-listing/search/property-in-india">
                <a className={styles.cta}>
                  <FiSearch style={{ verticalAlign: "-2px", marginRight: 6 }} />
                  Find matching properties
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}

      {mode === "afford" && (
        <div className={styles.chartRow}>
          <MiniBarChart
            title="Affordable home price by tenure"
            footLabel="A longer tenure lets the same EMI buy a pricier home"
            data={affordScenarios.map((s) => ({ label: `${s.tenure}y`, value: s.price }))}
          />
          <div className={styles.tableCard}>
            <h3 className={styles.tableTitle}>Price &amp; loan by tenure</h3>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Tenure</th>
                  <th>Max Price</th>
                  <th>Home Loan</th>
                </tr>
              </thead>
              <tbody>
                {affordScenarios.map((s) => (
                  <tr key={s.tenure} className={s.current ? styles.rowHighlight : ""}>
                    <td>{s.tenure} years</td>
                    <td>{formatINR(s.price)}</td>
                    <td>{formatINR(s.loan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className={styles.disclaimer}>
        *Figures are indicative and assume a 20% down payment with the bank funding the balance.
        Goal-mode savings use compounding at your chosen expected return. Actual loan eligibility,
        interest rates and returns vary by lender and market conditions.
      </p>
    </div>
  );
}

export default PlanCalculator;
