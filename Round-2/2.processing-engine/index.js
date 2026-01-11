// index.js
// Entry point for the Processing Engine
// This module orchestrates baseline calculation and anomaly detection

const calculateBaseline = require('./baseline/BaselineCalculator');
const detectAnomaly = require('./anomaly/anomalyDetector');

/**
 * Analyse a new sensor reading using historical data
 *
 * @param {Object} currentReading - Latest sensor reading
 * @param {Array} historicalReadings - Past readings for baseline calculation
 *
 * @returns {Object} Analysis result
 */
function analyse(currentReading, historicalReadings) {
  // Step 1: Calculate baseline from historical data
  const baseline = calculateBaseline(historicalReadings);

  // Step 2: Detect anomaly by comparing current reading with baseline
  const anomalyResult = detectAnomaly(currentReading, baseline);

  // Step 3: Return structured analysis output
  return {
    zone: currentReading.zone,
    timestamp: currentReading.timestamp || new Date(),

    baseline: baseline
      ? {
          avgInlet: Number(baseline.avgInlet.toFixed(2)),
          avgOutlet: Number(baseline.avgOutlet.toFixed(2)),
          avgPressure: Number(baseline.avgPressure.toFixed(2))
        }
      : null,

    anomaly: {
      detected: anomalyResult.isAnomaly,
      lossPercent: anomalyResult.lossPercent
        ? Number((anomalyResult.lossPercent * 100).toFixed(2))
        : 0,
      pressureDrop: anomalyResult.pressureDrop
        ? Number((anomalyResult.pressureDrop * 100).toFixed(2))
        : 0
    }
  };
}

module.exports = {
  analyse
};
