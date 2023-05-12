const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key

// ---- LOCATION --- //

// get references to the DOM elements
const searchBtn = document.getElementById("search-btn");
const locationSelect = document.getElementById("location");
const downloadBtn = document.getElementById("download-btn");

// define selectedLocation as a global variable
let selectedLocation;
let sensorData;
let startDate;
let endDate;

// add event listener to the search button
searchBtn.addEventListener("click", function() {
  // get the value of the selected location and assign it to the global variable
  selectedLocation = locationSelect.value;

  // do something with the selected location, such as assigning it to a variable
  console.log(selectedLocation);
});

// ------ DATE FIELDS ---- //

// Get the input elements
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

// Get today's date
const today = new Date();
const todayTimestamp = today.getTime();

// Set the minimum date for start date input
const minStartDate = new Date();
minStartDate.setDate(today.getDate() - 30);
const minStartDateTimestamp = minStartDate.getTime();

// Add an event listener to the search button to validate the dates and perform the search
const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", async () => {
  const startDate = moment(startDateInput.value, "MM/DD/YYYY");
  const endDate = moment(endDateInput.value, "MM/DD/YYYY");

  if (!startDate.isValid() || !endDate.isValid()) {
    alert("Please enter valid dates in the format MM/DD/YYYY");
    return;
  }

  const startDateTimestamp = startDate.toDate().getTime();
  const endDateTimestamp = endDate.toDate().getTime();

  if (startDateTimestamp < minStartDateTimestamp) {
    alert("Start date cannot be older than 30 days from today");
    return;
  }

  if (endDateTimestamp < startDateTimestamp) {
    alert("End date cannot be before the start date");
    return;
  }

  // get the historical data for the selected location and dates
  const sensorData = await getHistoricalData(startDate.toISOString(), endDate.toISOString());

  // do something with the data
});

// add event listener to the search button
searchBtn.addEventListener("click", async function() {
  // get the value of the selected location and assign it to the global variable
  selectedLocation = locationSelect.value;

  // get the historical data for the selected location and dates
  sensorData = await getHistoricalData(startDateInput.value, endDateInput.value);

  // enable the download button
  downloadBtn.disabled = false;
});

// add event listener to the download button
downloadBtn.addEventListener("click", function() {
  // create a CSV file and download it
  const csv = createCsv(sensorData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "data.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// ------ HELPER FUNCTIONS ---- //

// create a CSV string from the sensor data
function createCsv(sensorData) {
  // create a header row with the column names
  const header = "timestamp,pm2.5,temperature,humidity\n";

  // create a row for each data point
  const rows = sensorData.data.map(dataPoint => {
    const timestamp = new Date(dataPoint[0]).toLocaleString();
    const pm25 = dataPoint[1].toFixed(2);
    const temperature = dataPoint[2].toFixed(2);
    const humidity = dataPoint[3].toFixed(2);
    return `${timestamp},${pm25},${temperature},${humidity}`;
  });

  // concatenate the header and rows into a single CSV string
  return header + rows.join("\n");
}

// ----- DATA ----- //
const interval = "hourly"
async function getHistoricalData(startDate, endDate) {
  const url = `https://api.purpleair.com/v1/sensors/${selectedLocation}/stats?from=${startDate}&to=${endDate}&interval=${interval}`;
  console.log(url)
  const response = await fetch(url, { headers });
  const data = await response.json();
  console.log(data)
  return data;
}

// ---- Chart work ----- // 

const historicalData = {
"133730#11.74": {
  "1weekago": [
    {"datetime": "2022-04-16T00:00:00Z", "pm2.5": 5},
    {"datetime": "2022-04-17T00:00:00Z", "pm2.5": 6},
    {"datetime": "2022-04-18T00:00:00Z", "pm2.5": 4},
    {"datetime": "2022-04-19T00:00:00Z", "pm2.5": 8},
    {"datetime": "2022-04-20T00:00:00Z", "pm2.5": 9},
    {"datetime": "2022-04-21T00:00:00Z", "pm2.5": 11},
    {"datetime": "2022-04-22T00:00:00Z", "pm2.5": 10},
    {"datetime": "2022-04-23T00:00:00Z", "pm2.5": 7},
    {"datetime": "2022-04-24T00:00:00Z", "pm2.5": 6},
    {"datetime": "2022-04-25T00:00:00Z", "pm2.5": 4}
  ]
}
// add more historical data here as needed
};

const chartData = {
labels: [], // x-axis labels will be generated dynamically
datasets: [
  {
    label: "Air Quality Measured in PM2.5",
    data: [], // y-axis data will be generated dynamically
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    tension: 0.1
  }
]
};

function generateData(startDate, endDate) {
// Generate x-axis labels
const start = moment(startDate);
const end = moment(endDate);
const diff = end.diff(start, "days");
for (let i = 0; i <= diff; i++) {
  const label = start.add(1, "day").format("YYYY-MM-DD");
  chartData.labels.push(label);
}

// Generate y-axis data
const sensorId = "133730#11.74"; // Change to desired sensor ID
const data = historicalData[sensorId]["1weekago"];
let dataIndex = 0;
let total = 0;
let count = 0;
for (const label of chartData.labels) {
  while (dataIndex < data.length && moment(data[dataIndex].datetime).isSameOrBefore(label, "day")) {
    total += data[dataIndex]["pm2.5"];
    count++;
    dataIndex++;
  }
  const average = count > 0 ? total / count : null;
  chartData.datasets[0].data.push(average);
}
}

async function loadData(chart) {
// Load data from server using fetch or any other method
const data = await fetchData();

// Push new labels and data into the chart arrays
chart.data.labels.push(data.label);
chart.data.datasets[0].data.push(data.value);

// Redraw the chart with new data
chart.update();
}

function initializeChart() {
// Example usage: generate data for the past week
generateData("2022-04-19", "2022-04-25");

// Calculate the maximum y-axis value
const maxYValue = Math.max(...chartData.datasets[0].data) + 10;

// Create the chart
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    scales: {
      y: {
        min: 0,
        max: maxYValue
      }
    }
  }
});
}

document.addEventListener("DOMContentLoaded", function() {
initializeChart();
}); 