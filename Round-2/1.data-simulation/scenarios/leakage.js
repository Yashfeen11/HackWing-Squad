// scenarios/leakage.js
// Defines CONTINUOUS leakage behavior
// Leakage= Continous loss + Pressure Drop

function leakageScenario(randomInRange) {
  // Inlet is present
  const inletFlow = randomInRange(350, 450);

  // Large continuous loss
  const outletFlow = randomInRange(50, 150);

  // Pressure drops significantly
  const pressure = randomInRange(200, 300);

  return {
    inletFlow,
    outletFlow,
    pressure
  };
}

module.exports = leakageScenario;