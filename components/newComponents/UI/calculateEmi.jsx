export const calculateEMI = (principal, annualInterestRate, tenureYears) => {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const tenureMonths = tenureYears * 12;
    const emi =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, tenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    return emi.toFixed(0);
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };
  