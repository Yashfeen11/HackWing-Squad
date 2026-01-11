// rules/severityRules.js

function getSeverity(type, confidence, duration) {
  if (type === "Leakage" && confidence === "High" && duration >= 60) {
    return "Critical";
  }

  if (type === "Leakage") {
    return "High";
  }

  if (type === "Theft" && confidence === "High") {
    return "High";
  }

  if (type === "Theft") {
    return "Medium";
  }

  return "Low";
}

module.exports = getSeverity;
