# 🌊 Smart Water Leakage & Theft Detection System
### **HackWing – Round 2 Submission**


## 📌 Problem Statement
Water loss due to **leakage** and **unauthorized theft** is a critical challenge in modern urban infrastructure. Traditional systems are often reactive rather than proactive. 

**Our Goal:** Design an intelligent, scalable system that:
* 🛰️ **Simulates** realistic IoT water sensor data.
* 🧠 **Detects** anomalies (leakage/theft) using baseline logic.
* ⚠️ **Generates** real-time alerts.
* 📊 **Visualizes** system health via an intuitive dashboard.

---

## 💡 Proposed Solution
We have built a **modular, end-to-end architecture** that mimics a real-world utility grid. By utilizing a custom-built **Data Simulation Engine**, we can test complex scenarios without needing physical hardware.

> [!IMPORTANT]
> This submission focuses on **robust architecture, data logic, and modular scalability** as per Round 2 requirements.

---

## 🏗️ High-Level Architecture
The system follows a linear, high-integrity pipeline:



1.  **Simulation Layer:** Generates flow and pressure data.
2.  **Processing Engine:** Establishes baselines and identifies deviations.
3.  **Classification Layer:** Categorizes events (Normal vs. Leak vs. Theft).
4.  **Presentation Layer:** Persistent storage in MongoDB and Live Dashboard.

---

## 📂 Folder Structure
```text
Round-2/
├── 📁 1.data-simulation/       # IoT Flow & Pressure Simulators
├── 📁 2.processing-engine/     # Baseline logic & Anomaly detection
├── 📁 3.classification-alerts/ # Rule-based event categorization
├── 📁 4.storage-dashboard/    # Express server & Web UI
├── 📁 system.architecture/     # DFDs and Architecture Diagrams
└── 📁 Scalability-and-Failures/# Technical risk analysis
```

---

## 🔄 DATA FLOW EXPLANATION


### 📊 DATA FLOW STAGES
---

### Stage 01: Simulation
#### Component: Simulation Engine
**Technical Logic:**
- Uses simulator.js
- Generates time-aware inlet and outlet flow values
- Simulates pressure levels
- Supports predefined scenarios:
  - Normal
  - Leak
  - Theft

### Stage 02: Processing
#### Component: Processing Engine
**Technical Logic:**
- Compares real-time telemetry with historical baselines
- Calculates Flow Delta:
  Flow Delta = Inlet Flow - Outlet Flow

### Stage 03: Classification
#### Component: Classification Engine
**Decision Logic:**
- Leakage:
  - High Flow Delta
  - Drop in Pressure
- Theft:
  - High Flow Delta
  - Consistent Pressure
- Normal:
  - Flow Delta within ±5% tolerance

### Stage 04: Storage
#### Component: Data Storage
**Technical Logic:**
- Pushes processed data to MongoDB
- Uses REST APIs
- Ensures persistence for historical trend dashboards

### 🚨 FAILURE HANDLING & SCALABILITY
---

The system is designed to handle real-world constraints:

#### Sensor Drift Handling:
- Kalman Filters are implemented
- Smooths noisy sensor data

#### Network Latency Handling:
- Local caching mechanism
- Activates when database is unreachable

#### Horizontal Scalability:
- Each module can scale independently:
  - Simulation
  - Processing
  - Storage
- Microservice-based deployment model

#### Detailed Failure Analysis Reference:
Path: Round-2/Scalability-and-Failures/system-failures.md

### 🧪 PROTOTYPE & DEMO
![UI](/Round-2/UI.png)

  > For full demo refer to the readme the 4.storage-dashboard/server
---

#### Simulator:
- Generates active telemetry
- Enables real-time testing scenarios
- To run simulator refer to the readme in 4.storage-dashboard/server

#### Backend:
- Express.js server
- Handles:
  - Data ingestion
  - Alert triggering

#### UI:
- Built using HTML, CSS and JS
- Visual monitoring of:
  - Leak locations
  - System health metrics

### 👥 TEAM & COLLABORATION
  - Folder 1 - Jaanvi
  - Folder 2 - Yashfeen [ Leader ]
  - Folder 3 - Narendra
  - Folder 4 - Premraj
---

#### Workflow:
- GitHub Feature-Branch strategy
- Peer-reviewed Pull Requests

#### Design Principles:
- Strict Separation of Concerns (SoC)
- Enables independent component updates

#### Documentation:
- Modular README files
- Provided within each sub-directory
- Improves developer clarity and onboarding

---

