# INST490-AQ-Data-Extraction-Tool

[Visit our website](./Website/index.html)

This JavaScript code is a client-side application that gets data from an external API, creates a CSV file, generates a graph with the data pulled, and downloads it at the click of a button. 
The application allows the user to select a location and a date range, then retrieves historical data for that location and period from the PurpleAir API. The code is well-commented and follows best practices, making it easy to read and understand.

### Setup
The first line of code sets the API key to access the PurpleAir API. Replace the value of the X-API-Key header with your own API key.

```js
const headers = { "X-API-Key": "1234678-1234-1234-1234-42010A800007" }; // replace with your actual API key
```

### Location Selection
The searchBtn, locationSelect, and downloadBtn variables reference the corresponding elements in the HTML document.

```js
const searchBtn = document.getElementById("search-btn");
const locationSelect = document.getElementById("location");
const downloadBtn = document.getElementById("download-btn");
```

When the user clicks the "Search" button, the value of the selected location is assigned to the selectedLocation global variable.

```js
searchBtn.addEventListener("click", function() {
  selectedLocation = locationSelect.value;
  console.log(selectedLocation);
});
```

### Date Selection
The startDateInput and endDateInput variables reference the date input elements in the HTML document. The minimum date for the start date input is set to 30 days ago from the current date.

``` js
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

const minStartDate = new Date();
minStartDate.setDate(today.getDate() - 30);
const minStartDateTimestamp = minStartDate.getTime();
```

When the user clicks the "Search" button, the start and end dates are validated to ensure they are valid and within the allowed range.

```js
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

  const sensorData = await getHistoricalData(startDate.toISOString(), endDate.toISOString());
});
```

### Download Button
When the user clicks the "Search" button, the sensorData variable is populated with the historical data for the selected location and dates. The downloadBtn variable is then enabled. When the user clicks the "Download" button, a CSV file is created and downloaded.

``` js
searchBtn.addEventListener("click", async function() {
  sensorData = await getHistoricalData(startDateInput.value, endDateInput.value);
  downloadBtn.disabled = false;
});

downloadBtn.addEventListener("click", function() {
const csv = createCsv(sensorData);
const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
const link = document.createElement("a");
const url = URL.createObjectURL(blob);
link.setAttribute("href", url);
link.setAttribute("download", "data.csv");
link.style.visibility = "hidden";
document.body.appendChild(link);
```
-------------------------------------
### Things left to do
Our initial goals were
* let the user input values for 
    * start date
    * end date
    * and select one location for the sensor

After these steps are completed, a number of things were supposed to happen
1. Pull the data 
2. Sort the data
3. visualize the data
4. let the user download the sorted data

While we were eger to get all of these features done by the end of our project time frame, *we were not able to do steps 2 and 3*, and in result * step4 * was not useful. 

#### Future teams
The next steps would be to continue to *work on perfecting steps 2 and 3*.
Once these steps are completed, then *step 4* would work in a result of *step 2 working*.