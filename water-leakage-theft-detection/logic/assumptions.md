# System Assumptions

To ensure the reliability of the prototype, the following assumptions have been made:

1. **Sensor Calibration:** All flow and pressure sensors are assumed to be calibrated and providing linear outputs.
2. **Minimal Baseline Loss:** It is assumed that every plumbing system has a "non-zero" minimal loss due to evaporation or minor joint sweating (accounted for in the 20% tolerance).
3. **Usage Patterns:** Night-time (22:00 - 06:00) is assumed to be a "Low Demand" period where anomalies are more easily validated.
4. **Network Connectivity:** The system assumes a stable connection between the edge sensors and the central monitoring logic for real-time analysis.
5. **Point of Entry:** Theft is assumed to occur either via illegal suction pumps (increasing outlet flow) or physical bypasses between the two sensors.