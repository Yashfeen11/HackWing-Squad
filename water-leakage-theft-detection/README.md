# HackWing Squad

Round 1 submission of Hack the Winter Hackathon

# Smart Water Leakage & Theft Detection System(IoT)
## Theme
    IoT & Automation

## Table of Contents
- Problem Statement
- Proposed Solution
- Prototype Implementation
- Hardware Components
- Getting Started
- Data Format
- Team

## Problem Statement
In many cities and towns, a large amount of water is wasted either due to leakage in pipes or illegal water usage, i.e., theft.
    These problems usually go unnoticed because there is no system that continuously monitors the following. 

* How much water is flowing through pipelines
* Is there any kind of water loss through it 

> Currently:
* Leakages are detected only after major damage
* Water theft is identified very late or not at all

> Consequences:
* A lot of clean water is wasted because of that water scarcity problems becoming worse.

> What needs to be done?
* An IoT-based system is needed that continuously monitors water flow.
* Compares expected and actual usage
* Detects abnormal patterns
* Sends alerts when leakage or theft is suspected.

# Proposed Solution
We are building a system that continuously monitors water distribution using a zone-based approach to detect leakage and unauthorized water usage.

1) Continuously monitor inlet and outlet water flow for the respective zones (refer to pic-1).
    The entire water distribution pipeline is divided into multiple zones. Each zone is monitored independently, which gives a precise analysis of where the problem is present.
    For every zone:
    > An inlet flow sensor measures the water entering the zone.

    > An outlet flow sensor measures the water being consumed.

    > A pressure sensor monitors pipeline pressure.
    This independent zone-wise monitoring helps localize problems effectively.

2) `Baseline Condition:-`
    Baseline is not just a difference; it is expected outlet behaviour over time and gives us a normal loss percentage.
    We calculate the difference between the inlet water quantity and the outlet water quantity, which gives us the basic information on the usage behaviour of each zone.
    During this phase, we get the following outcomes:
    > Water flow and pressure data are collected at fixed time intervals (for example, every hour)

    > Data is recorded over multiple days

    > Average water usage patterns are calculated for different times of the day.

3) Once the baseline condition is established, the system continuously compares real-time sensor readings with expected values derived from the baseline data, determining whether there is a difference between inlet and outlet flow for each time interval.
This difference is compared with the normal loss range.
There are two cases now.

    `CASE 1` The difference between the Real time and Expected Data is constant, and the deviation is in acceptable limit, the system marks it as normal.

    `CASE 2` The difference between the real-time and expected data is large and discontinuous; the system flags it as an anomaly for further analysis.

  4) After detecting an anomaly, the system applies behaviour-based rules to classify the issue into two categories.

 * `Leakage Detection` Leakage is identified when water loss occurs continuously over a long duration, especially during low-usage periods such as night hours. A gradual and stable loss pattern, often accompanied by a drop in water pressure, increases the confidence of leakage detection.

 * `Theft Detection` Theft is identified when water loss appears suddenly for short durations and follows an irregular or spiky flow pattern.

    > In such cases, pressure usually remains stable, indicating intentional water extraction rather than pipeline damage.

5) `Night Time Analysis`:

    Now, to strengthen our claim and for complete accuracy.
    The system uses time-based analysis to strengthen detection accuracy.

    During late-night hours, when water usage is expected to be minimal:
    Continuous inlet flow with little or no outlet usage strongly indicates leakage.
    Sudden spikes during specific hours suggest possible unauthorized usage.
    Time-based logic plays a crucial role in confirming suspicious events.

6) `Alert Generation and Localization`

    Once the system determines the probable cause:
    An alert is generated with details such as zone, time, duration, and type of issue.
    Since the system operates zone-wise, the affected area is automatically localized, helping authorities or maintenance teams take faster and targeted action.

    >Our solution consists of structured layers and does not rely on single assumptions; we recheck each situation using multiple checkpoints to increase confidence when classifying leakage or theft.

## Prototype Implementation(System Overview):

1) Sensor data, which collects the inlet water and outlet water values and the pressure values, is simulated using software to represent real-world flow and pressure values.

2) Software analyses patterns. The detection and classification logic is validated using multiple test scenarios.

3) The focus is on verifying system feasibility rather than full hardware deployment.

    > For Round-1, sensor data is simulated to validate system logic.

## Getting Started
- Prerequisites: No physical hardware required for the prototype; simulation scripts are in the `simulation/` folder.
- Usage: Run simulation scripts in `simulation/` to generate and analyze sensor data (see script headers for usage examples). Use the `data/sample_data.csv` file as input for scenarios.

## Data Format
- Expected CSV columns: `timestamp` (ISO 8601), `zone_id`, `inlet_flow_lpm`, `outlet_flow_lpm`, `pressure_kpa`.
- Units: flow in liters per minute (L/min), pressure in kilopascals (kPa).

## Hardware Components(Used in Prototype):
1) `Arduino UNO` — Microcontroller used for local sensor reading and control during prototyping.
2) `ESP32C3` — Low-power Wi‑Fi/Bluetooth MCU alternative for secure and efficient connectivity.
3) `Gravity Analog Water Pressure Sensor` — Analog pressure sensor for measuring pipeline pressure levels.
4) `YF-S201 Water Flow Meter` — Hall-effect flow meter used to measure volumetric water flow rate.

    > [!NOTE]
    >Hardware Integration is planned in later stage

## TEAM HACKWING-SQUAD
* MEMBER 1: YASHFEEN `TEAM LEADER`
* MEMBER 2: PREMRAJ SINGH
* MEMBER 3: JAANVI CHAUHAN
* MEMBER 4: NARENDRA HINDWAR

