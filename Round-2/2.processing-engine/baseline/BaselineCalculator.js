// baseline/baselineCalculator.js

function calculateBaseline(readings) {
  if (!readings || readings.length === 0) return null;

  let totalInlet = 0;
  let totalOutlet = 0;
  let totalPressure = 0;

  readings.forEach(r => {
    totalInlet += r.inletFlow;
    totalOutlet += r.outletFlow;
    totalPressure += r.pressure;
  });

  return {
    avgInlet: totalInlet / readings.length,
    avgOutlet: totalOutlet / readings.length,
    avgPressure: totalPressure / readings.length
  };
}

module.exports = calculateBaseline;