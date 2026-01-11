// alerts/alertBuilder.js

const getSeverity = require("../rules/severityRules");

function buildAlert({ zone, classification, duration }) {
  const severity = getSeverity(
    classification.type,
    classification.confidence,
    duration
  );

  return {
    zone,
    type: classification.type,
    severity,
    confidence: classification.confidence,
    duration,
    message: generateMessage(classification.type, severity),
    timestamp: new Date(),
  };
}

function generateMessage(type, severity) {
  if (type === "Leakage") {
    return `Possible water leakage detected (${severity})`;
  }

  if (type === "Theft") {
    return `Possible water theft detected (${severity})`;
  }

  return "No abnormal activity detected";
}

module.exports = buildAlert;
