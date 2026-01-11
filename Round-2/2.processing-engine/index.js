// index.js
// Entry point for the Processing Engine
// Orchestrates baseline, anomaly detection, and classification

const calculateBaseline = require('./baseline/BaselineCalculator');
const detectAnomaly = require('./anomaly/anomalyDetector');
const classify = require('./classification/classifier');

/**
 * Analyse a new sensor reading using historical data
 *
 * @param {Object} currentReading - Latest sensor reading
 * @param {Array} historicalReadings - Past readings for baseline calculation
 * @param {Number} duration - Duration (in minutes) for which anomaly persists
 *
 * @returns {Object} Analysis result
 */
function analyse(currentReading, historicalReadings, duration = 0) {
  // Step 1: Calculate baseline
  const baseline = calculateBaseline(historicalReadings);

  // Step 2: Detect anomaly
  const anomalyResult = detectAnomaly(currentReading, baseline);

  // Step 3: Default classification
  let classificationResult = {
    type: 'Normal',
    confidence: 'High'
  };

  // Step 4: Classify ONLY if anomaly detected
  if (anomalyResult.isAnomaly && baseline) {
    classificationResult = classify({
      inletFlow: currentReading.inletFlow,
      outletFlow: currentReading.outletFlow,
      pressure: currentReading.pressure,
      baseline,
      duration
    });
  }

  // Step 5: Return structured output
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
    },

    classification: classificationResult
  };
}

module.exports = {
  analyse
};
