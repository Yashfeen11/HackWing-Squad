// simulator.js
// IoT Sensor Simulator for Water Monitoring System
// Sends realistic sensor data to the backend API every 1 minute

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api/readings';
const INTERVAL_MS = 60000; // 1 minute
// const INTERVAL_MS = 10000; // 10 seconds
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

// Simulation state
let simulatedHour = 0; // 0-23 hour format
let simulatedMinute = 0;
let currentMode = 'Normal'; // Normal, Leakage, Theft
let modeTimer = 0; // Duration counter for current mode

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
 * Check if current time is night (22:00 - 06:00)
 */
function isNightTime() {
  return simulatedHour >= 22 || simulatedHour < 6;
}

/**
 * Check if current time is early morning (01:00 - 05:00)
 */
function isLeakageTime() {
  return simulatedHour >= 1 && simulatedHour < 5;
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
 * Decide next operating mode based on time and probability
 */
function decideMode() {
  modeTimer += 1;

  // If in theft mode, keep it for 10-30 minutes then return to normal
  if (currentMode === 'Theft') {
    if (modeTimer >= randomInRange(10, 30)) {
      currentMode = 'Normal';
      modeTimer = 0;
      console.log('🔄 Mode changed: Theft → Normal');
    }
    return;
  }

  // If in leakage mode, keep it for 60-180 minutes then return to normal
  if (currentMode === 'Leakage') {
    if (modeTimer >= randomInRange(60, 180)) {
      currentMode = 'Normal';
      modeTimer = 0;
      console.log('🔄 Mode changed: Leakage → Normal');
    }
    return;
  }

  // Normal mode - decide if should transition
  // Leakage more likely during early morning (01:00 - 05:00)
  if (isLeakageTime() && Math.random() < 0.15) {
    currentMode = 'Leakage';
    modeTimer = 0;
    console.log('🔄 Mode changed: Normal → Leakage (Night time)');
    return;
  }

  // Theft can happen randomly any time (5% chance per minute)
  if (Math.random() < 0.05) {
    currentMode = 'Theft';
    modeTimer = 0;
    console.log('🔄 Mode changed: Normal → Theft (Random spike)');
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
  console.log(`📊 Current Mode: ${currentMode} (Timer: ${modeTimer} min)`);
  console.log(`🌙 Night Time: ${isNightTime() ? 'Yes' : 'No'}`);

  // Decide operating mode
  decideMode();

  // Generate and send data
  const sensorData = generateSensorData();
  await sendData(sensorData);

  // Advance simulated time
  advanceTime();
}

/**
 * Initialize simulator
 */
function startSimulator() {
  console.log('🚀 Water Monitoring Sensor Simulator Started');
  console.log(`📡 Sending data to: ${API_URL}`);
  console.log(`⏱️  Interval: ${INTERVAL_MS / 1000} seconds`);
  console.log(`🕐 Starting simulation at: ${getSimulatedTime()}`);
  console.log('─'.repeat(60));

  // Set initial time to 00:00
  simulatedHour = 0;
  simulatedMinute = 0;

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