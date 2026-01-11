// classification.js

const THRESHOLDS = require('../utils/thresholds');

function classifyReading({ inletFlow, outletFlow, pressure, baseline, duration }) {
  const lossPercent = ((inletFlow - outletFlow) / inletFlow) * 100;
  const pressureDrop =
    ((baseline.avgPressure - pressure) / baseline.avgPressure) * 100;

  // LEAKAGE: continuous loss + pressure drop + long duration
  if (
    lossPercent > THRESHOLDS.LEAKAGE_LOSS_PERCENT &&
    pressureDrop > THRESHOLDS.PRESSURE_DROP_THRESHOLD &&
    duration >= THRESHOLDS.LEAKAGE_MIN_DURATION
  ) {
    return {
      type: 'Leakage',
      confidence: 'High'
    };
  }

  // THEFT: sudden spike, short duration, pressure stable
  if (
    lossPercent > THRESHOLDS.THEFT_SPIKE_PERCENT &&
    duration <= THRESHOLDS.THEFT_MAX_DURATION
  ) {
    return {
      type: 'Theft',
      confidence: 'Medium'
    };
  }

  // NORMAL / UNCLASSIFIED
  return {
    type: 'Normal',
    confidence: 'Low'
  };
}

module.exports = classifyReading;
