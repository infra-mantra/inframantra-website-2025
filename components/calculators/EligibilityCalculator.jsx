import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import styles from "./calculators.module.css";
import SplitDonut from "./SplitDonut";
import MiniBarChart from "./MiniBarChart";
import AnimatedNumber from "./AnimatedNumber";
import {
  formatINR,
  formatShort,
  emiFor,
  maxLoanForEmi,
  sanitizeAmount,
} from "./calcUtils";

/* Home loan eligibility based on salary (FOIR method) ------------------- */

const MIN_INCOME = 15000;
const MAX_INCOME = 5000000; // 50 Lakh / month
const MIN_RATE = 5;
const MAX_RATE = 20;
const MIN_TENURE = 1;
const MAX_TENURE = 30;
const LTV = 0.8; // banks fund ~80% of property value

// Foot-in-the-door ratio scales up a little for higher incomes.
function foirFor(income) {
  if (income >= 200000) return 0.6;
  if (income >= 80000) return 0.55;
  return 0.5;
}

// Fill % for the gold gradient slider track.
function fill(value, min, max) {
  return ((value - min) / (max - min)) * 100;
}

function EligibilityCalculator() {
  const [income, setIncome] = useState(100000);
  const [obligations, setObligations] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { foir, maxEmi, eligibleLoan, propertyBudget, downPayment } = useMemo(() => {
    const foir = foirFor(income);
    const maxEmi = Math.max(income * foir - obligations, 0);
    const eligibleLoan = maxLoanForEmi(maxEmi, rate, tenure);
    const propertyBudget = eligibleLoan > 0 ? eligibleLoan / LTV : 0;
    const downPayment = propertyBudget - eligibleLoan;
    return { foir, maxEmi, eligibleLoan, propertyBudget, downPayment };
  }, [income, obligations, rate, tenure]);

  // Eligible loan at different tenures (bar chart) — keeps income/rate fixed.
  const tenureScenarios = useMemo(() => {
    return [10, 15, 20, 25, 30].map((t) => ({
      label: `${t}y`,
      value: maxLoanForEmi(maxEmi, rate, t),
    }));
  }, [maxEmi, rate]);

  // Eligible loan + EMI across nearby interest rates (comparison table).
  const rateScenarios = useMemo(() => {
    const rates = [rate - 1, rate - 0.5, rate, rate + 0.5, rate + 1].filter(
      (r) => r >= 5 && r <= 20
    );
    return rates.map((r) => ({
      rate: r,
      loan: maxLoanForEmi(maxEmi, r, tenure),
      current: r === rate,
    }));
  }, [maxEmi, rate, tenure]);

  const trackStyle = (value, min, max) => ({
    background: `linear-gradient(to right, var(--c-accent) 0%, var(--c-accent) ${fill(
      value,
      min,
      max
    )}%, #ececec ${fill(value, min, max)}%, #ececec 100%)`,
  });

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Home Loan Eligibility Calculator</h2>
      <p className={styles.sub}>
        Find out how much home loan you can get based on your monthly salary.
        Adjust your income, obligations, interest rate and tenure to see your
        eligible loan amount and the property budget it supports.
      </p>

      <div className={styles.body}>
        {/* ---------------- Controls ---------------- */}
        <div className={styles.controls}>
          {/* Net monthly income */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="el-income">Net Monthly Income</label>
              <div className={styles.amountBox}>
                <span className={styles.rupee}>₹</span>
                <input
                  id="el-income"
                  type="text"
                  inputMode="numeric"
                  value={income.toLocaleString("en-IN")}
                  onChange={(e) =>
                    setIncome(sanitizeAmount(e.target.value, MAX_INCOME))
                  }
                />
              </div>
            </div>
            <input
              type="range"
              min={MIN_INCOME}
              max={MAX_INCOME}
              step={5000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className={styles.slider}
              style={trackStyle(income, MIN_INCOME, MAX_INCOME)}
              aria-label="Net monthly income"
            />
            <div className={styles.rangeHints}>
              <span>{formatShort(MIN_INCOME)}</span>
              <span>{formatShort(MAX_INCOME)}/mo</span>
            </div>
          </div>

          {/* Existing obligations */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="el-obl">Existing Monthly EMIs</label>
              <div className={styles.amountBox}>
                <span className={styles.rupee}>₹</span>
                <input
                  id="el-obl"
                  type="text"
                  inputMode="numeric"
                  value={obligations.toLocaleString("en-IN")}
                  onChange={(e) =>
                    setObligations(sanitizeAmount(e.target.value, income))
                  }
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={income}
              step={1000}
              value={Math.min(obligations, income)}
              onChange={(e) => setObligations(Number(e.target.value))}
              className={styles.slider}
              style={trackStyle(Math.min(obligations, income), 0, income || 1)}
              aria-label="Existing monthly EMIs"
            />
            <div className={styles.rangeHints}>
              <span>₹0</span>
              <span>{formatShort(income)}</span>
            </div>
          </div>

          {/* Interest rate */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="el-rate">Interest Rate (% p.a.)</label>
              <div className={styles.amountBox}>
                <input
                  id="el-rate"
                  type="number"
                  min={MIN_RATE}
                  max={MAX_RATE}
                  step={0.05}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
                <span className={styles.unit}>%</span>
              </div>
            </div>
            <input
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={styles.slider}
              style={trackStyle(rate, MIN_RATE, MAX_RATE)}
              aria-label="Interest rate"
            />
            <div className={styles.rangeHints}>
              <span>{MIN_RATE}%</span>
              <span>{MAX_RATE}%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="el-tenure">Loan Tenure (Years)</label>
              <div className={styles.amountBox}>
                <input
                  id="el-tenure"
                  type="number"
                  min={MIN_TENURE}
                  max={MAX_TENURE}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                />
                <span className={styles.unit}>Yr</span>
              </div>
            </div>
            <input
              type="range"
              min={MIN_TENURE}
              max={MAX_TENURE}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className={styles.slider}
              style={trackStyle(tenure, MIN_TENURE, MAX_TENURE)}
              aria-label="Loan tenure in years"
            />
            <div className={styles.rangeHints}>
              <span>{MIN_TENURE} Yr</span>
              <span>{MAX_TENURE} Yr</span>
            </div>
          </div>
        </div>

        {/* ---------------- Result ---------------- */}
        <div className={styles.result}>
          <div className={styles.resultLead}>
            <span className={styles.resultLeadLabel}>You are eligible for a loan up to</span>
            <span className={styles.resultLeadValue}>
              <AnimatedNumber value={eligibleLoan} format={formatINR} />
            </span>
            <span className={styles.resultLeadNote}>
              {formatShort(eligibleLoan)} at {rate}% for {tenure} years
            </span>
          </div>

          <ul className={styles.breakdown}>
            <li>
              <span className={`${styles.dot} ${styles.dotPrincipal}`} />
              <span className={styles.bLabel}>Eligible loan amount</span>
              <span className={styles.bValue}><AnimatedNumber value={eligibleLoan} format={formatINR} /></span>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.dotInterest}`} />
              <span className={styles.bLabel}>Indicative down payment (20%)</span>
              <span className={styles.bValue}><AnimatedNumber value={downPayment} format={formatINR} /></span>
            </li>
            <li>
              <span className={styles.bLabel} style={{ paddingLeft: 20 }}>
                Affordable EMI (FOIR {Math.round(foir * 100)}%)
              </span>
              <span className={styles.bValue}><AnimatedNumber value={maxEmi} format={formatINR} />/mo</span>
            </li>
            <li className={styles.totalRow}>
              <span className={styles.bLabel}>Property budget</span>
              <span className={styles.bValue}><AnimatedNumber value={propertyBudget} format={formatINR} /></span>
            </li>
          </ul>

          <SplitDonut
            primary={eligibleLoan}
            secondary={downPayment}
            centerLabel="Property budget"
            centerValue={formatShort(propertyBudget)}
            legend={[
              { label: "Bank loan", color: "var(--c-accent)", value: formatShort(eligibleLoan) },
              { label: "Your down payment", color: "var(--c-interest)", value: formatShort(downPayment) },
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

      {/* ---------------- Graphs + table ---------------- */}
      <div className={styles.chartRow}>
        <MiniBarChart
          title="Eligible loan by tenure"
          footLabel="Longer tenures increase the loan you qualify for"
          data={tenureScenarios}
        />
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Eligibility at different interest rates</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Interest Rate</th>
                <th>Eligible Loan</th>
                <th>Property Budget</th>
              </tr>
            </thead>
            <tbody>
              {rateScenarios.map((s) => (
                <tr key={s.rate} className={s.current ? styles.rowHighlight : ""}>
                  <td>{s.rate}% p.a.</td>
                  <td>{formatINR(s.loan)}</td>
                  <td>{formatINR(s.loan / LTV)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className={styles.disclaimer}>
        *Eligibility is estimated using a FOIR (Fixed Obligations to Income
        Ratio) of {Math.round(foir * 100)}% and an 80% loan-to-value assumption.
        Actual sanctioned amount depends on your credit score, employer category,
        property valuation and your lender&apos;s policy.
      </p>
    </div>
  );
}

export default EligibilityCalculator;
