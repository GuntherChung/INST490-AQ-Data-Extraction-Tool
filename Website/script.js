const headers = { "X-API-Key": "C7AF49F7-C3F6-11ED-B6F4-42010A800007" }; // replace with your actual API key

// ---- LOCATION --- //

// get references to the DOM elements
const searchBtn = document.getElementById("search-btn");
const locationSelect = document.getElementById("location");

// define selectedLocation as a global variable
let selectedLocation;

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

// ----- DATA ----- //
const interval = "hourly"
async function getHistoricalData(startDate, endDate) {
  const url = `https://api.purpleair.com/v1/sensors/${selectedLocation}/stats?from=${startDate}&to=${endDate}&interval=${interval}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  console.log(data)
  return data;
}

// ---- DOWNLOAD ---- //
const downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", () => {
  const csv = "Timestamp,PM2.5\n" + data.results.map(point => `${point.last_seen},${point.pm25}`).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "data.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});