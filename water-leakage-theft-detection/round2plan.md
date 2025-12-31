# Round 2 Plan — Water Leakage & Theft Detection

## Goal
Build a complete, production-ready solution that covers:
- component interactions
- scalability and growth handling
- failure detection and mitigation
- a full system architecture
- clear documentation for every part of the project

---

## Table of Contents
1. Full hardware integration
2. System architecture
3. Scalability & growth handling
4. Failure handling
5. Monitoring dashboard & visualization
6. Testing & miscellaneous
7. Team contributions

---

## 1. Full Hardware Integration 🔧
In Round 1 we used simulated sensor data to validate our logic. For Round 2 we will:
- Integrate with real sensors (ESP modules, flow meters, etc.)
- Validate data acquisition and communication layers
- Document hardware deployment and wiring diagrams

---

## 2. System Architecture 🏗️
We will define how components interact and where processing happens. The design includes a centralized processing module responsible for:
- Baseline learning
- Anomaly detection
- Classification (leakage vs theft vs normal)

Key considerations:
- Clear data flow between sensors, ingestion service, processing module, and dashboard
- Modular interfaces so components can be replaced or scaled independently

---

## 3. Scalability & Growth Handling 🌱
The system is zone-based so it can scale horizontally.
How growth is handled:
- Modular, zone-based design: add new zones without changing detection logic
- Per-zone storage and time-based records
- Independent processing per zone to avoid cross-zone interference

Data handling:
- Zone-wise storage
- Time-series records for analysis and model updates
- Partitioning strategies to keep reads/writes efficient

This architecture allows scaling without affecting existing zones.

---

## 4. Failure Handling ⚠️
We will cover failure scenarios not fully addressed in Round 1:
- Sensor failures — detect unrealistic, stuck, or missing values
- Network failures — ESP connectivity and retry/backoff logic
- False positives — multi-layer validation and confidence scoring
- Partial system failures — degrade gracefully so one zone’s failure does not affect others

Mitigation strategies:
- Health checks and heartbeats for devices
- Buffering and retry queues at the ingestion layer
- Alerts for persistent anomalies and automated fallbacks

---

## 5. Monitoring Dashboard & Visualization 📊
Prototype a dashboard that provides:
- Zone-wise inlet/outlet flow and trends
- Real-time alerts and notifications
- Graphical visualizations for historical and live data
- A clean, user-friendly interface for operations teams

---

## 6. Testing & Miscellaneous ✅
Include test plans to cover operational scenarios:
- Normal operation
- Continuous leakage
- Sudden theft
- Suspicious (ambiguous) cases
- Detection accuracy and response time

Also include deployment checklists, runbooks, and maintenance procedures.

---

## Team Contribution Breakdown
- Member 1 — System design & architecture
- Member 2 — Detection logic & analysis
- Member 3 — Hardware & communication planning
- Member 4 — Dashboard, documentation, and diagrams


