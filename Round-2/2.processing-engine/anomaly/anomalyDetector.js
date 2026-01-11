// anomaly/anomalyDetector.js

const THRESHOLDS = require('../utils/thresholds');

function detectAnomaly(current, baseline) {
  if (!baseline) return { isAnomaly: false };

  const loss = current.inletFlow - current.outletFlow;
  const lossPercent = loss / baseline.avgInlet;

  const pressureDrop =
    (baseline.avgPressure - current.pressure) / baseline.avgPressure;

  // Basic anomaly conditions
  if (
    lossPercent > THRESHOLDS.NORMAL_LOSS_PERCENT ||
    pressureDrop > THRESHOLDS.PRESSURE_DROP_LIMIT
  ) {
    return {
      isAnomaly: true,
      lossPercent,
      pressureDrop
    };
  }

  return { isAnomaly: false };
}

module.exports = detectAnomaly;
