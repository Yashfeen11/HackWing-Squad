// utils/time.js
// Handles simulated time logic for the IoT simulator

let hour = 0;
let minute = 0;

/**
 * Get current simulated time in HH:MM format
 */
function getTime() {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Advance simulated time by one minute
 */
function advanceTime() {
  minute++;
  if (minute >= 60) {
    minute = 0;
    hour = (hour + 1) % 24;
  }
}

/**
 * Check if current time is night (22:00 – 06:00)
 */
function isNightTime() {
  return hour >= 22 || hour < 6;
}

/**
 * Check if current time is early morning (leakage-prone window)
 */
function isLeakageTime() {
  return hour >= 1 && hour < 5;
}

/**
 * Reset simulated time (used at startup)
 */
function resetTime() {
  hour = 0;
  minute = 0;
}

/** Export all time-related functions */

module.exports = {
  getTime,
  advanceTime,
  isNightTime,
  isLeakageTime,
  resetTime
};