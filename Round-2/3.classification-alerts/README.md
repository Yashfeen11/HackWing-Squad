# Classification & Alerts Module

## Purpose
Classifies detected anomalies as leakage, theft, or false positives and triggers appropriate alerts through multiple notification channels.

## Features

### Classification Logic
- **Leakage Detection**: Gradual decrease in outlet flow with sustained inlet-outlet difference and pressure drop
- **Theft Detection**: Sudden drop in flow rate, outlet exceeding inlet, or abnormal consumption with stable pressure
- **Normal Operation**: Flow within expected baseline range with acceptable inlet-outlet difference
- **Duration Tracking**: Requires 3+ consecutive readings to confirm anomaly (filters sensor noise)
- **Time-Aware**: Adjusts confidence based on time of day (night/early morning detection)

### Alert System

#### Alert Levels
- **CRITICAL**: Confirmed theft or major leakage (high confidence)
- **WARNING**: Suspected anomaly requiring investigation (medium confidence)
- **INFO**: Minor deviations or system notifications
- **NORMAL**: No anomalies detected

#### Notification Channels
- ✅ **Console**: Real-time logging (always enabled)
- ✅ **Telegram**: Bot-based instant notifications
- 📧 **Email**: Critical and warning alerts (placeholder)
- 📱 **SMS**: Critical alerts only (placeholder)
- 📝 **File**: Audit trail logging

### Advanced Features
- **Alert Throttling**: Prevents spam by limiting similar alerts (30min cooldown)
- **Confidence Scoring**: Multi-layer validation to reduce false positives
- **Historical Pattern**: Correlates with past alerts for better accuracy
- **Persistence Validation**: Tracks anomaly duration (leakage = long, theft = short)

---

## Setup

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Configure Telegram Bot (Optional but Recommended)

#### Step 1: Create Bot
1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow instructions to name your bot
4. Copy the **bot token** you receive

#### Step 2: Get Chat ID
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for `"chat":{"id": YOUR_CHAT_ID }` in the response

#### Step 3: Set Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

For group notifications:
- Add bot to your Telegram group
- Make it admin (recommended)
- Use negative chat ID: `-123456789`

### 3. Test Telegram Connection

```javascript
const telegramNotifier = require('./telegramNotifier');
telegramNotifier.testConnection();
```

---

## Usage

### Basic Usage

```javascript
const classificationAlerts = require('./index');

// Initialize the system
classificationAlerts.initialize();

// Process an anomaly
const result = await classificationAlerts.processAnomaly(
  {
    detected: true,
    lossPercent: 0.25,      // 25% flow loss
    pressureDrop: 0.30      // 30% pressure drop
  },
  {
    zone: 'Zone A',
    inletFlow: 600,
    outletFlow: 450,
    pressure: 300,
    timestamp: new Date()
  },
  {
    avgInlet: 590,
    avgOutlet: 570,
    avgPressure: 420
  }
);

console.log(result);
// {
//   success: true,
//   alert: { ... },
//   sent: true,
//   classification: 'Leakage',
//   confidence: 'High'
// }
```

### Get Statistics

```javascript
const stats = classificationAlerts.getStatistics();
console.log(stats);
// {
//   totalAlerts: 42,
//   totalZones: 4,
//   zoneStats: { 'Zone A': 15, 'Zone B': 10, ... }
// }
```

### Get Recent Alerts

```javascript
// Get alerts from last 30 minutes for a zone
const recentAlerts = classificationAlerts.getRecentAlerts('Zone A', 30);

// Get all recent alerts across all zones
const allAlerts = classificationAlerts.getAllRecentAlerts(50);
```

---

## Configuration

Edit [config.js](config.js) to customize:

### Classification Thresholds
```javascript
thresholds: {
  leakage: {
    highConfidence: {
      lossPercent: 0.15,      // 15% flow loss
      pressureDrop: 0.20,     // 20% pressure drop
      flowRatio: 0.80         // Outlet/Inlet < 80%
    }
  }
}
```

### Alert Settings
```javascript
alerts: {
  throttling: {
    enabled: true,
    warningCooldown: 30     // Minutes between similar warnings
  },
  channels: {
    telegram: {
      enabled: true,
      criticalOnly: false   // Send warnings too
    }
  }
}
```

---

## Telegram Message Format

Alerts sent to Telegram include:

```
🚨 CRITICAL ALERT

Zone: Zone A
Classification: Leakage
Confidence: High
Time: 1/11/2026, 3:45 PM

Details:
Large flow loss (25.0%) with pressure drop (30.0%). Duration: 35 min

Sensor Data:
• Inlet Flow: 600.00 L/min
• Outlet Flow: 450.00 L/min
• Pressure: 300.00 PSI
• Flow Loss: 25.0%
```

- 🚨 **Critical**: Audible notification
- ⚠️ **Warning**: Silent notification
- ✅ **Normal**: Not sent (configurable)

---

## Module Architecture

```
3.classification-alerts/
├── index.js                 # Main API
├── classifier.js            # Classification logic (duration + time-aware)
├── durationTracker.js       # Consecutive reading validation
├── alertManager.js          # Alert creation and throttling
├── alertStore.js           # In-memory alert storage
├── notificationHandler.js   # Multi-channel notifications
├── telegramNotifier.js     # Telegram Bot API integration
├── config.js               # Configuration
├── .env.example            # Environment variables template
└── README.md               # This file
```

---

## Detection Logic

Based on the system specification:

### Leakage Indicators
- ✅ Continuous steady loss
- ✅ Significant pressure drop
- ✅ Long duration (30+ minutes)
- ✅ More common at night (01:00-05:00)

### Theft Indicators
- ✅ Outlet > Inlet (bypass/illegal tapping)
- ✅ Sudden consumption spikes
- ✅ Stable pressure
- ✅ Short bursts (5-60 minutes)

### Noise Filtering
- ✅ Requires 3+ consecutive anomaly readings
- ✅ Resets after 5 consecutive normal readings
- ✅ Time-aware confidence scoring

---

## Integration with Other Modules

This module is designed to work with:

1. **Processing Engine** - Receives anomaly detection results
2. **Storage Server** - Can be called from API routes
3. **Data Simulation** - Processes simulated sensor data

See main [Round-2 README](../README.md) for full system integration.

---

## Troubleshooting

### Telegram Not Working

1. **Check environment variables**:
   ```bash
   echo $TELEGRAM_BOT_TOKEN
   echo $TELEGRAM_CHAT_ID
   ```

2. **Test connection**:
   ```javascript
   const telegramNotifier = require('./telegramNotifier');
   await telegramNotifier.testConnection();
   ```

3. **Common issues**:
   - Bot token invalid → Get new token from @BotFather
   - Chat ID wrong → Visit getUpdates URL to find correct ID
   - Bot blocked → Unblock bot in Telegram and send `/start`
   - Group issues → Make sure bot is added and is admin

### No Alerts Being Sent

1. Check throttling settings in `config.js`
2. Verify alert level configuration
3. Ensure anomaly is confirmed (3+ consecutive readings)
4. Check console for error messages

---

## Team
HackWing Squad - Water Leakage & Theft Detection System
