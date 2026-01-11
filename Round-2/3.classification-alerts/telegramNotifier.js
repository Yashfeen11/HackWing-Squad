// telegramNotifier.js
// Sends alerts to Telegram using Bot API

const axios = require('axios');

class TelegramNotifier {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || null;
    this.chatId = process.env.TELEGRAM_CHAT_ID || null;
    this.enabled = false;

    if (this.botToken && this.chatId) {
      this.enabled = true;
      this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
      console.log('✅ Telegram notifications enabled');
    } else {
      console.log('ℹ️  Telegram notifications disabled (missing BOT_TOKEN or CHAT_ID)');
    }
  }

  /**
   * Check if Telegram is configured and enabled
   *
   * @returns {Boolean} True if enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Format alert message for Telegram
   *
   * @param {Object} alert - Alert object
   * @returns {String} Formatted message
   */
  formatMessage(alert) {
    const emoji = {
      CRITICAL: '🚨',
      WARNING: '⚠️',
      INFO: 'ℹ️',
      NORMAL: '✅'
    };

    const icon = emoji[alert.alertLevel] || 'ℹ️';
    const timestamp = new Date(alert.timestamp).toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'short',
      timeStyle: 'short'
    });

    // Use Telegram MarkdownV2 formatting
    let message = `${icon} *${alert.alertLevel} ALERT*\n\n`;
    message += `*Zone:* ${alert.zone}\n`;
    message += `*Classification:* ${alert.classification}\n`;
    message += `*Confidence:* ${alert.confidence}\n`;
    message += `*Time:* ${timestamp}\n\n`;
    message += `*Details:*\n${alert.reason}\n\n`;
    message += `*Sensor Data:*\n`;
    message += `• Inlet Flow: ${alert.sensorData.inletFlow.toFixed(2)} L/min\n`;
    message += `• Outlet Flow: ${alert.sensorData.outletFlow.toFixed(2)} L/min\n`;
    message += `• Pressure: ${alert.sensorData.pressure.toFixed(2)} PSI\n`;

    // Add loss calculation if applicable
    if (alert.sensorData.inletFlow > 0) {
      const loss = alert.sensorData.inletFlow - alert.sensorData.outletFlow;
      const lossPercent = (loss / alert.sensorData.inletFlow * 100).toFixed(1);
      message += `• Flow Loss: ${lossPercent}%\n`;
    }

    return message;
  }

  /**
   * Send message to Telegram
   *
   * @param {String} message - Message text
   * @param {Boolean} disableNotification - Silent notification
   * @returns {Promise} Send promise
   */
  async sendMessage(message, disableNotification = false) {
    if (!this.enabled) {
      console.log('🔇 Telegram not configured, skipping notification');
      return { success: false, reason: 'not_configured' };
    }

    try {
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_notification: disableNotification
      });

      if (response.data.ok) {
        console.log('✅ Telegram notification sent successfully');
        return { success: true, data: response.data };
      } else {
        console.error('❌ Telegram API error:', response.data);
        return { success: false, error: response.data };
      }
    } catch (error) {
      console.error('❌ Error sending Telegram notification:', error.message);
      if (error.response) {
        console.error('   Response:', error.response.data);
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Send alert to Telegram based on severity
   *
   * @param {Object} alert - Alert object
   * @returns {Promise} Send promise
   */
  async sendAlert(alert) {
    if (!this.enabled) {
      return { success: false, reason: 'not_configured' };
    }

    const message = this.formatMessage(alert);

    // Only critical alerts trigger sound notification
    const silent = alert.alertLevel !== 'CRITICAL';

    return await this.sendMessage(message, silent);
  }

  /**
   * Send custom message to Telegram
   *
   * @param {String} text - Custom message text
   * @returns {Promise} Send promise
   */
  async sendCustomMessage(text) {
    return await this.sendMessage(text, true);
  }

  /**
   * Test Telegram connection
   *
   * @returns {Promise} Test result
   */
  async testConnection() {
    if (!this.enabled) {
      return { success: false, reason: 'not_configured' };
    }

    try {
      const response = await axios.get(`${this.apiUrl}/getMe`);

      if (response.data.ok) {
        console.log('✅ Telegram bot connection successful');
        console.log(`   Bot name: ${response.data.result.first_name}`);
        console.log(`   Bot username: @${response.data.result.username}`);
        return { success: true, bot: response.data.result };
      } else {
        console.error('❌ Telegram connection test failed');
        return { success: false, error: response.data };
      }
    } catch (error) {
      console.error('❌ Telegram connection error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new TelegramNotifier();
