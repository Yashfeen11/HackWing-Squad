// classifier.js
// Classifies anomalies as Leakage, Theft, or Normal
// Enhanced with duration tracking and time-aware logic

const durationTracker = require('./durationTracker');

/**
 * Check if current time is night (22:00 - 06:00)
 *
 * @param {Date} timestamp - Current timestamp
 * @returns {Boolean} True if night time
 */
function isNightTime(timestamp = new Date()) {
  const hour = timestamp.getHours();
  return hour >= 22 || hour < 6;
}

/**
 * Check if current time is low-usage period (01:00 - 05:00)
 * Leakage more common during this window
 *
 * @param {Date} timestamp - Current timestamp
 * @returns {Boolean} True if early morning
 */
function isLeakageTime(timestamp = new Date()) {
  const hour = timestamp.getHours();
  return hour >= 1 && hour < 5;
}

/**
 * Determine initial anomaly type based on sensor data
 *
 * @param {Object} params - Flow and pressure data
 * @returns {String|null} Anomaly type or null
 */
function determineAnomalyType(params) {
  const { lossPercent, pressureDrop, outletFlow, inletFlow } = params;

  // Leakage indicators: Flow loss + pressure drop
  if (lossPercent > 0.10 && pressureDrop > 0.1) {
    return 'leakage';
  }

  // Theft indicators: Outlet > inlet OR sudden spike
  if (outletFlow > inletFlow || lossPercent < -0.1) {
    return 'theft';
  }

  return null;
}

/**
 * Classify an anomaly based on flow, pressure, duration, and time patterns
 *
 * @param {Object} anomalyData - Data from processing engine
 * @returns {Object} Classification result
 */
function classify(anomalyData) {
  const { lossPercent, pressureDrop, currentReading, baseline, detected } = anomalyData;
  const zone = currentReading.zone;
  const timestamp = currentReading.timestamp || new Date();

  // Calculate flow metrics
  const inletFlow = currentReading.inletFlow;
  const outletFlow = currentReading.outletFlow;
  const flowDiff = inletFlow - outletFlow;
  const flowRatio = outletFlow / inletFlow;

  // Determine anomaly type for duration tracking
  const anomalyType = detected ? determineAnomalyType({
    lossPercent,
    pressureDrop,
    outletFlow,
    inletFlow
  }) : null;

  // Update duration tracker
  const durationInfo = durationTracker.update(zone, detected, anomalyType);

  // If no anomaly detected, return normal
  if (!detected) {
    return {
      classification: 'Normal',
      confidence: 'High',
      reason: 'Flow and pressure within normal range',
      durationInfo
    };
  }

  // If anomaly not yet confirmed (not enough consecutive readings)
  if (!durationInfo.isConfirmed) {
    return {
      classification: 'Suspicious',
      confidence: 'Low',
      reason: `Potential anomaly - awaiting confirmation (${durationInfo.consecutiveReadings}/3 readings)`,
      durationInfo
    };
  }

  // Time context
  const isNight = isNightTime(timestamp);
  const isLeakagePeriod = isLeakageTime(timestamp);

  // === LEAKAGE DETECTION LOGIC ===
  // Characteristics: Continuous steady loss + Pressure drop + Long duration

  // High confidence leakage
  if (lossPercent > 0.15 && pressureDrop > 0.2 && flowRatio < 0.8) {
    // Additional confidence if persistent
    const confidence = durationInfo.isPersistent ? 'High' : 'Medium';
    return {
      classification: 'Leakage',
      confidence,
      reason: `Large flow loss (${(lossPercent * 100).toFixed(1)}%) with pressure drop (${(pressureDrop * 100).toFixed(1)}%). Duration: ${durationInfo.durationMinutes} min`,
      durationInfo,
      timeContext: { isNight, isLeakagePeriod }
    };
  }

  // Medium confidence leakage - especially during night/early morning
  if (lossPercent > 0.10 && pressureDrop > 0.1) {
    let confidence = 'Medium';
    let reason = `Moderate flow loss (${(lossPercent * 100).toFixed(1)}%) with pressure drop`;

    // Upgrade confidence if detected during leakage-prone hours
    if (isLeakagePeriod && durationInfo.isPersistent) {
      confidence = 'High';
      reason += ` (detected during low-usage period, ${durationInfo.durationMinutes} min)`;
    } else {
      reason += ` (${durationInfo.durationMinutes} min)`;
    }

    return {
      classification: 'Leakage',
      confidence,
      reason,
      durationInfo,
      timeContext: { isNight, isLeakagePeriod }
    };
  }

  // === THEFT DETECTION LOGIC ===
  // Characteristics: Outlet > Inlet OR Sudden spikes + Stable pressure + Short duration

  // High confidence theft - outlet exceeds inlet (bypass/illegal tapping)
  if (outletFlow > inletFlow) {
    const excess = ((outletFlow - inletFlow) / inletFlow * 100).toFixed(1);
    return {
      classification: 'Theft',
      confidence: 'High',
      reason: `Outlet exceeds inlet by ${excess}% - unauthorized extraction detected. Duration: ${durationInfo.durationMinutes} min`,
      durationInfo,
      timeContext: { isNight, isLeakagePeriod }
    };
  }

  // Sudden spike with stable pressure - likely theft
  if (baseline && inletFlow > baseline.avgInlet * 1.3 && pressureDrop < 0.1) {
    let confidence = 'Medium';
    let reason = 'Sudden consumption spike with stable pressure';

    // More suspicious if happening at night
    if (isNight) {
      confidence = 'High';
      reason += ' (during night hours)';
    }

    // If theft lasting too long, might be leakage instead
    if (durationTracker.isTheftDurationSuspicious(zone)) {
      return {
        classification: 'Suspicious',
        confidence: 'Medium',
        reason: 'Pattern started as theft but persisting unusually long - requires investigation',
        durationInfo,
        timeContext: { isNight, isLeakagePeriod }
      };
    }

    return {
      classification: 'Theft',
      confidence,
      reason: `${reason}. Duration: ${durationInfo.durationMinutes} min`,
      durationInfo,
      timeContext: { isNight, isLeakagePeriod }
    };
  }

  // === AMBIGUOUS CASE ===
  // Anomaly confirmed but doesn't clearly match leakage or theft patterns
  return {
    classification: 'Suspicious',
    confidence: 'Low',
    reason: `Anomaly pattern unclear - requires investigation. Duration: ${durationInfo.durationMinutes} min`,
    durationInfo,
    timeContext: { isNight, isLeakagePeriod }
  };
}

module.exports = classify;
