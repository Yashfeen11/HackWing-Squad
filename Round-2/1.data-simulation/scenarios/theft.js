// scenarios/theft.js
// Defines SUDDEN unauthorized usage (theft)

function theftScenario(BASE_INLET, BASE_PRESSURE, randomInRange, addVariation) {
  // Sudden spike in inlet
  const inletFlow = addVariation(BASE_INLET + 100, 15);

  // Outlet exceeds inlet (illegal tapping)
  const outletFlow = inletFlow * randomInRange(1.15, 1.35);

  // Pressure mostly stable
  const pressure = addVariation(BASE_PRESSURE, 8);

  return {
    inletFlow,
    outletFlow,
    pressure
  };
}

module.exports = theftScenario;