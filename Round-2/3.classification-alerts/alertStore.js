// alertStore.js
// In-memory storage for recent alerts (used for throttling)

class AlertStore {
  constructor() {
    // Store alerts by zone
    this.alerts = new Map();
    // Maximum alerts to keep per zone
    this.maxAlertsPerZone = 100;
  }

  /**
   * Add alert to store
   *
   * @param {Object} alert - Alert object
   */
  addAlert(alert) {
    const zone = alert.zone;

    // Initialize array for zone if doesn't exist
    if (!this.alerts.has(zone)) {
      this.alerts.set(zone, []);
    }

    const zoneAlerts = this.alerts.get(zone);

    // Add alert to beginning of array
    zoneAlerts.unshift(alert);

    // Keep only recent alerts (limit size)
    if (zoneAlerts.length > this.maxAlertsPerZone) {
      zoneAlerts.pop();
    }
  }

  /**
   * Get recent alerts for a zone
   *
   * @param {String} zone - Zone ID
   * @param {Number} minutes - How many minutes back to look
   * @returns {Array} Recent alerts
   */
  getRecentAlerts(zone, minutes = 30) {
    if (!this.alerts.has(zone)) {
      return [];
    }

    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const zoneAlerts = this.alerts.get(zone);

    return zoneAlerts.filter(alert => new Date(alert.timestamp) > cutoffTime);
  }

  /**
   * Get all alerts for a zone
   *
   * @param {String} zone - Zone ID
   * @returns {Array} All stored alerts for zone
   */
  getAllAlerts(zone) {
    return this.alerts.get(zone) || [];
  }

  /**
   * Get alerts across all zones
   *
   * @param {Number} limit - Maximum number of alerts to return
   * @returns {Array} Recent alerts from all zones
   */
  getAllRecentAlerts(limit = 50) {
    const allAlerts = [];

    // Collect all alerts from all zones
    for (const zoneAlerts of this.alerts.values()) {
      allAlerts.push(...zoneAlerts);
    }

    // Sort by timestamp (newest first)
    allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Return limited number
    return allAlerts.slice(0, limit);
  }

  /**
   * Clear old alerts (cleanup)
   *
   * @param {Number} hours - Clear alerts older than this many hours
   */
  cleanup(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    for (const [zone, zoneAlerts] of this.alerts.entries()) {
      const filtered = zoneAlerts.filter(
        alert => new Date(alert.timestamp) > cutoffTime
      );
      this.alerts.set(zone, filtered);
    }
  }

  /**
   * Clear all alerts
   */
  clear() {
    this.alerts.clear();
  }

  /**
   * Get statistics
   *
   * @returns {Object} Alert statistics
   */
  getStats() {
    let totalAlerts = 0;
    const zoneStats = {};

    for (const [zone, zoneAlerts] of this.alerts.entries()) {
      totalAlerts += zoneAlerts.length;
      zoneStats[zone] = zoneAlerts.length;
    }

    return {
      totalAlerts,
      totalZones: this.alerts.size,
      zoneStats
    };
  }
}

// Export singleton instance
module.exports = new AlertStore();
