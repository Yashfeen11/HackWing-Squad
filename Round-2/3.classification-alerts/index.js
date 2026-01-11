// index.js
// Main entry point for Classification & Alerts Module

const classify = require('./classifier');
const { createAlert, formatAlertMessage, shouldSendAlert } = require('./alertManager');
const { sendNotifications } = require('./notificationHandler');
const alertStore = require('./alertStore');
const config = require('./config');

/**
 * Process anomaly data and generate alerts
 *
 * @param {Object} anomalyData - Data from processing engine with anomaly info
 * @param {Object} currentReading - Current sensor reading
 * @param {Object} baseline - Baseline data
 * @returns {Object} Processing result with alert info
 */
async function processAnomaly(anomalyData, currentReading, baseline) {
  try {
    // Step 1: Classify the anomaly
    const classificationResult = classify({
      lossPercent: anomalyData.lossPercent || 0,
      pressureDrop: anomalyData.pressureDrop || 0,
      detected: anomalyData.detected || false,
      currentReading,
      baseline
    });

    // Step 2: Create alert object
    const alert = createAlert(classificationResult, currentReading);

    // Step 3: Check if alert should be sent (throttling)
    const recentAlerts = alertStore.getRecentAlerts(
      currentReading.zone,
      config.alerts.throttling.warningCooldown
    );

    const shouldSend = config.alerts.throttling.enabled
      ? shouldSendAlert(alert, recentAlerts)
      : true;

    // Step 4: Send notifications if needed
    if (shouldSend) {
      await sendNotifications(alert);
    } else {
      console.log(`🔇 [THROTTLED] ${formatAlertMessage(alert)}`);
    }

    // Step 5: Store alert in memory
    alertStore.addAlert(alert);

    // Return result
    return {
      success: true,
      alert,
      sent: shouldSend,
      classification: classificationResult.classification,
      confidence: classificationResult.confidence
    };
  } catch (error) {
    console.error('❌ Error processing anomaly:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get alert statistics
 *
 * @returns {Object} Statistics
 */
function getStatistics() {
  return alertStore.getStats();
}

/**
 * Get recent alerts for a zone
 *
 * @param {String} zone - Zone ID
 * @param {Number} minutes - Minutes to look back
 * @returns {Array} Recent alerts
 */
function getRecentAlerts(zone, minutes = 30) {
  return alertStore.getRecentAlerts(zone, minutes);
}

/**
 * Get all recent alerts across zones
 *
 * @param {Number} limit - Maximum alerts to return
 * @returns {Array} Recent alerts
 */
function getAllRecentAlerts(limit = 50) {
  return alertStore.getAllRecentAlerts(limit);
}

/**
 * Initialize the classification & alerts system
 */
function initialize() {
  console.log('🚀 Classification & Alerts Module Initialized');
  console.log(`   Throttling: ${config.alerts.throttling.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   Zones: ${config.zones.default.join(', ')}`);

  // Setup auto-cleanup if enabled
  if (config.system.autoCleanup) {
    setInterval(() => {
      alertStore.cleanup(config.alerts.retention.cleanupIntervalHours);
      console.log('🧹 Alert store cleanup completed');
    }, config.system.cleanupInterval);
  }
}

/**
 * Cleanup resources
 */
function cleanup() {
  alertStore.clear();
  console.log('🧹 Classification & Alerts Module cleaned up');
}

module.exports = {
  processAnomaly,
  getStatistics,
  getRecentAlerts,
  getAllRecentAlerts,
  initialize,
  cleanup
};
