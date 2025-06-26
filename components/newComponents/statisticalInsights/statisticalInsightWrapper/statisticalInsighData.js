// statisticalInsight.js
import React, {useState, useEffect} from 'react';
import CountUp from 'react-countup';
import styles from "../staticInsight.module.css";

const StatisticalInsight = ({
  end,
  duration = 10,
  separator = ",",
  decimal = ".",
  decimals = 0,
  prefix = "",
  suffix = "",
  useEasing = true,
  easingFn = null,
  onStart = () => {},
  onEnd = () => {},
  style = {},
  className = styles.statisticalInsightValues,
  isVisible = false,
}) => {
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    if (isVisible && !shouldStart) {
      setShouldStart(true);
    }
  }, [isVisible, shouldStart]);

  return (
    <CountUp
      start={0}
      end={shouldStart ? end : 0}
      duration={shouldStart ? duration : 0}
      separator={separator}
      decimal={decimal}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      useEasing={shouldStart && useEasing}
      easingFn={easingFn}
      onStart={onStart}
      onEnd={onEnd}
      style={style}
      className={className}
      preserveValue
    />
  );
};

export default StatisticalInsight;
