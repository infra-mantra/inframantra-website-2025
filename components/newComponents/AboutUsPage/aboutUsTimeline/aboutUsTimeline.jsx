import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from'./aboutUsTimeline.module.css';

const stepLabelStyles = {
  active: {
    color: '#DCAA4C',
    fontSize: '18px',
  },
  completed: {
    color: '#DCAA4C',
    fontSize: '18px',
  },
  disabled: {
    color: '#fff',
    fontSize: '18px',
  },
};

const connectorStyles = {
  active: {
    background: '#E7B554',
    border: 'none',
  },
  completed: {
    background: '#E7B554',
    border: 'none',
  },
};

function QontoStepIcon({ active }) {
  return (
    <div style={{ display: 'flex', height: '22px', alignItems: 'center', color: active ? '#E7B554' : 'inherit' }}>
      <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: active ? '#E7B554' : '#fff' }} />
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
};

const steps = ['2017', '2019', '2022', '2023', '2024'];

export default function CustomizedSteppers({ currentStep }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    currentStep(activeStep);
  }, [activeStep, currentStep]);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        {steps.map((label, index) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QontoStepIcon active={index <= activeStep} />
            <div style={index <= activeStep ? stepLabelStyles.active : stepLabelStyles.disabled}>{label}</div>
            {index < steps.length - 1 && (
              <div
                style={{
                  ...(index < activeStep && connectorStyles.completed),
                  ...(index === activeStep && connectorStyles.active),
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={styles.stepperBackButton}
        >
          Previous
        </button>
        <button
          disabled={activeStep === steps.length - 1}
          onClick={handleNext}
          className={styles.stepperForwardButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
