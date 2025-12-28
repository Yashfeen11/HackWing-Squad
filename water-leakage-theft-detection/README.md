# HackWing Squad

Round 1 submission of Hack the Winter Hackathon

# Smart Water Leakage & Theft Detection System(IOT)
## Theme--
    Iot & Automation

## Problem Statement
    In many cities and town, a large amount of water is wasted either due to leakage in pipes and illegal water usage i.e theft
    These problems usually go unnoticed because there is no system that continously monitors the following 
    -> How much water is flowing through pipelines
    ->Is there any kind of water loss through it 

    Currently:
    1)Leakages are detected only after major damage
    2)Water theft is identified very late or not at all

    Consequences:
    ->A lot of clean water is wasted because of that water scarcity problems become worse.

    What needs to be done?
    ->An Iot Based system is needed that continously monitors water flow continously
    ->Compares expected and actual usage
    ->Detects abnormal patterns
    ->Sends alerts when leakage or theft is suspected.

# Proposed Solution
    We are building a solution that-

    1->Continously Monitor the Inlet and the Outlet water flow monitoring for the respective zones (refer pic-1). The entire water distribution pipeline is divided into multiple zones. Each zone is moitored independently which gives a precise analysis of where the problem is present.

    2->Baseline Condition-We calculate the difference between the inlet water quantity and outlet water quantity which gives us the basic infomation of the usage behavious of each zone.
    During this phase we get the following outcomes:
    a)Water flow and pressure data are collected at fixed time intervals (for example, every hour)
    b)Data is recorded over multiple days
    c)Average water usage patterns are calculated for different times of the day.

    3->Once the baseline condition is established, the system continously compare the Real-Time Sensor Readings with the Expected Values that are derived from the data (extracted from point 2) which signifies whether there is a differnce between inlet and outlet flow for each time interval.
    This differnce is compared with the Normal Loss Range
    There are two cases now
    CASE1-The differnce between the Real time and Expected Data is constant and the deviation is in acceptable limit the system marks it as an anomaly(We will examine it too)
    CASE2-The difference between the Real Time and Expected Data is huge and discontinous. This will be examined too.

    4->After detecting an anomoly the system applies behavior-based rules to classify the issue in two categories.
    a)Leakage Detection:-Leakage is identified when water loss occurs continuously over a long duration, especially during low-usage periods such as night hours.
    A gradual and stable loss pattern, often accompanied by a drop in water pressure, increases the confidence of leakage detection.

    b)Theft Detection:-Theft is identified when water loss appears suddenly for short durations and follows an irregular or spiky flow pattern.
    In such cases, pressure usually remains stable, indicating intentional water extraction rather than pipeline damage.

    5->Night Time Analysis:
    Now to strengthen our claim and for complete accuracy.
    The system uses time-based analysis to strengthen detection accuracy.

    During late-night hours, when water usage is expected to be minimal:
    Continuous inlet flow with little or no outlet usage strongly indicates leakage.
    Sudden spikes during specific hours suggest possible unauthorized usage.
    Time-based logic plays a crucial role in confirming suspicious events.

    6->Alert Generation and Localization

    Once the system determines the probable cause:
    An alert is generated with details such as zone, time, duration, and type of issue.
    Since the system operates zone-wise, the affected area is automatically localized.
    This helps authorities or maintenance teams take faster and targeted action.

    -->Our solution consits of structured layers that donot gives the output based on single assumptions, we recheck every situation based on various checkpoints that makes us confident on analysing whether it is a leakage condition or theft condition.

## Prototype Implementation(System Overview):

    1)Sensor data which collects the inlet water and outlet water values and the pressure values is simulated using software to represent real-world flow and pressure values.

    2)Software analyses patterns, The detection and classification logic is validated using multiple test scenarios.

    3)The focus is on verifying system feasibility rather than full hardware deployment.

--->For Round-1, sensor data is simulated to validate system logic.<---

## Hardware Components(Used in Prototype):
    Flow sensors (Inlet / Outlet)
    Pressure sensor
    ESP32 / ESP8266
-->Hardware Integration is planned in later stage<--

## TEAM HACKWING-SQUAD
MEMBER 1- TEAM LEADER-YASHFEEN
MEMBER 2- PREMRAJ SINGH
MEMBER 3- JAANVI CHAUHAN
MEMBER 4- NARENDRA HINDWAR

