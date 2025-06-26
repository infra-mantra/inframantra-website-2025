import Link from 'next/link';
import { useState, useEffect } from 'react'
import EmiChart from '../../../../UI/EmiChart';
import Section from '../../../../UI/Section';

function EMICalculator({ title, description, classes }) {

  const [amountValue, setAmountValue] = useState(500000);
  function amountValueHandler(e) {
    let target_input = e.target.getAttribute('target-field');
    document.getElementById(target_input).value = e.target.value;
    setAmountValue(e.target.value);
    emiCalculation(e.target.value, tenureValue, intValue)
  }

  const [tenureValue, update_tenure] = useState(5);
  function tenureValueHandler(e) {
    let target_input = e.target.getAttribute('target-field');
    document.getElementById(target_input).value = e.target.value;
    update_tenure(e.target.value);
    emiCalculation(amountValue, e.target.value, intValue)
  }

  const [intValue, setInterestPayable] = useState(6);
  function intValueHandler(e) {
    let target_input = e.target.getAttribute('target-field');
    document.getElementById(target_input).value = e.target.value;
    setInterestPayable(e.target.value);
    emiCalculation(amountValue, tenureValue, e.target.value)
  }

  const [monthlyEmi, setMonthlyEmi] = useState()
  const [interestPayable, setIntPayable] = useState()
  const [totalPayment, setTotalPayment] = useState()

  useEffect(() => {
    emiCalculation(amountValue, tenureValue, intValue)
  }, [])

  var principle_amt, emi_tenure_rate, emi_interest_rate;
  const emiCalculation = (update_amt = amountValue, update_tenure = tenureValue, updated_rate = intValue) => {
    update_amt === undefined ? principle_amt = amountValue : principle_amt = update_amt;
    update_tenure === undefined ? emi_tenure_rate = update_tenure * 12 : emi_tenure_rate = update_tenure * 12
    updated_rate === undefined ? emi_interest_rate = updated_rate / 1200 : emi_interest_rate = updated_rate / 1200;
    const monthly_emi = Math.round((((principle_amt * emi_interest_rate) / (1 - Math.pow(1 / (1 + emi_interest_rate), emi_tenure_rate))) * 100) / 100);
    setMonthlyEmi(monthly_emi)
    let total_pay = Math.round(Math.round(monthly_emi * update_tenure * 100 * 12) / 100)
    setTotalPayment(total_pay)
    let total_int_amt = Math.round(Math.round((total_pay * 1 - principle_amt * 1) * 100) / 100)
    setIntPayable(total_int_amt)
  }



  return (
    <section className="emi-calulator sec-p">
      <div className="emi-calulator-container-project">
        <div className="cl-6 emi-chart-col">
          <div className="chart-wrap-project">
            <div className="emi-value-wrap-project">
              <div className="emi-val-label-project">
                Monthly Loan EMI
              </div>
              <p className='emi-val-project'>₹ {monthlyEmi}</p>
            </div>
            <EmiChart number={[amountValue, interestPayable]} />
          </div>
        </div>
        <div className="cl-6 emi-controls-wrap project-emi-wrap">
          <div className="range-group">
            <div className="range-head">
              <h4>Loan Amount</h4>
              <div className="range-input">
                <span>₹</span>
                <input type="number" id="loan_amount" step="100000" min="500000" max="200000000" onInput={amountValueHandler} className='form-control' defaultValue={amountValue} target-field="loan_amount_range" />
              </div>
            </div>
            <div className="range-slider">
              <input type="range" id='loan_amount_range' className='range-control' step="100000" min="500000" max="200000000"
                defaultValue={amountValue}
                onChange={amountValueHandler} style={{ background: `linear-gradient(To Right, #E7B554 ${((amountValue - 500000) / 200000000) * 100}%, #e7b55478 0%)` }} target-field="loan_amount" />
            </div>
            <div className="range-footer">
              <div className="min">5 L</div>
              <div className="max">20 Cr</div>
            </div>
          </div>

          <div className="range-group">
            <div className="range-head">
              <h4>Loan Tenure</h4>
              <div className="range-input">
                <input type="number" className="form-control sml" min="5" max="30" id='loan_tenure' target-field="loan_tenure_range" defaultValue={tenureValue} onInput={tenureValueHandler} />
                <span>Years</span>
              </div>
            </div>
            <div className="range-slider">

              <input type="range" id='loan_tenure_range' className='range-control sml' min="5" max="30" defaultValue={tenureValue} onChange={tenureValueHandler} style={{ background: `linear-gradient(To Right, #E7B554 ${((tenureValue - 5) / 25) * 100}%, #e7b55478 0%)` }} target-field="loan_tenure" />
            </div>
            <div className="range-footer">
              <div className="min">5 Y</div>
              <div className="max">30 Y</div>
            </div>
          </div>

          <div className="range-group">
            <div className="range-head">
              <h4>Rate Of Interest</h4>
              <div className="range-input">
                <input type="number" className="form-control sml" min="6" max="20" id='loan_int' target-field="loan_int_range" defaultValue={intValue} onInput={intValueHandler} />
                <span>%</span>
              </div>
            </div>
            <div className="range-slider">
              <input type="range" id='loan_int_range' className='range-control' min="6" max="20" defaultValue={intValue} onChange={intValueHandler} style={{ background: `linear-gradient(To Right, #E7B554 ${((intValue - 6) / 14) * 100}%, #e7b55478 0%)` }} target-field="loan_int" />
            </div>
            <div className="range-footer">
              <div className="min">6%</div>
              <div className="max">20%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EMICalculator