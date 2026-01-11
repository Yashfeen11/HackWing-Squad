# Processing Engine

The Processing Engine is the core analytical component of the water leakage and theft detection system.  
It is responsible for converting raw sensor data into meaningful decisions using rule-based logic.

This module operates independently of data storage, dashboards, and alerting systems, ensuring a clean separation of concerns.

---

## Purpose

- Establish baseline water usage patterns
- Detect anomalies in real-time sensor data
- Classify anomalies into Leakage, Theft, or Normal conditions

---


## Module Responsibilities

### 1. Baseline Calculation
The baseline module analyzes historical sensor readings to compute average inlet flow, outlet flow, and pressure values.  
These values represent normal operating conditions for a given zone.

**Output:**
- Average inlet flow
- Average outlet flow
- Average pressure

---

### 2. Anomaly Detection
The anomaly detector compares the current sensor reading against the baseline values.

It identifies:
- Excessive water loss
- Significant pressure drops

**Output:**
- Whether an anomaly is detected
- Water loss percentage
- Pressure drop percentage

---

### 3. Classification
Once an anomaly is detected, the classification module applies rule-based logic to determine the type of issue.

Classification is based on:
- Water loss percentage
- Pressure variation
- Duration of abnormal behavior

**Possible classifications:**
- Leakage
- Theft
- Normal

Each classification also includes a confidence level.

---

### 4. Threshold Management
All operational thresholds (loss limits, pressure limits, duration constraints) are centralized in a single configuration file.

This design allows:
- Easy tuning
- Clear explainability
- No hard-coded values in logic

---

## Processing Flow

[ Current Sensor Reading ]
     |
     |  sensor data
     v
[ Baseline Calculation ]
     |
     |  calculations
     v
[ Anomaly Detection ]
     |
     |  classified result
     v
[ Classification & Alerts ]
     |
     |  Leakage,Theft,Normal
     v
[ Structured Output ]


---

## Entry Point

The `index.js` file serves as the single entry point for the processing engine.

### Input:
- Current sensor reading
- Historical sensor readings
- Duration of anomaly (in minutes)

### Output:
- Baseline values
- Anomaly details
- Final classification with confidence

---

## Design Principles

- Rule-based and explainable logic
- Modular and testable components
- Independent of database and UI layers
- Easily integrable with backend services

---

## Integration

This module is consumed by the backend service, which:
- Supplies sensor data
- Receives classification results
- Passes results to the alert generation layer

The processing engine does not directly interact with databases or dashboards.

---

## Why This Approach

This architecture mirrors real-world smart infrastructure systems where:
- Data collection
- Decision-making
- Action/alerting
are handled by separate layers.

This improves scalability, maintainability, and reliability.

---
