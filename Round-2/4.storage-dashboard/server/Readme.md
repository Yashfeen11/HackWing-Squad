# Smart Water Leakage & Theft Detection System

## Overview

This project is a web-based monitoring dashboard for an IoT system designed to detect water leakage and unauthorized water theft in real-time. The system analyzes inlet flow, outlet flow, and pressure sensor data to identify anomalies such as:

- **Water Leakage**: Continuous water loss with significant flow discrepancies
- **Water Theft**: Unauthorized water extraction indicated by outlet flow exceeding inlet flow
- **Pressure Drops**: System pressure abnormalities that may indicate infrastructure issues

Currently, the system uses simulated sensor data to demonstrate functionality. Real hardware integration with ESP32 microcontrollers and physical flow/pressure sensors is planned for future development phases.

## Tech Stack

**Backend**
- Node.js with Express.js
- RESTful API architecture

**Database**
- MongoDB (Local instance)
- Mongoose ODM for data modeling

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript (No frameworks)

**Sensor Simulation**
- Node.js script simulating IoT sensor behavior
- Generates realistic normal, leakage, and theft scenarios

## Project Structure

```
water-monitoring-dashboard/
│
├── server.js                 # Main Express server
├── package.json              # Node.js dependencies
├── .env                      # Environment
├── models/
│   └── Reading.js            # MongoDB schema for sensor readings
│
├── routes/
│   └── readings.js           # API endpoints for sensor data
│
├── public/                   # Frontend files
│   ├── index.html            # Dashboard interface
│   ├── style.css             # Styling
│   └── script.js             # Frontend logic
│
└── simulator/
    └── simulator.js          # Sensor data simulator
```

### Key Components

- **server.js**: Initializes the Express server, connects to MongoDB, and serves the frontend
- **models/Reading.js**: Defines the data structure for sensor readings stored in the database
- **routes/readings.js**: Handles API requests for creating and retrieving sensor data
- **public/**: Contains the web dashboard that displays real-time and historical sensor data
- **simulator/simulator.js**: Generates and sends simulated sensor data to the API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local installation)
- MongoDB Compass (Optional, for database visualization)

## Setup Instructions

### 1. Install MongoDB

Download and install MongoDB Community Edition from the official website. Ensure MongoDB is running on the default port (27017).

### 2. Clone or Download the Project

Place all project files in a directory following the structure shown above.

### 3. Install Dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

This will install the required Node.js packages:
- express
- mongoose
- dotenv
- axios (for simulator)

### 4. Configure Environment (Optional)

Create a `.env` file in the root directory if you need to customize settings:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/water_monitoring
```

If the `.env` file is not present, the application will use default values.

### 5. Start the Backend Server

In the project root directory, run:

```bash
node server.js
```

You should see confirmation messages:
- MongoDB Connected
- Server running on http://localhost:5000

### 6. Access the Dashboard

Open a web browser and navigate to:

```
http://localhost:5000
```

The dashboard will load but will show "No data" until the simulator is started.

## Running the Simulator

The simulator script generates realistic sensor data and sends it to the backend API.

### Start the Simulator

Open a **new terminal window** (keep the server running in the first terminal) and run:

```bash
node simulator/simulator.js
```

### Simulator Behavior

- Sends sensor data every 1 minute
- Simulates three operating modes:
  - **Normal**: Typical water flow with 2-5% loss
  - **Leakage**: High inlet flow, very low outlet flow, pressure drops (more frequent during night hours)
  - **Theft**: Outlet flow exceeds inlet flow (random short-duration spikes)
- Logs all transmitted data to the console
- Continues running until manually stopped (Ctrl+C)

### What Happens Next

- Dashboard automatically refreshes every 5 seconds
- New readings appear in the "Recent History" table
- Alert box displays when leakage or theft is detected
- Data is permanently stored in MongoDB

## Viewing Data in MongoDB

To inspect stored sensor readings:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to the `water_monitoring` database
4. Open the `readings` collection
5. View all stored sensor data with timestamps

## API Endpoints

The system exposes three REST API endpoints:

### POST /api/readings
Create a new sensor reading

**Request Body:**
```json
{
  "zone": "Zone A",
  "inletFlow": 45.5,
  "outletFlow": 45.2,
  "pressure": 65.3,
  "status": "Normal",
  "confidence": "High"
}
```

### GET /api/readings/latest
Retrieve the most recent sensor reading

### GET /api/readings/history
Retrieve the last 10 sensor readings sorted by timestamp

## Testing with Postman

You can manually test the API using Postman or any HTTP client by sending POST requests to `http://localhost:5000/api/readings` with the JSON format shown above.

## Notes and Limitations

### Current Implementation

- This is a **demonstration system** using simulated sensor data
- No user authentication or authorization
- Single-user local deployment
- Data stored in local MongoDB instance

### Hardware Integration

- The API and dashboard are **hardware-agnostic**
- Real IoT sensors (flow meters, pressure sensors) will replace the simulator in future phases
- Hardware will use ESP32 microcontrollers to send data via HTTP POST requests
- No changes to the backend or frontend will be required for hardware integration

### Future Enhancements

- Real-time alerts via email or SMS
- Advanced analytics and trend visualization
- Multi-zone monitoring with zone-specific thresholds
- Cloud deployment for remote access
- Mobile application

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `sudo systemctl status mongod` (Linux) or check Services (Windows)
- Verify connection string in `.env` or server.js

**Port Already in Use**
- Change the PORT in `.env` to a different value (e.g., 5001)

**Simulator Not Sending Data**
- Ensure the backend server is running first
- Check that the API_URL in simulator.js matches your server address

**Dashboard Not Updating**
- Check browser console for JavaScript errors
- Verify the backend server is running and accessible
- Clear browser cache and reload