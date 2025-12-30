# Thresholds Explained

The system avoids "Hard Coding" fixed values. Instead, it uses relative thresholds:

### 1. Flow Deviation (20%)
* **Why?** A 20% margin accounts for sensor inaccuracy, friction loss in long pipes, and minor non-harmful leaks.
* **Adjustment:** This can be tightened (e.g., to 5%) for high-precision industrial setups.

### 2. Pressure Threshold (300 Units)
* **Why?** Pressure drop is the primary differentiator between theft and a burst pipe. A drop below 300 units (nominal) indicates a loss of vacuum/integrity in the line.

### 3. Temporal Windows
* **Theft Window (5 mins):** High-flow theft often happens in short bursts to avoid detection.
* **Leakage Window (10+ mins):** Leakages are physical breaks and do not stop until repaired; hence a longer validation window is used to confirm them.