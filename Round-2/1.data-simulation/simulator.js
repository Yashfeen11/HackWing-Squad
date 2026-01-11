// simulator.js

const axios = require('axios');
const normalScenario = require('./scenarios/normal');
const leakageScenario = require('./scenarios/leakage');
const theftScenario = require('./scenarios/theft');
const time = require('./utils/time');

const API_URL = 'http://localhost:5000/api/readings';
const INTERVAL = 60000;
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

const BASE_INLET = 600;
const BASE_PRESSURE = 420;

let mode = 'NORMAL';
let modeDuration = 0;

function decideMode() {
  modeDuration++;

  if (mode === 'LEAKAGE' && modeDuration > 120) {
    mode = 'NORMAL';
    modeDuration = 0;
  }

  if (mode === 'THEFT' && modeDuration > 20) {
    mode = 'NORMAL';
    modeDuration = 0;
  }

  if (mode === 'NORMAL') {
    if (time.isEarlyMorning() && Math.random() < 0.15) {
      mode = 'LEAKAGE';
      modeDuration = 0;
    } else if (Math.random() < 0.05) {
      mode = 'THEFT';
      modeDuration = 0;
    }
  }
}

async function sendData(data) {
  try {
    await axios.post(API_URL, data);
    console.log(`✅ [${time.getTime()}]`, data.zone, mode);
  } catch (err) {
    console.error(`❌ [${time.getTime()}]`, err.message);
  }
}

async function loop() {
  decideMode();

  const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  let values;

  if (mode === 'LEAKAGE') {
    values = leakageScenario();
  } else if (mode === 'THEFT') {
    values = theftScenario(BASE_INLET, BASE_PRESSURE);
  } else {
    values = normalScenario(BASE_INLET, BASE_PRESSURE);
  }

  await sendData({
    zone,
    ...values
  });

  time.advanceTime();
}

console.log('🚀 Data Simulation Started');
setInterval(loop, INTERVAL);

