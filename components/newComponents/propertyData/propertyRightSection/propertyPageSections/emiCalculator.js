import Link from 'next/link';
import { useState, useEffect } from 'react';
import EmiChart from './emiChart';
import Section from '../../../../UI/Section';

function EMICalculator({ title, description, classes }) {
  const [amountValue, setAmountValue] = useState(500000);
  const [tenureValue, update_tenure] = useState(5);
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
      document.getElementById(fieldId).value = value;
      setter(value);
      callback();
    }
  }

  function amountValueHandler(e) {
    handleNumberInput(e, setAmountValue, e.target.getAttribute('target-field'), () =>
      emiCalculation(e.target.value, tenureValue, intValue)
    );
  }

  function tenureValueHandler(e) {
    handleNumberInput(e, update_tenure, e.target.getAttribute('target-field'), () =>
      emiCalculation(amountValue, e.target.value, intValue)
    );
  }

  function intValueHandler(e) {
    handleNumberInput(e, setInterestPayable, e.target.getAttribute('target-field'), () =>
      emiCalculation(amountValue, tenureValue, e.target.value)
    );
  }

  const emiCalculation = (update_amt = amountValue, update_tenure = tenureValue, updated_rate = intValue) => {
    const principle_amt = Number(update_amt || 0);
    const emi_tenure_rate = Number(update_tenure || 0) * 12;
    const emi_interest_rate = Number(updated_rate || 0) / 1200;

    if (principle_amt <= 0 || emi_tenure_rate <= 0 || emi_interest_rate <= 0) {
      setMonthlyEmi(0);
      setTotalPayment(0);
      setIntPayable(0);
      return;
    }

    const monthly_emi = Math.round(
      ((principle_amt * emi_interest_rate) / (1 - Math.pow(1 / (1 + emi_interest_rate), emi_tenure_rate))) * 100
    ) / 100;

    setMonthlyEmi(monthly_emi);

    const total_pay = Math.round(monthly_emi * emi_tenure_rate);
    setTotalPayment(total_pay);

    const total_int_amt = Math.round(total_pay - principle_amt);
    setIntPayable(total_int_amt);
  };

  const preventInvalidKeys = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };

  return (
    <section className="emi-calulator sec-p">
      <div className="emi-calulator-container-project">
        <div className="cl-6 emi-chart-col projectEmiCalculator">
          <div className="chart-wrap-project projectEmiWrap">
            <div className="emi-value-wrap-project">
              <div className="emi-val-label-project">Monthly Loan EMI</div>
              <p className="emi-val-project">₹ {monthlyEmi || 0}</p>
            </div>
            <EmiChart number={[amountValue, interestPayable]} />
          </div>
        </div>

        <div className="cl-6 emi-controls-wrap project-emi-wrap">
          {/* Loan Amount */}
          <div className="range-group">
            <div className="range-head">
              <h4>Loan Amount</h4>
              <div className="range-input">
                <span>₹</span>
                <input
                  type="number"
                  id="loan_amount"
                  step="100000"
                  min="500000"
                  max="200000000"
                  onInput={amountValueHandler}
                  onKeyDown={preventInvalidKeys}
                  className="form-control"
                  defaultValue={amountValue}
                  target-field="loan_amount_range"
                />
              </div>
            </div>
            <div className="range-slider">
              <input
                type="range"
                id="loan_amount_range"
                className="range-control"
                step="100000"
                min="500000"
                max="200000000"
                defaultValue={amountValue}
                onChange={amountValueHandler}
                style={{
                  background: `linear-gradient(To Right, #E7B554 ${((amountValue - 500000) / 200000000) * 100}%, #e7b55478 0%)`,
                }}
                target-field="loan_amount"
              />
            </div>
            <div className="range-footer">
              <div className="min">5 L</div>
              <div className="max">20 Cr</div>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="range-group">
            <div className="range-head">
              <h4>Loan Tenure</h4>
              <div className="range-input">
                <input
                  type="number"
                  className="form-control sml"
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
            <div className="range-slider">
              <input
                type="range"
                id="loan_tenure_range"
                className="range-control sml"
                min="5"
                max="30"
                defaultValue={tenureValue}
                onChange={tenureValueHandler}
                style={{
                  background: `linear-gradient(To Right, #E7B554 ${((tenureValue - 5) / 25) * 100}%, #e7b55478 0%)`,
                }}
                target-field="loan_tenure"
              />
            </div>
            <div className="range-footer">
              <div className="min">5 Y</div>
              <div className="max">30 Y</div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="range-group">
            <div className="range-head">
              <h4>Rate Of Interest</h4>
              <div className="range-input">
                <input
                  type="number"
                  className="form-control sml"
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
            <div className="range-slider">
              <input
                type="range"
                id="loan_int_range"
                className="range-control"
                min="6"
                max="20"
                defaultValue={intValue}
                onChange={intValueHandler}
                style={{
                  background: `linear-gradient(To Right, #E7B554 ${((intValue - 6) / 14) * 100}%, #e7b55478 0%)`,
                }}
                target-field="loan_int"
              />
            </div>
            <div className="range-footer">
              <div className="min">6%</div>
              <div className="max">20%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EMICalculator;
