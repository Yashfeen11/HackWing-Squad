// simulator.js
// IoT Sensor Simulator for Water Monitoring System
// Responsible only for time simulation, mode switching, and data dispatch

const axios = require('axios');

// Scenario imports (behavior definitions only)
const normalScenario = require('./scenarios/normal');
const leakageScenario = require('./scenarios/leakage');
const theftScenario = require('./scenarios/theft');

// Configuration
const API_URL = 'http://localhost:5000/api/readings';
const INTERVAL_MS = 60000; // 1 minute
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

// Simulation state
let simulatedHour = 0;
let simulatedMinute = 0;
let currentMode = 'Normal'; // Normal | Leakage | Theft
let modeTimer = 0;

// Base values
const BASE_INLET = 600;
const BASE_PRESSURE = 420;

/* ---------------- TIME HELPERS ---------------- */

function getSimulatedTime() {
  return `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMinute).padStart(2, '0')}`;
}

function advanceTime() {
  simulatedMinute++;
  if (simulatedMinute >= 60) {
    simulatedMinute = 0;
    simulatedHour = (simulatedHour + 1) % 24;
  }
}

function isNightTime() {
  return simulatedHour >= 22 || simulatedHour < 6;
}

function isLeakageTime() {
  return simulatedHour >= 1 && simulatedHour < 5;
}

/* ---------------- RANDOM HELPERS ---------------- */

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function addVariation(value, percentage = 5) {
  const variation = value * (percentage / 100);
  return value + randomInRange(-variation, variation);
}

/* ---------------- MODE DECISION ---------------- */

function decideMode() {
  modeTimer++;

  if (currentMode === 'Theft' && modeTimer >= randomInRange(10, 30)) {
    currentMode = 'Normal';
    modeTimer = 0;
    console.log('🔄 Mode changed: Theft → Normal');
    return;
  }

  if (currentMode === 'Leakage' && modeTimer >= randomInRange(60, 180)) {
    currentMode = 'Normal';
    modeTimer = 0;
    console.log('🔄 Mode changed: Leakage → Normal');
    return;
  }

  if (currentMode === 'Normal') {
    if (isLeakageTime() && Math.random() < 0.15) {
      currentMode = 'Leakage';
      modeTimer = 0;
      console.log('🔄 Mode changed: Normal → Leakage (Early Morning)');
      return;
    }

    if (Math.random() < 0.05) {
      currentMode = 'Theft';
      modeTimer = 0;
      console.log('🔄 Mode changed: Normal → Theft (Random Spike)');
    }
  }
}

/* ---------------- DATA GENERATION ---------------- */

function generateSensorData() {
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  let inletFlow, outletFlow, pressure;

  switch (currentMode) {
    case 'Normal':
      ({ inletFlow, outletFlow, pressure } =
        normalScenario(BASE_INLET, BASE_PRESSURE, randomInRange, addVariation));
      break;

    case 'Leakage':
      ({ inletFlow, outletFlow, pressure } =
        leakageScenario(randomInRange));
      break;

    case 'Theft':
      ({ inletFlow, outletFlow, pressure } =
        theftScenario(BASE_INLET, BASE_PRESSURE, randomInRange, addVariation));
      break;
  }

  return {
    zone,
    inletFlow: Number(inletFlow.toFixed(2)),
    outletFlow: Number(outletFlow.toFixed(2)),
    pressure: Number(pressure.toFixed(2)),

    // TEMPORARY tags — final logic will overwrite in processing-engine
    status: currentMode === 'Normal' ? 'Normal' : `${currentMode} Suspected`,
    confidence: currentMode === 'Normal' ? 'High' : 'Medium'
  };
}

/* ---------------- DATA DISPATCH ---------------- */

async function sendData(data) {
  try {
    await axios.post(API_URL, data);
    console.log(`✅ [${getSimulatedTime()}] Sent`, {
      zone: data.zone,
      mode: currentMode,
      inlet: data.inletFlow,
      outlet: data.outletFlow,
      pressure: data.pressure
    });
  } catch (error) {
    console.error(`❌ [${getSimulatedTime()}] Send failed:`, error.message);
  }
}

/* ---------------- MAIN LOOP ---------------- */

async function simulationLoop() {
  console.log(`\n⏰ [${getSimulatedTime()}] Mode: ${currentMode} | Night: ${isNightTime() ? 'Yes' : 'No'}`);

  decideMode();

  const sensorData = generateSensorData();
  await sendData(sensorData);

  advanceTime();
}

/* ---------------- INIT ---------------- */

function startSimulator() {
  console.log('🚀 Water Monitoring Sensor Simulator Started');
  console.log(`📡 API: ${API_URL}`);
  console.log(`⏱️  Interval: ${INTERVAL_MS / 1000}s`);
  console.log('─'.repeat(60));

  simulationLoop();
  setInterval(simulationLoop, INTERVAL_MS);
}

startSimulator();

process.on('SIGINT', () => {
  console.log('\n🛑 Simulator stopped');
  process.exit(0);
});