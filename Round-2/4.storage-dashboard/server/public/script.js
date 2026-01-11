// script.js

// API Base URL
const API_URL = '/api/readings';

// DOM Elements
const zoneEl = document.getElementById('zone');
const statusEl = document.getElementById('status');
const confidenceEl = document.getElementById('confidence');
const timestampEl = document.getElementById('timestamp');
const inletFlowEl = document.getElementById('inlet-flow');
const outletFlowEl = document.getElementById('outlet-flow');
const pressureEl = document.getElementById('pressure');
const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const historyBody = document.getElementById('history-body');
const refreshBtn = document.getElementById('refresh-btn');

// Fetch Latest Reading
async function fetchLatest() {
    try {
        const response = await fetch(`${API_URL}/latest`);
        if (!response.ok) {
            throw new Error('No data available');
        }
        const data = await response.json();
        updateCurrentStatus(data);
    } catch (error) {
        console.error('Error fetching latest:', error);
        showNoData();
    }
}

// Update Current Status Display
function updateCurrentStatus(reading) {
    zoneEl.textContent = reading.zone;
    statusEl.textContent = reading.status;
    confidenceEl.textContent = reading.confidence;
    timestampEl.textContent = formatDate(reading.timestamp);

    inletFlowEl.textContent = reading.inletFlow.toFixed(2);
    outletFlowEl.textContent = reading.outletFlow.toFixed(2);
    pressureEl.textContent = reading.pressure.toFixed(2);

    // Show alert if status is not Normal
    if (reading.status !== 'Normal') {
        alertBox.classList.remove('hidden');
        alertMessage.textContent = `${reading.status} detected in ${reading.zone} with ${reading.confidence} confidence`;
    } else {
        alertBox.classList.add('hidden');
    }
}

// Show No Data Message
function showNoData() {
    zoneEl.textContent = 'No Data';
    statusEl.textContent = '-';
    confidenceEl.textContent = '-';
    timestampEl.textContent = '-';
    inletFlowEl.textContent = '0';
    outletFlowEl.textContent = '0';
    pressureEl.textContent = '0';
}

// Fetch History
async function fetchHistory() {
    try {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) {
            throw new Error('No history available');
        }
        const data = await response.json();
        updateHistoryTable(data);
    } catch (error) {
        console.error('Error fetching history:', error);
        historyBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No history available</td></tr>';
    }
}

// Update History Table
function updateHistoryTable(readings) {
    if (readings.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No readings yet</td></tr>';
        return;
    }

    historyBody.innerHTML = readings.map(reading => `
    <tr>
      <td>${formatTime(reading.timestamp)}</td>
      <td>${reading.zone}</td>
      <td>${reading.inletFlow.toFixed(2)}</td>
      <td>${reading.outletFlow.toFixed(2)}</td>
      <td>${reading.pressure.toFixed(2)}</td>
      <td>${reading.status}</td>
      <td>${reading.confidence}</td>
    </tr>
  `).join('');
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Format Time (for table)
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
}

// Refresh Data
function refreshData() {
    fetchLatest();
    fetchHistory();
}

// Event Listeners
refreshBtn.addEventListener('click', refreshData);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    refreshData();
    // Auto-refresh every 5 seconds
    setInterval(refreshData, 5000);
});