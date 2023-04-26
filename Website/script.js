const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key

const sensors = {
    Union_Bethel_AME: "133730#11.74", 
    William_S_Schmidt: "134488#11.74",
    PGCPS_Schmidt_CenterBldg: "102898#11",
    Surratsville_HS: "102852#11.05",
    Oxon_Hill_HS: "104790#11.05"
    // add more sensors here as needed
  };
  

const getAllSensorData = async () => {
try {
    const sensorIds = await getAllSensorIds();
    const sensorData = await getSensorData(sensorIds);
    console.log(sensorData)
    return sensorData;
} catch (error) {
    console.error(error);
    throw new Error("Failed to get sensor data");
}
};

async function getSensorData(sensorId) {
try {
    const url = `https://api.purpleair.com/v1/sensors/${sensorId}`;
    const response = await fetch(url, { headers: headers });
    const sensorData = await response.json();
    return sensorData;
} catch (error) {
    console.error(error);
}
}

async function getHistoricalData(sensorId, start="1weekago", end="now", interval="hourly") {
  const url = `https://api.purpleair.com/v1/sensors/${sensorId}/stats?from=${start}&to=${end}&interval=${interval}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
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
