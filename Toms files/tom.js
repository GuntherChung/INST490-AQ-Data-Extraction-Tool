async function getDataFromAPI(startDate, endDate, location) {
  const response = await fetch(`https://api.purpleair.com/v1/sensors/${location}/history?start=${startDate}&end=${endDate}`, {
    headers: {
      'X-API-Key': 'C7AF49F7-C3F6-11ED-B6F4-42010A800007'
    }
  });
  const data = await response.json();
  return data.results || []; // data.results가 undefined이면 빈 배열([])을 반환
}

let myChart;

// Get references to page elements
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const locationSelect = document.getElementById('location');
const searchButton = document.getElementById('update-btn');
const downloadButton = document.getElementById('download-btn');
const ctx = document.getElementById('myChart').getContext('2d');

// Initialize chart
function initChart() {
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}


async function updateChart() {
  // Get selected sensor ID and dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const location = locationSelect.value;

  // Clear existing data
  if (!myChart) {
    initChart();
  } else {
    myChart.data.labels = [];
    myChart.data.datasets = [];
  }

  // Get new data
  const data = await getDataFromAPI(startDate, endDate, location);

// Update chart
myChart.data.labels = data.map(result => result.lastSeen);
myChart.data.datasets = [{
  label: location,
  data: data.map(result => result.PM2_5Value),
  fill: false,
  borderColor: 'rgb(75, 192, 192)',
  tension: 0.1,
}];


  // Update chart display
  myChart.update();
}

async function downloadData() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const location = locationSelect.value;
  const data = await getDataFromAPI(startDate, endDate, location);
  const csvData = "date,pm2.5\n" + data.map(result => `${result.lastSeen},${result.PM2_5Value}`).join("\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "air_quality_data.csv";
  link.click();
}

// Set up event handlers
window.addEventListener('DOMContentLoaded', (event) => {
  searchButton.addEventListener('click', updateChart);
  downloadButton.addEventListener("click", downloadData);
});

// Initialize chart when page loads
window.addEventListener('load', initChart);