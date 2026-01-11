// index.js
// Entry point for Classification-Alerts layer

const buildAlert = require("./alerts/alertBuilder");

function generateAlert(processingResult, duration = 0) {
  if (!processingResult || processingResult.classification.type === "Normal") {
    return null;
  }

  return buildAlert({
    zone: processingResult.zone,
    classification: processingResult.classification,
    duration,
  });
}

module.exports = {
  generateAlert,
};
