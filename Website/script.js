const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key


// ---- LOCATION --- //

// get references to the DOM elements
const searchBtn = document.getElementById("search-btn");
const locationSelect = document.getElementById("location");

// add event listener to the search button
searchBtn.addEventListener("click", function() {
  // get the value of the selected location
  const selectedLocation = locationSelect.value;

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
searchButton.addEventListener("click", () => {
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

  // Perform the search
  // ...
});


async function getSensorData(sensor) {
  const url = `https://api.purpleair.com/v1/sensors/${sensor}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

async function getAllSensorData(sensor) {
  const sensorData = {};
  for (const sensorId of sensor) {
    const data = await getSensorData(sensor);
    sensorData[sensorId] = data;
  }
  return sensorData;
}

async function getHistoricalData(sensor, start="1weekago", end="now", interval="hourly") {
  const url = `https://api.purpleair.com/v1/sensors/${sensor}/stats?from=${start}&to=${end}&interval=${interval}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

async function getAllHistoricalData(sensor, start="1weekago", end="now", interval="hourly") {
  const historicalData = {};
  for (const sensorId of sensor) {
    const data = await getHistoricalData(sensorId, start, end, interval);
    historicalData[sensorId] = data;
  }
  return historicalData;
}

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