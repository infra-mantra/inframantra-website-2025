import React, { useState } from 'react';
import styles from './FAQ.module.css';
import PopUpForm from '../detailSections/POPUPCTA'

const faqs = [
  {
    question: 'WHAT MAKES INFRAMANTRA A PREFERRED CHOICE FOR NRIS IN THE USA?',
    answer:
      'Inframantra offers personalized guidance, transparent processes, and access to properties from top developers in India. Our client-first approach ensures a smooth and trustworthy investment experience tailored to your needs and expectations.',
  },
  {
    question: 'CAN NRIS BUY PROPERTY IN INDIA REMOTELY THROUGH INFRAMANTRA?',
    answer:
      'Yes, Inframantra enables NRIs to complete property purchases from the USA through virtual tours, digital documentation, and dedicated assistance at every step.',
  },
  {
    question: 'WHAT DOCUMENTS DO NRIS TYPICALLY NEED TO PURCHASE PROPERTY IN INDIA?',
    answer:
      'NRIs generally need a valid passport, PAN card, proof of overseas address, and relevant financial documents. Additional paperwork may vary depending on the transaction. For more information, please connect with an Inframantra property advisor.',
  },
  {
    question: 'DOES INFRAMANTRA HANDLE THE ENTIRE PROPERTY BUYING PROCESS?',
    answer:
      'Yes, Inframantra provides end-to-end support, from property selection to hassle-free documentation, transaction management to post-purchase assistance, and key-handover to portfolio management.',
  },
];

const CheckIcon = () => (
  <svg
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: 11,
      height: 11,
      stroke: "white",
      strokeWidth: 2,
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
  >
    <polyline points="2,6 5,9 10,3" />
  </svg>
);
const FAQ = ({name}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
    const [popForm, setPopForm] = useState(false);
         const onClickOff = (val) =>setPopForm(val)
         const handleform = () => setPopForm(true);

  return (
    <section className={styles.sectionfaq} >
      {/* Top Row */}
      <div className={styles.topRow}>
        {/* Heading */}
        <div className={styles.headingWrapper}>
        
          <h2 className={styles.heading}>
            Frequently Asked Questions
             
          </h2>
        </div>

        {/* Support */}
        <div className={styles.support}>
          <div className={styles.checkIcon}>
            <CheckIcon />
          </div>
          <div className={styles.supportText}>
            <p className={styles.supportTitle}>24/7 Support</p>
            <p className={styles.supportDesc}>
              Got questions? Our team is just a click away!
            </p>
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleform} className={styles.ctaButton}>
          BOOK A FREE
          <br />
          CONSULTATION
        </button>
      </div>

      {/* Accordion */}
      <div className={styles.accordion}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={styles.item}>
              <button
                className={styles.question}
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <span className={`${styles.plusIcon} ${isOpen ? styles.open : ''}`}>
                  +
                </span>
              </button>
              <div className={`${styles.answer} ${isOpen ? styles.open : ''}`}>
                <p className={styles.answerText}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
       <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="TO UNLOCK EXCLUSIVE DEALS"
        name={name}
        phone="+91 86 9800 9900"
        id="nriFaq"
        countryCode='us'
        />
    </section>
  );
};

export default FAQ;
