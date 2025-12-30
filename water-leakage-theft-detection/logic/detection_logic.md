# Detection & Classification Logic

## 1. Purpose
This document outlines the rule-based decision engine of the Water Monitoring System. It explains how the system differentiates between normal operations, pipe leakages, and illegal water theft.

## 2. Key Inputs
The logic engine processes the following real-time parameters:
* **Inlet Flow (L/min):** Water entering the main supply line.
* **Outlet Flow (L/min):** Water reaching the end-user or sub-station.
* **Line Pressure (PSI/Bar):** Internal pressure of the pipeline.
* **Time of Day:** To account for diurnal usage patterns (e.g., Night vs. Day).
* **Duration:** The continuous time for which an anomaly persists.

## 3. Baseline Definition (Normal Status)
"Normal" is not a fixed number. The system defines stability as:
* Flow Deviation stays within an acceptable percentage (e.g., < 20%).
* Pressure remains consistent with the pump's output.
* Outlet flow follows the expected usage curve based on historical hourly data.

## 4. Anomaly Detection Process
An anomaly is triggered only when the following conditions are met:
1. **Deviation Check:** `|Inlet Flow - Outlet Flow| > Allowed Threshold`.
2. **Persistence Check:** The deviation must persist for more than `N` consecutive readings to filter out sensor "noise" or air bubbles.

## 5. Classification Logic
Once an anomaly is confirmed, the system classifies it:

| Feature | Leakage Indicators | Theft Indicators |
| :--- | :--- | :--- |
| **Flow Pattern** | Continuous, steady loss. | Sudden, high-volume spikes. |
| **Pressure** | Significant drop in line pressure. | Stable or slightly fluctuating pressure. |
| **Timing** | Often detected during low-usage (Night). | Can happen anytime (often during peak hours). |
| **Duration** | Long-term and persistent. | Short to medium bursts. |

### Pseudo-Logic:
```text
IF (FlowLoss > Threshold) {
    IF (Pressure < Normal AND Duration > Long) 
        RETURN "Probable Leakage";
    ELSE IF (OutletFlow > InletFlow OR SuddenSpike) 
        RETURN "Probable Theft/Bypass";
    ELSE 
        RETURN "Suspicious Activity - Investigation Required";
}