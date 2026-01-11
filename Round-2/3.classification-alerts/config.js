// config.js
// Configuration for classification and alert system

module.exports = {
  // Classification thresholds
  thresholds: {
    // Leakage detection
    leakage: {
      highConfidence: {
        lossPercent: 0.15,      // 15% or more flow loss
        pressureDrop: 0.20,     // 20% or more pressure drop
        flowRatio: 0.80         // Outlet/Inlet ratio below 80%
      },
      mediumConfidence: {
        lossPercent: 0.10,      // 10% or more flow loss
        pressureDrop: 0.10      // 10% or more pressure drop
      }
    },

    // Theft detection
    theft: {
      outletExceedsInlet: true,  // Outlet > Inlet is theft
      spikeMultiplier: 1.3,      // Inlet 30% above baseline
      maxPressureDrop: 0.1       // Pressure should be stable (< 10% drop)
    },

    // Normal operation
    normal: {
      maxLossPercent: 0.05,      // Up to 5% loss is acceptable
      maxPressureDrop: 0.05      // Up to 5% pressure variation
    }
  },

  // Alert configuration
  alerts: {
    // Throttling settings
    throttling: {
      enabled: true,
      normalAlerts: false,        // Don't send normal status alerts
      warningCooldown: 30,        // Minutes between similar warnings
      criticalAlwaysSend: true    // Always send critical alerts
    },

    // Notification channels
    channels: {
      console: true,              // Always log to console
      file: true,                 // Always log to file
      email: {
        enabled: false,           // Enable when email service configured
        criticalOnly: false,      // Send for critical and warnings
        recipients: [
          'admin@watermonitoring.com',
          'ops@watermonitoring.com'
        ]
      },
      sms: {
        enabled: false,           // Enable when SMS service configured
        criticalOnly: true,       // Only send for critical alerts
        recipients: [
          '+1-XXX-XXX-XXXX'
        ]
      }
    },

    // Alert retention
    retention: {
      maxAlertsPerZone: 100,      // Maximum alerts to keep in memory per zone
      cleanupIntervalHours: 24,   // Clean alerts older than 24 hours
      historyDays: 30             // Keep history for 30 days (if using DB)
    }
  },

  // Zone configuration
  zones: {
    default: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
    // Per-zone custom thresholds (optional)
    custom: {
      // Example: 'Zone A': { leakage: { highConfidence: { lossPercent: 0.20 } } }
    }
  },

  // System settings
  system: {
    logLevel: 'INFO',             // DEBUG, INFO, WARNING, ERROR
    debugMode: false,             // Enable detailed logging
    autoCleanup: true,            // Automatically cleanup old alerts
    cleanupInterval: 3600000      // Cleanup every hour (in ms)
  }
};
