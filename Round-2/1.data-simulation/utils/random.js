// utils/random.js

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function addVariation(value, percentage = 5) {
  const variation = value * (percentage / 100);
  return value + randomInRange(-variation, variation);
}

module.exports = {
  randomInRange,
  addVariation
}; 