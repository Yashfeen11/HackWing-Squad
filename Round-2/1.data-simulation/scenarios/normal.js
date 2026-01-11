// scenarios/normal.js
// Defines how NORMAL water usage behaves

function normalScenario(BASE_INLET, BASE_PRESSURE, randomInRange, addVariation) {
  // Inlet with small variation
  const inletFlow = addVariation(BASE_INLET, 10);

  // Small unavoidable loss (2–5%)
  const outletFlow = inletFlow * randomInRange(0.95, 0.98);

  // Pressure remains stable
  const pressure = addVariation(BASE_PRESSURE, 5);

  return {
    inletFlow,
    outletFlow,
    pressure
  };
}

module.exports = normalScenario;