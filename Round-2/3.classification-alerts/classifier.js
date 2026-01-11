// classifier.js
// Classifies anomalies as Leakage, Theft, or Normal

/**
 * Classify an anomaly based on flow and pressure patterns
 *
 * @param {Object} anomalyData - Data from processing engine
 * @returns {Object} Classification result
 */
function classify(anomalyData) {
  const { lossPercent, pressureDrop, currentReading, baseline } = anomalyData;

  // If no anomaly detected, return normal
  if (!anomalyData.detected) {
    return {
      classification: 'Normal',
      confidence: 'High',
      reason: 'Flow and pressure within normal range'
    };
  }

  // Calculate flow difference
  const inletFlow = currentReading.inletFlow;
  const outletFlow = currentReading.outletFlow;
  const flowDiff = inletFlow - outletFlow;
  const flowRatio = outletFlow / inletFlow;

  // Leakage Detection Logic
  // Characteristics: Large loss, significant pressure drop, outlet < inlet
  if (lossPercent > 0.15 && pressureDrop > 0.2 && flowRatio < 0.8) {
    return {
      classification: 'Leakage',
      confidence: 'High',
      reason: `Large flow loss (${(lossPercent * 100).toFixed(1)}%) with pressure drop (${(pressureDrop * 100).toFixed(1)}%)`
    };
  }

  // Medium confidence leakage
  if (lossPercent > 0.10 && pressureDrop > 0.1) {
    return {
      classification: 'Leakage',
      confidence: 'Medium',
      reason: `Moderate flow loss (${(lossPercent * 100).toFixed(1)}%) with pressure drop`
    };
  }

  // Theft Detection Logic
  // Characteristics: Outlet exceeds inlet OR sudden spike with normal pressure
  if (outletFlow > inletFlow) {
    const excess = ((outletFlow - inletFlow) / inletFlow * 100).toFixed(1);
    return {
      classification: 'Theft',
      confidence: 'High',
      reason: `Outlet exceeds inlet by ${excess}% (unauthorized extraction)`
    };
  }

  // Sudden spike in inlet with normal pressure suggests theft
  if (baseline && inletFlow > baseline.avgInlet * 1.3 && pressureDrop < 0.1) {
    return {
      classification: 'Theft',
      confidence: 'Medium',
      reason: 'Sudden consumption spike with stable pressure'
    };
  }

  // Ambiguous case - anomaly detected but doesn't clearly match patterns
  return {
    classification: 'Suspicious',
    confidence: 'Low',
    reason: 'Anomaly detected but pattern unclear'
  };
}

module.exports = classify;
