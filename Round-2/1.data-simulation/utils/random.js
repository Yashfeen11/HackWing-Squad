// utils/random.js
// Utility functions for controlled randomness

/**
 * Generate random number in range [min, max)
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Add percentage-based variation to a value
 * Simulates sensor noise
 */
function addVariation(value, percentage = 5) {
  const variation = value * (percentage / 100);
  return value + randomInRange(-variation, variation);
}

module.exports = {
  randomInRange,
  addVariation
};