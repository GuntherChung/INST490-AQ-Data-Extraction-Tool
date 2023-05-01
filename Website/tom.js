document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "C7AF49F7-C3F6-11ED-B6F4-42010A800007";
    const apiUrl = "https://api.purpleair.com/v1";
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const locationSelect = document.getElementById("location");
    const searchButton = document.getElementById("search-btn");
    const chartCanvas = document.getElementById("myChart");
    const downloadButton = document.getElementById("download-btn");
  
    const sensors = {
      Union_Bethel_AME: "133730#11.74",
      William_S_Schmidt: "134488#11.74",
      PGCPS_Schmidt_CenterBldg: "102898#11",
      Surratsville_HS: "102852#11.05",
      Oxon_Hill_HS: "104790#11.05"
    };
  
    for (const sensorName in sensors) {
      const option = document.createElement("option");
      option.value = sensors[sensorName];
      option.textContent = sensorName;
      locationSelect.appendChild(option);
    }
  

    let chart;
  
    
    searchButton.addEventListener("click", async () => {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const location = locationSelect.value;
  
      if (!startDate || !endDate || !location) {
        alert("Please fill in all fields.");
        return;
      }
  
      const data = await fetchData(startDate, endDate, location);
      if (!data) {
        alert("Error fetching data.");
        return;
      }
  
      updateChart(data);
    });
  
    
    downloadButton.addEventListener("click", () => {
      if (!chart) {
        alert("No data to download. Please search for data first.");
        return;
      }
  
      const csvData = generateCSV(chart.data.labels, chart.data.datasets[0].data);
      const filename = `air_quality_data_${new Date().toISOString()}.csv`;
      downloadCSV(csvData, filename);
    });
  
    async function fetchData(startDate, endDate, location) {
      const startTimestamp = new Date(`${startDate}T00:00:00Z`).getTime() / 1000;
      const endTimestamp = new Date(`${endDate}T23:59:59Z`).getTime() / 1000;
    
      const [sensorId] = location.split("#");
    
      const requestUrl = `${apiUrl}/sensors/${sensorId}/history?api_key=${apiKey}&start=${startTimestamp}&end=${endTimestamp}&fields=timestamp%2Cpm2.5`;
      console.log("API request URL:", requestUrl);
      const response = await fetch(requestUrl, { mode: "cors" });
    
      if (!response.ok) {
        console.error("API request failed:", response);
      
        if (response.status === 403) {
          alert("API request was denied. Please check your API key and permissions.");
        } else {
          alert("API request failed. Please try again later.");
        }
      
        return null;
      }
    
      const data = await response.json();
    
      return {
        timestamps: data.history.map((entry) => new Date(entry.timestamp * 1000).toISOString()),
        values: data.history.map((entry) => entry["pm2.5"])
      };
    }
    
  
    function updateChart(data) {
      if (chart) {
        chart.destroy();
      }
  
      chart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels: data.timestamps,
          datasets: [
            {
              label: "Air Quality Index",
              data: data.values,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Air Quality Index Over Time"
            },
            tooltip: {
              mode: "index",
              intersect: false
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Date & Time"
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Air Quality Index"
              }
            }
          }
        }
      });
    }
  
    function generateCSV(labels, data) {
      const csvContent = "data:text/csv;charset=utf-8,";
      const header = "Timestamp,Air Quality Index\n";
      const rows = labels
        .map((label, index) => `${label},${data[index]}`)
        .join("\n");
  
      return csvContent + header + rows;
    }
  
    function downloadCSV(csvData, filename) {
      const link = document.createElement("a");
      link.setAttribute("href", csvData);
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (response.status === 400) {
      alert("Bad request. Please check your date inputs.");
    } else if (response.status === 403) {
      alert("API request was denied. Please check your API key and permissions.");
    } else {
      alert("API request failed. Please try again later.");
    }
  });