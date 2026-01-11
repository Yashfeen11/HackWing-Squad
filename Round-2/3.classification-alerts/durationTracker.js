// durationTracker.js
// Tracks anomaly duration to filter noise and validate persistence

class DurationTracker {
  constructor() {
    // Track anomaly state per zone
    // Structure: { zone: { type: 'leakage'|'theft', count: N, startTime: Date, lastSeen: Date } }
    this.anomalyState = new Map();

    // Thresholds for consecutive readings
    this.THRESHOLDS = {
      MIN_CONSECUTIVE_READINGS: 3,        // Minimum readings to confirm anomaly
      LEAKAGE_MIN_DURATION: 30,          // Minutes - leakage is long-term
      THEFT_MIN_DURATION: 5,             // Minutes - theft is short bursts
      THEFT_MAX_DURATION: 60,            // Minutes - theft typically short
      RESET_AFTER_NORMAL: 5              // Reset counter after N normal readings
    };
  }

  /**
   * Update anomaly state for a zone
   *
   * @param {String} zone - Zone ID
   * @param {Boolean} hasAnomaly - Whether anomaly detected
   * @param {String} anomalyType - Type: 'leakage', 'theft', or null
   * @returns {Object} Duration info
   */
  update(zone, hasAnomaly, anomalyType = null) {
    const now = new Date();

    // Initialize zone if not exists
    if (!this.anomalyState.has(zone)) {
      this.anomalyState.set(zone, {
        type: null,
        count: 0,
        normalCount: 0,
        startTime: null,
        lastSeen: null
      });
    }

    const state = this.anomalyState.get(zone);

    // Case 1: No anomaly detected (normal reading)
    if (!hasAnomaly) {
      state.normalCount++;

      // Reset anomaly tracking after consecutive normal readings
      if (state.normalCount >= this.THRESHOLDS.RESET_AFTER_NORMAL) {
        state.type = null;
        state.count = 0;
        state.startTime = null;
      }

      state.lastSeen = now;
      return this.getInfo(state, now);
    }

    // Case 2: Anomaly detected
    state.normalCount = 0;
    state.lastSeen = now;

    // Same type of anomaly continuing
    if (state.type === anomalyType) {
      state.count++;
    } else {
      // New type of anomaly
      state.type = anomalyType;
      state.count = 1;
      state.startTime = now;
    }

    return this.getInfo(state, now);
  }

  /**
   * Get duration information for current anomaly state
   *
   * @param {Object} state - Current state
   * @param {Date} now - Current time
   * @returns {Object} Duration info
   */
  getInfo(state, now) {
    if (!state.startTime || !state.type) {
      return {
        isConfirmed: false,
        consecutiveReadings: state.count,
        durationMinutes: 0,
        isPersistent: false,
        type: null
      };
    }

    const durationMs = now - state.startTime;
    const durationMinutes = Math.floor(durationMs / (60 * 1000));

    // Check if anomaly is confirmed (enough consecutive readings)
    const isConfirmed = state.count >= this.THRESHOLDS.MIN_CONSECUTIVE_READINGS;

    // Check if duration matches expected pattern
    let isPersistent = false;
    if (state.type === 'leakage') {
      isPersistent = durationMinutes >= this.THRESHOLDS.LEAKAGE_MIN_DURATION;
    } else if (state.type === 'theft') {
      isPersistent = durationMinutes >= this.THRESHOLDS.THEFT_MIN_DURATION;
    }

    return {
      isConfirmed,
      consecutiveReadings: state.count,
      durationMinutes,
      isPersistent,
      type: state.type,
      startTime: state.startTime
    };
  }

  /**
   * Get current state for a zone
   *
   * @param {String} zone - Zone ID
   * @returns {Object} Duration info
   */
  getState(zone) {
    if (!this.anomalyState.has(zone)) {
      return {
        isConfirmed: false,
        consecutiveReadings: 0,
        durationMinutes: 0,
        isPersistent: false,
        type: null
      };
    }

    const state = this.anomalyState.get(zone);
    return this.getInfo(state, new Date());
  }

  /**
   * Check if theft duration is suspiciously long
   *
   * @param {String} zone - Zone ID
   * @returns {Boolean} True if theft has lasted too long
   */
  isTheftDurationSuspicious(zone) {
    const state = this.getState(zone);
    return state.type === 'theft' &&
           state.durationMinutes > this.THRESHOLDS.THEFT_MAX_DURATION;
  }

  /**
   * Reset tracking for a zone
   *
   * @param {String} zone - Zone ID
   */
  reset(zone) {
    this.anomalyState.delete(zone);
  }

  /**
   * Clear all tracking data
   */
  clear() {
    this.anomalyState.clear();
  }

  /**
   * Get statistics across all zones
   *
   * @returns {Object} Statistics
   */
  getStats() {
    const stats = {
      totalZones: this.anomalyState.size,
      activeAnomalies: 0,
      byType: {
        leakage: 0,
        theft: 0
      }
    };

    for (const state of this.anomalyState.values()) {
      if (state.type) {
        stats.activeAnomalies++;
        stats.byType[state.type] = (stats.byType[state.type] || 0) + 1;
      }
    }

    return stats;
  }
}

// Export singleton instance
module.exports = new DurationTracker();
