# 📁 Data Simulation Module

### Water Leakage & Theft Detection System

---

## 📌 Overview

The Data Simulation Module generates realistic IoT sensor data for a smart water distribution system.  
Instead of relying on physical hardware during early development, this module simulates real-world sensor behavior under multiple operational conditions such as normal usage, water leakage, and water theft.

The generated data is periodically sent to the backend API, enabling seamless testing, validation, and visualization of the complete system without deploying actual sensors.

---

## 🎯 Objective

This module is designed to:

- Simulate realistic water flow and pressure sensor readings
- Recreate real-world operating scenarios:
  - Normal water usage
  - Continuous water leakage
  - Sudden unauthorized water usage (theft)
- Generate time-aware and zone-specific data
- Keep data generation independent from detection logic

---

## ⚠️ Note

This module only generates data.  
Detection and decision-making are handled by the Processing Engine module.

---

## 🧠 System Assumptions

Each water distribution zone consists of:

- Inlet Flow Sensor – measures incoming water
- Outlet Flow Sensor – measures water consumption
- Pressure Sensor – monitors pipeline pressure
- Time Reference – captures day/night usage patterns

The system is divided into multiple zones to enable localized monitoring and analysis.

---

---

## 🔁 Working Mechanism

- A simulated clock runs at minute-level resolution
- For each time step:
  - The current scenario is selected
  - Sensor values are generated accordingly
  - Data is tagged with zone ID and timestamp
  - The payload is sent to the backend API

The process runs continuously, mimicking real IoT data streams.

---

## 🧪 Simulation Scenarios

### 1️⃣ Normal Usage

Represents standard daily water consumption.

**Characteristics:**

- Inlet and outlet flow are nearly equal
- Minor unavoidable losses (2–5%)
- Stable pressure levels

Used to establish baseline consumption patterns.

---

### 2️⃣ Leakage Scenario

Simulates pipeline cracks or seepage.

**Characteristics:**

- Persistent difference between inlet and outlet flow
- Outlet flow significantly lower than inlet
- Gradual pressure drop
- Long-duration behavior

Accurately models real-world leakage conditions.

---

### 3️⃣ Theft Scenario

Simulates unauthorized or illegal water usage.

**Characteristics:**

- Sudden spikes in consumption
- Outlet flow may temporarily exceed inlet flow
- Pressure remains mostly stable
- Short-duration events, often during nighttime

Models illegal tapping or meter bypassing.

---

## ⏱️ Time-Based Behavior

The simulator incorporates realistic time awareness:

**Night (22:00 – 06:00):**

- Lower expected water usage
- Sudden spikes are highly suspicious

**Early Morning (01:00 – 05:00):**

- Higher probability of leakage events

Scenario durations vary to reflect real behavior:

- Leakage → long duration
- Theft → short bursts

---

## 🎲 Sensor Noise & Randomness

To prevent unrealistic, perfectly clean data:

- Controlled randomness is added to sensor values
- Simulates:
  - Sensor inaccuracies
  - Environmental variations

This ensures the generated data closely resembles real-world IoT data.

---

## 📤 Output Data Format

Each simulation cycle produces structured JSON data:

```json
{
  "zone": "Zone A",
  "inletFlow": 612.45,
  "outletFlow": 548.32,
  "pressure": 412.78,
  "status": "Normal",
  "confidence": "High"
}
```
