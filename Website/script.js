const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key

async function getSensorData(sensorId) {
  const url = `https://api.purpleair.com/v1/sensors/${sensorId}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

async function getHistoricalData(sensorId, start="1weekago", end="now", interval="hourly") {
  const url = `https://api.purpleair.com/v1/sensors/${sensorId}/stats?from=${start}&to=${end}&interval=${interval}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

async function getAllSensorIds() {
  const url = "https://api.purpleair.com/v1/sensors";
  const response = await fetch(url, { headers });
  const data = await response.json();
  const sensorIds = data.map(sensor => sensor["sensor_index"]);
  return sensorIds;
}

async function getAllSensorData() {
  const sensorIds = await getAllSensorIds();
  const sensorData = {};
  for (const sensorId of sensorIds) {
    const data = await getSensorData(sensorId);
    sensorData[sensorId] = data;
  }
  return sensorData;
}

async function getAllHistoricalData(start="1weekago", end="now", interval="hourly") {
  const sensorIds = await getAllSensorIds();
  const historicalData = {};
  for (const sensorId of sensorIds) {
    const data = await getHistoricalData(sensorId, start, end, interval);
    historicalData[sensorId] = data;
  }
  return historicalData;
}

// example usage
const sensorId = "<your-sensor-id>"; // replace with your actual sensor ID
getSensorData(sensorId).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

// example usage
getAllSensorData().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

// example usage
getAllHistoricalData().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});
