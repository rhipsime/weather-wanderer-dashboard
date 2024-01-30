// script.js
// Other JavaScript logic goes here

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// List of cities to search
const citiesToSearch = ["London", "Barcelona", "Asmara", "Miami", "Tokyo", "Sofia"];

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (city !== "") {
    // Call a function to get coordinates from the city (using OpenWeatherMap API)
    getCoordinates(city);
  }
});

// Function to iterate through cities and fetch weather data
async function searchForCities() {
  for (const city of citiesToSearch) {
    await getCoordinates(city);
  }
}

// Call the function to search for predefined cities on page load
searchForCities();

async function getCoordinates(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${window.apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const coordinates = {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };

    // Call a function to fetch and display weather data using coordinates
    getWeatherData(coordinates);
  } catch (error) {
    console.error(`Error getting coordinates for ${city}:`, error);
  }
}

async function getWeatherData(coordinates) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${window.apiKey}`;

  try {
    const response = await fetch(forecastUrl);
    const data = await response.json();

    // Call functions to display current weather and 5-day forecast
    displayCurrentWeather(data);
    display5DayForecast(data);
  } catch (error) {
    console.error("Error getting weather data:", error);
  }
}

function displayCurrentWeather(data) {
  // Extract necessary data from 'data' object
  const cityName = data.city.name;
  const date = data.list[0].dt_txt; // Use the date from the first item in the list
  // Extract other weather data as needed

  // Update HTML elements with the extracted data
  const todaySection = document.getElementById("today");
  todaySection.innerHTML += `
    <div class="card">
      <h2>${cityName}</h2>
      <p>Date: ${date}</p>
      <!-- Add other weather information here -->
    </div>
  `;
}

function display5DayForecast(data) {
  // Extract and display 5-day forecast data
}

function saveToLocalStorage(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

window.addEventListener("load", function () {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Display search history in the 'history' div
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = history.map((city) => `<div>${city}</div>`).join("");
});

document.getElementById("history").addEventListener("click", function (event) {
  if (event.target.tagName === "DIV") {
    const clickedCity = event.target.textContent;
    // Call a function to get coordinates from the clicked city and fetch weather data
    getCoordinates(clickedCity);
  }
});
