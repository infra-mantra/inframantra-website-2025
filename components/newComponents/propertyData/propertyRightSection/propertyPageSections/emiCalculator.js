import Link from 'next/link';
import { useState, useEffect } from 'react';
import EmiChart from './emiChart';
import Section from '../../../../UI/Section';
import styles from './EmiCalculator.module.css'; // Make sure the path is correct

function EMICalculator({ title, description, classes }) {
  const [amountValue, setAmountValue] = useState(500000);
  const [tenureValue, updateTenure] = useState(5);
  const [intValue, setInterestPayable] = useState(6);

  const [monthlyEmi, setMonthlyEmi] = useState(0);
  const [interestPayable, setIntPayable] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    emiCalculation(amountValue, tenureValue, intValue);
  }, []);

  function handleNumberInput(e, setter, fieldId, callback) {
    const value = e.target.value;
    const numericRegex = /^\d*\.?\d*$/;

    if (numericRegex.test(value) && Number(value) >= 0) {
      setter(Number(value));
      callback();
    }
  }

  const amountValueHandler = (e) =>
    handleNumberInput(e, setAmountValue, e.target.getAttribute('target-field'), () =>
      emiCalculation(Number(e.target.value), tenureValue, intValue)
    );

  const tenureValueHandler = (e) =>
    handleNumberInput(e, updateTenure, e.target.getAttribute('target-field'), () =>
      emiCalculation(amountValue, Number(e.target.value), intValue)
    );

  const intValueHandler = (e) =>
    handleNumberInput(e, setInterestPayable, e.target.getAttribute('target-field'), () =>
      emiCalculation(amountValue, tenureValue, Number(e.target.value))
    );

  const emiCalculation = (amt = amountValue, tenure = tenureValue, rate = intValue) => {
    const principal = Number(amt || 0);
    const months = Number(tenure || 0) * 12;
    const monthlyRate = Number(rate || 0) / 1200;

    if (principal <= 0 || months <= 0 || monthlyRate <= 0) {
      setMonthlyEmi(0);
      setTotalPayment(0);
      setIntPayable(0);
      return;
    }

    const emi = Math.round(
      ((principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))) * 100
    ) / 100;

    setMonthlyEmi(emi);

    const total = Math.round(emi * months);
    setTotalPayment(total);
    setIntPayable(Math.round(total - principal));
  };

  const preventInvalidKeys = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };
  

  return (
    <section className={styles.secP}>
      <div className={styles.emiCalulatorContainerProject}>
        <div className={`${styles.cl6} ${styles.emiChartCol} ${styles.projectEmiCalculator}`}>
          <div className={`${styles.chartWrapProject} ${styles.projectEmiWrap}`}>
            <div className={styles.emiValueWrapProject}>
              <div className={styles.emiValLabelProject}>Monthly Loan EMI</div>
              <p className={styles.emiValProject}>₹ {monthlyEmi || 0}</p>
            </div>
            <EmiChart number={[amountValue, interestPayable]} />
          </div>
        </div>

        <div className={`${styles.cl6} ${styles.emiControlsWrap} ${styles.projectEmiWrap}`}>
          {/* Loan Amount */}
          <div className={styles.rangeGroup}>
            <div className={styles.rangeHead}>
              <h4>Loan Amount</h4>
              <div className={styles.rangeInput}>
                <span>₹</span>
                <input
                  type="number"
                  id="loan_amount"
                  step="100000"
                  min="500000"
                  max="200000000"
                  onInput={amountValueHandler}
                  onKeyDown={preventInvalidKeys}
                  className={styles.formControl}
                  defaultValue={amountValue}
                  target-field="loan_amount_range"
                />
              </div>
            </div>
            <div className={styles.rangeSlider}>
              <input
                type="range"
                id="loan_amount_range"
                className={styles.rangeControl}
                step="100000"
                min="500000"
                max="200000000"
                value={amountValue}
                onChange={amountValueHandler}
                style={{
                  background: `linear-gradient(to right, #E7B554 ${(amountValue - 500000) / 1950000}%, #e7b55478 0%)`,
                }}
                target-field="loan_amount"
              />
            </div>  
            <div className={styles.rangeFooter}>
              <div className={styles.min}>5 L</div>
              <div className={styles.max}>20 Cr</div>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className={styles.rangeGroup}>
            <div className={styles.rangeHead}>
              <h4>Loan Tenure</h4>
              <div className={styles.rangeInput}>
                <input
                  type="number"
                  className={`${styles.formControl} ${styles.sml}`}
                  min="5"
                  max="30"
                  id="loan_tenure"
                  target-field="loan_tenure_range"
                  defaultValue={tenureValue}
                  onInput={tenureValueHandler}
                  onKeyDown={preventInvalidKeys}
                />
                <span>Years</span>
              </div>
            </div>
            <div className={styles.rangeSlider}>
              <input
                type="range"
                id="loan_tenure_range"
                className={`${styles.rangeControl} ${styles.sml}`}
                min="5"
                max="30"
                value={tenureValue}
                onChange={tenureValueHandler}
                style={{
                  background: `linear-gradient(to right, #E7B554 ${((tenureValue - 5) / 25) * 100}%, #e7b55478 0%)`,
                }}
                target-field="loan_tenure"
              />
            </div>
            <div className={styles.rangeFooter}>
              <div className={styles.min}>5 Y</div>
              <div className={styles.max}>30 Y</div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className={styles.rangeGroup}>
            <div className={styles.rangeHead}>
              <h4>Rate Of Interest</h4>
              <div className={styles.rangeInput}>
                <input
                  type="number"
                  className={`${styles.formControl} ${styles.sml}`}
                  min="6"
                  max="20"
                  id="loan_int"
                  target-field="loan_int_range"
                  defaultValue={intValue}
                  onInput={intValueHandler}
                  onKeyDown={preventInvalidKeys}
                />
                <span>%</span>
              </div>
            </div>
            <div className={styles.rangeSlider}>
              <input
                type="range"
                id="loan_int_range"
                className={styles.rangeControl}
                min="6"
                max="20"
                value={intValue}
                onChange={intValueHandler}
                style={{
                  background: `linear-gradient(to right, #E7B554 ${((intValue - 6) / 14) * 100}%, #e7b55478 0%)`,
                }}
                target-field="loan_int"
              />
            </div>
            <div className={styles.rangeFooter}>
              <div className={styles.min}>6%</div>
              <div className={styles.max}>20%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EMICalculator;
