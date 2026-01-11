// notificationHandler.js
// Handles different notification channels (console, email, SMS, Telegram, etc.)

const { ALERT_LEVELS } = require('./alertManager');
const telegramNotifier = require('./telegramNotifier');
const config = require('./config');

/**
 * Send console notification (always available)
 *
 * @param {Object} alert - Alert object
 */
function sendConsoleNotification(alert) {
  const timestamp = new Date(alert.timestamp).toLocaleString();

  console.log('\n' + '='.repeat(60));
  console.log(`[${timestamp}] ${alert.alertLevel} ALERT`);
  console.log('='.repeat(60));
  console.log(`Zone: ${alert.zone}`);
  console.log(`Classification: ${alert.classification}`);
  console.log(`Confidence: ${alert.confidence}`);
  console.log(`Reason: ${alert.reason}`);
  console.log(`Inlet Flow: ${alert.sensorData.inletFlow.toFixed(2)} L/min`);
  console.log(`Outlet Flow: ${alert.sensorData.outletFlow.toFixed(2)} L/min`);
  console.log(`Pressure: ${alert.sensorData.pressure.toFixed(2)} PSI`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Send email notification (placeholder - requires email service)
 *
 * @param {Object} alert - Alert object
 * @returns {Promise} Email send promise
 */
async function sendEmailNotification(alert) {
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)

  // For now, just log that email would be sent
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL || alert.alertLevel === ALERT_LEVELS.WARNING) {
    console.log(`📧 [EMAIL] Would send to: admin@watermonitoring.com`);
    console.log(`   Subject: ${alert.alertLevel} - ${alert.classification} in ${alert.zone}`);
  }

  return Promise.resolve();
}

/**
 * Send SMS notification (placeholder - requires SMS service)
 *
 * @param {Object} alert - Alert object
 * @returns {Promise} SMS send promise
 */
async function sendSMSNotification(alert) {
  // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)

  // Only send SMS for critical alerts
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL) {
    const message = `CRITICAL: ${alert.classification} detected in ${alert.zone}. ${alert.reason}`;
    console.log(`📱 [SMS] Would send to: +1-XXX-XXX-XXXX`);
    console.log(`   Message: ${message}`);
  }

  return Promise.resolve();
}

/**
 * Log alert to file (for audit trail)
 *
 * @param {Object} alert - Alert object
 */
function logAlertToFile(alert) {
  // TODO: Implement file logging with rotation

  const logEntry = {
    timestamp: alert.timestamp,
    zone: alert.zone,
    level: alert.alertLevel,
    classification: alert.classification,
    confidence: alert.confidence,
    reason: alert.reason,
    data: alert.sensorData
  };

  console.log(`📝 [FILE LOG] Alert logged: ${JSON.stringify(logEntry)}`);
}

/**
 * Send Telegram notification
 *
 * @param {Object} alert - Alert object
 * @returns {Promise} Telegram send promise
 */
async function sendTelegramNotification(alert) {
  if (!config.alerts.channels.telegram.enabled) {
    return Promise.resolve();
  }

  if (!telegramNotifier.isEnabled()) {
    console.log('⚠️  [TELEGRAM] Not configured - skipping');
    return Promise.resolve();
  }

  // Check if we should send based on criticalOnly setting
  const criticalOnly = config.alerts.channels.telegram.criticalOnly;
  if (criticalOnly && alert.alertLevel !== ALERT_LEVELS.CRITICAL) {
    return Promise.resolve();
  }

  // Send to Telegram
  try {
    const result = await telegramNotifier.sendAlert(alert);
    if (result.success) {
      console.log('📱 [TELEGRAM] Alert sent successfully');
    } else {
      console.log('⚠️  [TELEGRAM] Failed to send alert:', result.error || result.reason);
    }
    return result;
  } catch (error) {
    console.error('❌ [TELEGRAM] Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send alert through all appropriate channels
 *
 * @param {Object} alert - Alert object
 */
async function sendNotifications(alert) {
  // Always log to console
  sendConsoleNotification(alert);

  // Log to file for audit trail
  logAlertToFile(alert);

  // Send Telegram notification for critical and warning alerts
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL || alert.alertLevel === ALERT_LEVELS.WARNING) {
    await sendTelegramNotification(alert);
  }

  // Send email for critical and warning alerts
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL || alert.alertLevel === ALERT_LEVELS.WARNING) {
    await sendEmailNotification(alert);
  }

  // Send SMS only for critical alerts
  if (alert.alertLevel === ALERT_LEVELS.CRITICAL) {
    await sendSMSNotification(alert);
  }
}

module.exports = {
  sendConsoleNotification,
  sendEmailNotification,
  sendSMSNotification,
  sendTelegramNotification,
  logAlertToFile,
  sendNotifications
};
