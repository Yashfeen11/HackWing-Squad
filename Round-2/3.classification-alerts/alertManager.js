// alertManager.js
// Manages alerts and notifications based on classification

/**
 * Alert level priorities
 */
const ALERT_LEVELS = {
  CRITICAL: 'CRITICAL',
  WARNING: 'WARNING',
  INFO: 'INFO',
  NORMAL: 'NORMAL'
};

/**
 * Determine alert level based on classification and confidence
 *
 * @param {String} classification - Type of anomaly (Leakage, Theft, Normal, etc.)
 * @param {String} confidence - Confidence level (High, Medium, Low)
 * @returns {String} Alert level
 */
function determineAlertLevel(classification, confidence) {
  // Critical: High confidence leakage or theft
  if ((classification === 'Leakage' || classification === 'Theft') && confidence === 'High') {
    return ALERT_LEVELS.CRITICAL;
  }

  // Warning: Medium confidence leakage or theft
  if ((classification === 'Leakage' || classification === 'Theft') && confidence === 'Medium') {
    return ALERT_LEVELS.WARNING;
  }

  // Warning: Low confidence or suspicious activity
  if (classification === 'Suspicious') {
    return ALERT_LEVELS.WARNING;
  }

  // Info: Normal with any anomaly flags
  if (classification === 'Normal') {
    return ALERT_LEVELS.NORMAL;
  }

  // Default to info
  return ALERT_LEVELS.INFO;
}

/**
 * Create alert object
 *
 * @param {Object} classificationResult - Result from classifier
 * @param {Object} reading - Current sensor reading
 * @returns {Object} Alert object
 */
function createAlert(classificationResult, reading) {
  const alertLevel = determineAlertLevel(
    classificationResult.classification,
    classificationResult.confidence
  );

  return {
    timestamp: reading.timestamp || new Date(),
    zone: reading.zone,
    alertLevel,
    classification: classificationResult.classification,
    confidence: classificationResult.confidence,
    reason: classificationResult.reason,
    sensorData: {
      inletFlow: reading.inletFlow,
      outletFlow: reading.outletFlow,
      pressure: reading.pressure
    }
  };
}

/**
 * Format alert message for logging/notification
 *
 * @param {Object} alert - Alert object
 * @returns {String} Formatted message
 */
function formatAlertMessage(alert) {
  const emoji = {
    CRITICAL: '🚨',
    WARNING: '⚠️',
    INFO: 'ℹ️',
    NORMAL: '✅'
  };

  const icon = emoji[alert.alertLevel] || 'ℹ️';

  return `${icon} [${alert.alertLevel}] ${alert.zone}: ${alert.classification} (${alert.confidence} confidence) - ${alert.reason}`;
}

/**
 * Check if alert should be sent (throttling logic)
 *
 * @param {Object} alert - Current alert
 * @param {Array} recentAlerts - Recent alerts for the zone
 * @returns {Boolean} Should send alert
 */
function shouldSendAlert(alert, recentAlerts = []) {
  // Always send critical alerts
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL) {
    return true;
  }

  // Always send if no recent alerts
  if (!recentAlerts || recentAlerts.length === 0) {
    return true;
  }

  // Don't spam normal alerts
  if (alert.alertLevel === ALERT_LEVELS.NORMAL) {
    return false;
  }

  // For warnings, check if similar alert was sent in last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const similarRecentAlert = recentAlerts.find(
    a => a.zone === alert.zone &&
         a.classification === alert.classification &&
         new Date(a.timestamp) > thirtyMinutesAgo
  );

  return !similarRecentAlert;
}

module.exports = {
  ALERT_LEVELS,
  determineAlertLevel,
  createAlert,
  formatAlertMessage,
  shouldSendAlert
};
