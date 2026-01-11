
# 🏗️ System Architecture  
**Smart Water Leakage & Theft Detection System**

---

## 📌 Architecture Overview

The system follows a **layered and modular architecture** to ensure scalability, fault isolation, and easy future integration with real IoT hardware.

Each module is independently designed and mapped directly to the project folder structure.

---

## 🔁 High-Level System Architecture Flow


┌────────────────────┐
│  IoT Sensor Layer  │
│ (Simulated Sensors)│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│   Data Ingestion   │
│   Backend API      │
│ (Node.js + Express)│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│   Processing       │
│   Engine           │
│ (Baseline + Anomaly│
│   Detection)       │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Classification &   │
│ Alert Engine       │
│ (Leakage / Theft)  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Storage Layer      │
│ (MongoDB)          │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Dashboard & UI     │
│ (Visualization &   │
│ Alerts Display)    │
└────────────────────┘

## 🧩 Component-wise Architecture Description


### 1️⃣ Data Simulation / IoT Layer  
**Folder:** `1.data-simulation`

This layer simulates real-world IoT water sensors and acts as the data source for the entire system.

**Responsibilities:**
- Generate inlet flow, outlet flow, and pressure data
- Assign zone identifiers and timestamps
- Simulate realistic scenarios:
  - Normal water usage
  - Continuous leakage
  - Sudden theft events

**Why this layer exists:**
- Eliminates dependency on physical hardware during development
- Allows controlled testing of different failure scenarios
- Makes the system hardware-ready for future deployment

The generated data is periodically sent to the backend API.



### 2️⃣ Backend & Data Ingestion Layer  
**Folder:** `4.storage-dashboard/server`  
**Technology:** Node.js + Express

This layer serves as the central communication hub of the system.

**Responsibilities:**
- Receive sensor data via REST APIs
- Validate incoming requests
- Store raw readings in the database
- Expose APIs for dashboard visualization

**Design Rationale:**
- Decouples data generation from processing
- Enables multiple data sources (simulator or real sensors)
- Supports scalability and load balancing

---

### 3️⃣ Processing Engine  
**Folder:** `2.processing-engine`

This layer is the core intelligence unit responsible for analyzing sensor data.

#### 🔹 Baseline Calculator
- Builds a normal water usage profile using historical data
- Computes average inlet flow, outlet flow, and pressure
- Accounts for time-based usage variations (day/night)

#### 🔹 Anomaly Detector
- Compares current readings against the baseline
- Calculates water loss percentage and pressure deviation
- Flags abnormal behavior while minimizing false positives

This layer ensures that detection is adaptive and context-aware.

---

### 4️⃣ Classification & Alert Engine  
**Folder:** `3.classification-alerts`

This layer converts detected anomalies into meaningful classifications and alerts.

#### 🚰 Leakage Classification
- Continuous water loss over long duration
- Typically occurs during low-usage hours
- Often accompanied by a pressure drop
- Smooth and stable loss pattern

#### 🚨 Theft Classification
- Sudden spikes in outlet flow
- Short-duration events
- Pressure remains relatively stable
- Irregular and sharp flow changes

**Alert Attributes:**
- Issue type (Leakage / Theft)
- Severity level (Low / Medium / High)
- Confidence score
- Duration of anomaly

⚠️ For Round 2, alerts are simulated to validate logic without full notification integration.

---

### 5️⃣ Storage Layer  
**Technology:** MongoDB

This layer persists both raw and processed data.

**Stored Data:**
- Raw sensor readings
- Anomaly analysis results
- Classified alerts

**Why MongoDB:**
- Flexible schema for evolving data models
- High write throughput for sensor data
- Easy scalability for large deployments

---

### 6️⃣ Dashboard & Visualization Layer  
**Folder:** `4.storage-dashboard/public`

This layer provides a user-facing interface for monitoring and analysis.

**Features:**
- Real-time visualization of sensor data
- Zone-wise alert display
- Historical data trends

**Purpose:**
- Helps authorities quickly identify affected zones
- Enables faster decision-making and response
- Improves transparency and monitoring efficiency

---
