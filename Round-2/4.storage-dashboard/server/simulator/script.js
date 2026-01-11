// simulator.js
// IoT Sensor Simulator for Water Monitoring System
// Sends realistic sensor data to the backend API every 1 minute

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api/readings';
// const INTERVAL_MS = 60000; // 1 minute
const INTERVAL_MS = 10000/2; // 5 seconds (uncomment for faster demo)
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

// Demo cycle configuration
const NORMAL_READINGS_COUNT = 3; // Send 3-4 normal readings
const ALERT_READINGS_COUNT = 2;  // Then send 1-2 alert readings

// Simulation state
let simulatedHour = 0; // 0-23 hour format
let simulatedMinute = 0;
let currentMode = 'Normal'; // Normal, Leakage, Theft
let readingCounter = 0; // Count readings in current mode
let normalReadingsTarget = NORMAL_READINGS_COUNT; // Random 3-4
let alertReadingsTarget = ALERT_READINGS_COUNT; // Random 1-2

// Base values for normal operation
const BASE_INLET = 600;
const BASE_OUTLET = 580;
const BASE_PRESSURE = 420;

/**
 * Get current simulated time
 */
function getSimulatedTime() {
  return `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMinute).padStart(2, '0')}`;
}

/**
 * Advance simulated time by 1 minute
 */
function advanceTime() {
  simulatedMinute += 1;
  if (simulatedMinute >= 60) {
    simulatedMinute = 0;
    simulatedHour += 1;
    if (simulatedHour >= 24) {
      simulatedHour = 0;
    }
  }
}

/**
 * Generate random integer within range (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random number within range
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Add random variation to a value
 */
function addVariation(value, percentage = 5) {
  const variation = value * (percentage / 100);
  return value + randomInRange(-variation, variation);
}

/**
 * Decide next operating mode for DEMO purposes
 * Cycles: 3-4 Normal → 1-2 Alerts (Leakage or Theft) → repeat
 */
function decideMode() {
  readingCounter += 1;

  // If in Normal mode
  if (currentMode === 'Normal') {
    if (readingCounter >= normalReadingsTarget) {
      // Switch to alert mode (randomly choose Leakage or Theft)
      currentMode = Math.random() < 0.5 ? 'Leakage' : 'Theft';
      readingCounter = 0;
      alertReadingsTarget = randomInt(1, 2); // 1-2 alert readings
      console.log(`🔄 Mode changed: Normal → ${currentMode} (will send ${alertReadingsTarget} alerts)`);
    }
    return;
  }

  // If in Leakage or Theft mode
  if (currentMode === 'Leakage' || currentMode === 'Theft') {
    if (readingCounter >= alertReadingsTarget) {
      // Switch back to Normal mode
      currentMode = 'Normal';
      readingCounter = 0;
      normalReadingsTarget = randomInt(3, 4); // 3-4 normal readings
      console.log(`🔄 Mode changed: Alert → Normal (will send ${normalReadingsTarget} normal readings)`);
    }
    return;
  }
}

/**
 * Generate sensor data based on current mode
 */
function generateSensorData() {
  let zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  let inletFlow, outletFlow, pressure, status, confidence;

  switch (currentMode) {
    case 'Normal':
      // Normal: Inlet slightly higher, small loss 2-5%
      inletFlow = addVariation(BASE_INLET, 10);
      outletFlow = inletFlow * randomInRange(0.95, 0.98); // 2-5% loss
      pressure = addVariation(BASE_PRESSURE, 5);
      status = 'Normal';
      confidence = 'High';
      break;

    case 'Leakage':
      // Leakage: High inlet, very low outlet, low pressure
      inletFlow = addVariation(400, 15);
      outletFlow = randomInRange(50, 150); // Very low outlet
      pressure = randomInRange(200, 300); // Significant pressure drop
      status = 'Leakage Detected';
      confidence = 'High';
      break;

    case 'Theft':
      // Theft: Outlet exceeds inlet (unauthorized extraction)
      inletFlow = addVariation(700, 10);
      outletFlow = inletFlow * randomInRange(1.15, 1.35); // 15-35% more
      pressure = addVariation(BASE_PRESSURE, 8); // Pressure mostly normal
      status = 'Theft Suspected';
      confidence = 'Medium';
      break;

    default:
      // Fallback to normal
      inletFlow = BASE_INLET;
      outletFlow = BASE_OUTLET;
      pressure = BASE_PRESSURE;
      status = 'Normal';
      confidence = 'High';
  }

  // Round values to 2 decimal places
  return {
    zone,
    inletFlow: Math.round(inletFlow * 100) / 100,
    outletFlow: Math.round(outletFlow * 100) / 100,
    pressure: Math.round(pressure * 100) / 100,
    status,
    confidence
  };
}

/**
 * Send sensor data to API
 */
async function sendData(data) {
  try {
    const response = await axios.post(API_URL, data);
    console.log(`✅ [${getSimulatedTime()}] Data sent successfully:`, {
      zone: data.zone,
      status: data.status,
      inlet: data.inletFlow,
      outlet: data.outletFlow,
      pressure: data.pressure
    });
  } catch (error) {
    console.error(`❌ [${getSimulatedTime()}] Error sending data:`, error.message);
  }
}

/**
 * Main simulation loop
 */
async function simulationLoop() {
  console.log(`\n⏰ [${getSimulatedTime()}] Running simulation...`);
  console.log(`📊 Current Mode: ${currentMode} (Reading ${readingCounter + 1})`);

  // Generate and send data BEFORE deciding next mode
  const sensorData = generateSensorData();
  await sendData(sensorData);

  // Decide next operating mode
  decideMode();

  // Advance simulated time
  advanceTime();
}

/**
 * Initialize simulator
 */
function startSimulator() {
  console.log('🚀 Water Monitoring Sensor Simulator Started');
  console.log('🎯 DEMO MODE: Cycling through Normal → Alert patterns');
  console.log(`📡 Sending data to: ${API_URL}`);
  console.log(`⏱️  Interval: ${INTERVAL_MS / 1000} seconds`);
  console.log(`🕐 Starting simulation at: ${getSimulatedTime()}`);
  console.log('─'.repeat(60));

  // Set initial time to 00:00
  simulatedHour = 0;
  simulatedMinute = 0;

  // Initialize with random normal readings target
  normalReadingsTarget = randomInt(3, 4);
  console.log(`📋 Starting with ${normalReadingsTarget} normal readings\n`);

  // Run immediately
  simulationLoop();

  // Then run every interval
  setInterval(simulationLoop, INTERVAL_MS);
}

// Start the simulator
startSimulator();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Simulator stopped');
  process.exit(0);
});