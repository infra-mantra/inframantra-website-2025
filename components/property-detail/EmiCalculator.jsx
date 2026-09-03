import React, { useMemo, useState } from "react";
import { FiCalendar, FiPlus, FiMinus } from "react-icons/fi";
import styles from "./EmiCalculator.module.css";
import AnimatedNumber from "../calculators/AnimatedNumber.jsx";

/* ----------------------------------------------------------------
   Helpers
----------------------------------------------------------------- */

// Format a number into Indian-grouped rupees, e.g. 1234567 -> "₹12,34,567"
function formatINR(value) {
  if (!isFinite(value)) return "₹0";
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

// Short, readable label: 2.5 Cr / 75 Lakh
function formatShort(value) {
  if (!isFinite(value) || value <= 0) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return formatINR(value);
}

// Gold-filled slider track that follows the thumb position.
function sliderFill(value, min, max) {
  const pct = Math.max(0, Math.min(100, ((Number(value) - min) / (max - min)) * 100));
  return {
    background: `linear-gradient(to right, var(--emi-accent) 0%, var(--emi-accent) ${pct}%, #ece4cf ${pct}%, #ece4cf 100%)`,
  };
}

/* ----------------------------------------------------------------
   EMI Calculator
----------------------------------------------------------------- */

const MIN_LOAN = 100000; // 1 Lakh
const MAX_LOAN = 200000000; // 20 Cr
const MIN_RATE = 5;
const MAX_RATE = 20;
const MIN_TENURE = 1;
const MAX_TENURE = 30;

function EmiCalculator({ price, name }) {
  // Prefill loan amount with the property price when it's a usable number.
  const initialLoan = (() => {
    const p = Number(price);
    if (isFinite(p) && p >= MIN_LOAN) return Math.min(p, MAX_LOAN);
    return 5000000; // 50 Lakh fallback
  })();

  const [loanAmount, setLoanAmount] = useState(initialLoan);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20); // years
  const [period, setPeriod] = useState("month"); // "month" | "year"
  const [showSchedule, setShowSchedule] = useState(false);

  const { emi, totalInterest, totalPayable, interestPercent } = useMemo(() => {
    const principal = Number(loanAmount) || 0;
    const months = (Number(tenure) || 0) * 12;
    const monthlyRate = (Number(rate) || 0) / 12 / 100;

    let monthlyEmi;
    if (monthlyRate === 0) {
      monthlyEmi = months > 0 ? principal / months : 0;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
    }

    const payable = monthlyEmi * months;
    const interest = payable - principal;

    return {
      emi: monthlyEmi,
      totalInterest: interest,
      totalPayable: payable,
      interestPercent: payable > 0 ? (interest / payable) * 100 : 0,
    };
  }, [loanAmount, rate, tenure]);

  // Clamp + sanitize manual number input
  const handleLoanInput = (e) => {
    const raw = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (!isFinite(raw)) return;
    setLoanAmount(Math.min(Math.max(raw, 0), MAX_LOAN));
  };

  // Year-by-year amortization schedule (drives the bar & balance charts)
  const schedule = useMemo(() => {
    const principal = Number(loanAmount) || 0;
    const months = (Number(tenure) || 0) * 12;
    const monthlyRate = (Number(rate) || 0) / 12 / 100;
    if (principal <= 0 || months <= 0) return [];

    let balance = principal;
    const years = [];
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= months; m++) {
      const interestPart = monthlyRate === 0 ? 0 : balance * monthlyRate;
      let principalPart = emi - interestPart;
      if (principalPart > balance) principalPart = balance;
      balance -= principalPart;
      yearPrincipal += principalPart;
      yearInterest += interestPart;

      if (m % 12 === 0 || m === months) {
        years.push({
          year: Math.ceil(m / 12),
          principal: yearPrincipal,
          interest: yearInterest,
          balance: Math.max(balance, 0),
        });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return years;
  }, [loanAmount, rate, tenure, emi]);

  // EMI shown for the selected period (per month / per year)
  const displayEmi = period === "year" ? emi * 12 : emi;

  // Donut: principal vs interest split (pure CSS, no chart lib)
  const principalPercent = 100 - interestPercent;
  const donutStyle = {
    background: `conic-gradient(var(--emi-accent) 0% ${principalPercent}%, var(--emi-interest) ${principalPercent}% 100%)`,
  };

  /* ---------------- SVG chart geometry (no external lib) ---------------- */
  const VBW = 640;
  const PAD_L = 48;
  const PAD_R = 12;
  const PAD_B = 26;
  const PAD_T = 12;
  const plotW = VBW - PAD_L - PAD_R;
  const n = schedule.length;

  // Show roughly 6 x-axis labels regardless of tenure length
  const labelStep = Math.max(1, Math.ceil(n / 6));

  // Stacked bar chart: principal vs interest paid each year
  const BAR_H = 200;
  const barPlotH = BAR_H - PAD_T - PAD_B;
  const maxYearTotal = schedule.reduce((mx, y) => Math.max(mx, y.principal + y.interest), 0);
  const slot = n > 0 ? plotW / n : plotW;
  const barW = Math.max(4, slot * 0.6);
  const bars = schedule.map((y, i) => {
    const total = y.principal + y.interest || 1;
    const h = maxYearTotal > 0 ? (total / maxYearTotal) * barPlotH : 0;
    const pH = (y.principal / total) * h;
    const iH = h - pH;
    const x = PAD_L + slot * i + (slot - barW) / 2;
    const baseY = PAD_T + barPlotH;
    return {
      year: y.year,
      x,
      principalY: baseY - pH,
      principalH: pH,
      interestY: baseY - pH - iH,
      interestH: iH,
    };
  });

  // Outstanding-balance area chart
  const BAL_H = 200;
  const balPlotH = BAL_H - PAD_T - PAD_B;
  const maxBal = Number(loanAmount) || 1;
  const xAt = (i) => PAD_L + (n > 1 ? (plotW * i) / (n - 1) : plotW / 2);
  const yAt = (bal) => PAD_T + (1 - bal / maxBal) * balPlotH;
  // Start at year 0 = full principal, then each year's ending balance
  const balPoints = [{ x: PAD_L, y: yAt(maxBal), year: 0 }].concat(
    schedule.map((y, i) => ({ x: xAt(i), y: yAt(y.balance), year: y.year }))
  );
  const balLine = balPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const balArea =
    `${PAD_L},${PAD_T + balPlotH} ` +
    balLine +
    ` ${balPoints[balPoints.length - 1].x},${PAD_T + balPlotH}`;
  const baseY = PAD_T + barPlotH;

  return (
    <div className={styles.emiWrapper}>
      <h2 className={styles.emiHeading}>Home Loan EMI Calculator</h2>
      <p className={styles.emiSub}>
        Estimate your monthly instalment. Adjust the loan amount, interest rate and tenure to plan
        your purchase.
      </p>

      <div className={styles.emiBody}>
        {/* ---------------- CONTROLS ---------------- */}
        <div className={styles.emiControls}>
          {/* Loan amount */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="emi-loan">Loan Amount</label>
              <div className={styles.amountBox}>
                <span className={styles.rupee}>₹</span>
                <input
                  id="emi-loan"
                  type="text"
                  inputMode="numeric"
                  value={loanAmount.toLocaleString("en-IN")}
                  onChange={handleLoanInput}
                />
              </div>
            </div>
            <input
              type="range"
              min={MIN_LOAN}
              max={MAX_LOAN}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className={styles.slider}
              style={sliderFill(loanAmount, MIN_LOAN, MAX_LOAN)}
              aria-label="Loan amount"
            />
            <div className={styles.rangeHints}>
              <span>{formatShort(MIN_LOAN)}</span>
              <span>{formatShort(MAX_LOAN)}</span>
            </div>
          </div>

          {/* Interest rate */}
          <div className={styles.field}>
            <div className={styles.fieldTop}>
              <label htmlFor="emi-rate">Interest Rate (% p.a.)</label>
              <div className={styles.amountBox}>
                <input
                  id="emi-rate"
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
              style={sliderFill(rate, MIN_RATE, MAX_RATE)}
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
              <label htmlFor="emi-tenure">Loan Tenure (Years)</label>
              <div className={styles.amountBox}>
                <input
                  id="emi-tenure"
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
              style={sliderFill(tenure, MIN_TENURE, MAX_TENURE)}
              aria-label="Loan tenure in years"
            />
            <div className={styles.rangeHints}>
              <span>{MIN_TENURE} Yr</span>
              <span>{MAX_TENURE} Yr</span>
            </div>
          </div>
        </div>

        {/* ---------------- RESULT ---------------- */}
        <div className={styles.emiResult}>
          {/* Monthly / Yearly EMI toggle */}
          <div className={styles.periodToggle} role="group" aria-label="EMI period">
            <button
              type="button"
              className={`${styles.periodBtn} ${period === "month" ? styles.active : ""}`}
              onClick={() => setPeriod("month")}
            >
              <FiCalendar /> Monthly
            </button>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === "year" ? styles.active : ""}`}
              onClick={() => setPeriod("year")}
            >
              <FiCalendar /> Yearly
            </button>
          </div>

          <div className={styles.donutWrap}>
            <div className={styles.donut} style={donutStyle}>
              <div className={styles.donutHole}>
                <span className={styles.donutLabel}>
                  {period === "year" ? "Yearly EMI" : "Monthly EMI"}
                </span>
                <strong className={styles.donutValue}>
                  <AnimatedNumber value={displayEmi} format={formatINR} />
                </strong>
                <span className={styles.donutPer}>
                  {period === "year" ? "per year" : "per month"}
                </span>
              </div>
            </div>
          </div>

          <ul className={styles.breakdown}>
            <li>
              <span className={`${styles.dot} ${styles.dotPrincipal}`} />
              <span className={styles.bLabel}>Principal Amount</span>
              <span className={styles.bValue}>
                <AnimatedNumber value={loanAmount} format={formatINR} />
              </span>
            </li>
            <li>
              <span className={`${styles.dot} ${styles.dotInterest}`} />
              <span className={styles.bLabel}>Total Interest</span>
              <span className={styles.bValue}>
                <AnimatedNumber value={totalInterest} format={formatINR} />
              </span>
            </li>
            <li className={styles.totalRow}>
              <span className={styles.bLabel}>Total Amount Payable</span>
              <span className={styles.bValue}>
                <AnimatedNumber value={totalPayable} format={formatINR} />
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------------- CHARTS ---------------- */}
      {schedule.length > 0 && (
        <div className={styles.charts}>
          {/* Payment breakup by year — stacked bars */}
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <h3 className={styles.chartTitle}>Yearly Payment Breakup</h3>
              <div className={styles.legend}>
                <span>
                  <i className={styles.dotPrincipal} /> Principal
                </span>
                <span>
                  <i className={styles.dotInterest} /> Interest
                </span>
              </div>
            </div>
            <svg
              className={styles.svg}
              viewBox={`0 0 ${VBW} ${BAR_H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Principal vs interest paid each year"
            >
              {/* baseline */}
              <line x1={PAD_L} y1={baseY} x2={VBW - PAD_R} y2={baseY} className={styles.axis} />
              {bars.map((b) => (
                <g key={b.year}>
                  <rect
                    x={b.x}
                    y={b.principalY}
                    width={barW}
                    height={b.principalH}
                    className={styles.barPrincipal}
                  />
                  <rect
                    x={b.x}
                    y={b.interestY}
                    width={barW}
                    height={b.interestH}
                    className={styles.barInterest}
                  />
                  {(b.year === 1 || b.year % labelStep === 0 || b.year === n) && (
                    <text x={b.x + barW / 2} y={baseY + 16} className={styles.tick}>
                      {b.year}
                    </text>
                  )}
                </g>
              ))}
              <text x={PAD_L} y={PAD_T - 0} className={styles.axisLabel} />
            </svg>
            <p className={styles.chartFoot}>Loan year →</p>
          </div>

          {/* Outstanding balance over time — area chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <h3 className={styles.chartTitle}>Outstanding Balance</h3>
              <div className={styles.legend}>
                <span>
                  <i className={styles.dotBalance} /> Loan balance
                </span>
              </div>
            </div>
            <svg
              className={styles.svg}
              viewBox={`0 0 ${VBW} ${BAL_H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Outstanding loan balance over time"
            >
              <line
                x1={PAD_L}
                y1={PAD_T + balPlotH}
                x2={VBW - PAD_R}
                y2={PAD_T + balPlotH}
                className={styles.axis}
              />
              <polygon points={balArea} className={styles.areaFill} />
              <polyline points={balLine} className={styles.areaLine} />
              {balPoints.map((p) =>
                p.year === 0 || p.year % labelStep === 0 || p.year === n ? (
                  <text key={p.year} x={p.x} y={PAD_T + balPlotH + 16} className={styles.tick}>
                    {p.year}
                  </text>
                ) : null
              )}
            </svg>
            <p className={styles.chartFoot}>Loan year →</p>
          </div>
        </div>
      )}

      {/* ---------------- AMORTIZATION SCHEDULE (toggle) ---------------- */}
      {schedule.length > 0 && (
        <div className={styles.scheduleWrap}>
          <button
            type="button"
            className={styles.scheduleToggle}
            onClick={() => setShowSchedule((s) => !s)}
            aria-expanded={showSchedule}
          >
            <span className={styles.toggleIcon}>{showSchedule ? <FiMinus /> : <FiPlus />}</span>
            {showSchedule ? "Hide" : "View"} year-by-year schedule
          </button>

          {showSchedule && (
            <div className={styles.tableScroll}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Total Paid</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((y) => (
                    <tr key={y.year}>
                      <td>{y.year}</td>
                      <td>{formatINR(y.principal)}</td>
                      <td>{formatINR(y.interest)}</td>
                      <td>{formatINR(y.principal + y.interest)}</td>
                      <td>{formatINR(y.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p className={styles.disclaimer}>
        *Indicative figures for planning only. Actual EMI, interest rate and eligibility are subject
        to your lender&apos;s terms.
      </p>
    </div>
  );
}

export default EmiCalculator;
