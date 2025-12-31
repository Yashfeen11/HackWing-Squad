# Goal of Round 2
The Plan is to build a complete solution in which we have the following
* How components interact with each other
* How it can be scaled
* How the Failures can be handled
* A complete system architecture
* A complete explanation of every part of the project

# TABLE OF CONTENTS
1)Full Hardware Integration
2)Complete System Architecture
3) Scalability and Growth Handling
4)Failure Handling
5)Monitoring Dashboard & Visualization
6) Miscellaneous Handlings


## 1)Full Hardware Logic
In Round 1, the sensor data are simulated to validate the logic 
In Round 2, the system will be implemeted to a real hardware implementation and how it can be implemented in real scenerios

## 2)Complete System Architecture
In Round 2, we will define how all the system components interact with each other and how the logic flows between them. There will be a centralized processing module performing 
*BASELINE LEARNING
*ANOMALY DETECTION
*CLASSIFICATION

## 3)Scalability & Growth Handling
As per our model, our system is planned to support many zones and users, and this will make it more accurate and easier to work with. Each zone will have its own readings, which won't contradict the readings of the other zones, and if any problem persists, we can accurately get the data and the location where the problem arises.

How is growth handled?
*Modular, zone-based design
*Addition of a new zone only when required
*No change in the Detection Logic

DATA GROWTH HANDLING?
*Data is divided into zone wise sotrage
*Time-based records 
*Independent Processing per zone

    This architecture allows scaling without affecting the existing zones, which makes it easy for scalability and growth handling

## 4)Failure Handling
In Round 2, we will cover the failure scenerios which is not fully covered in Round 1, such as:
Sensor Failures- Detection of unrealistic or missing values
Network Failures- ESP connectivity
False Positive- Improved decision logic and multi-layer validation and confidence-based decisions
Partial System failure- One zone failure does not effect other

## 5)Monitoring Dashboard and Visualization
A simple dashboard will be implemented or prototyped, which gives the following features:
* Zone-wise inlet and outlet flow data
* Real-time alerts
* Graphical Representation for better analysis
* User-Friendly Dashboard

## 6) Miscellaneous Handlings
In Round 2, we will include various testing plans and other miscellaneous handling that are not present in Round 1.
Some scenarios, such as:
* Normal Operation
* Continuous Leakage
* Sudden theft
* Suspicious cases
* Accurate Detection
* Response time

# TEAM CONTRIBUTION BREAKDOWN
    MEMBER 1: SYSTEM DESIGN AND ARCHITECTURE
    MEMBER 2: DETECTION LOGIC AND ANALYSIS
    MEMBER 3: HARDWARE AND COMMUNICATION PLANNING
    MEMBER 4: DASHBOARD, DOCUMENTATION, AND DIAGRAMS
