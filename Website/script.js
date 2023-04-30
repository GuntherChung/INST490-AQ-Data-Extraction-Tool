const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key

const sensors = {
    Union_Bethel_AME: "133730#11.74", 
    William_S_Schmidt: "134488#11.74",
    PGCPS_Schmidt_CenterBldg: "102898#11",
    Surratsville_HS: "102852#11.05",
    Oxon_Hill_HS: "104790#11.05"
    // add more sensors here as needed
  };

async function getSensorData(sensorIds) {
    try {
      const promises = sensorIds.map((sensorId) => {
        const url = `https://api.purpleair.com/v1/sensors/${sensorId}`;
        return fetch(url, { headers: headers }).then((response) => response.json());
      });
      const sensorData = await Promise.all(promises);
      return sensorData;
    } catch (error) {
      console.error(error);
    }
}

async function getAllSensorData() {
const sensorIds = Object.values(sensors);
const sensorData = await getSensorData(sensorIds);
return sensorData;
}

async function getHistoricalData(sensorId, start="1weekago", end="now", interval="hourly") {
  const url = `https://api.purpleair.com/v1/sensors/${sensorId}/stats?from=${start}&to=${end}&interval=${interval}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}
  

async function getAllHistoricalData(sensorIds, start="1weekago", end="now", interval="hourly") {
  const historicalData = {};
  for (const sensorId of sensorIds) {
    const data = await getHistoricalData(sensorId, start, end, interval);
    historicalData[sensorId] = data;
  }
  return historicalData;
}

// example usage
getAllSensorData().then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error(error);
  });

// example usage for getSensorData
const sensorids = Object.values(sensors);
getSensorData(sensorids).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

// example usage for getHistoricalData
const sensorId = sensors.Union_Bethel_AME;
getHistoricalData(sensorId).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

// example usage for getAllHistoricalData
const sensorids2 = Object.values(sensors);
getAllHistoricalData(sensorids2).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});
// ------------Graph----------------- //
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
      label: "PM2.5",
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

// Example usage: generate data for the past week
generateData("2022-04-19", "2022-04-25");

// Create the chart
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    scales: {}
     