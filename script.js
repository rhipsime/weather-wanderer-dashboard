// script.js
// Import API key from config.js
const apiKey = a461fc00b3322cacab6cb4a0be3c56eb

// Other JavaScript logic goes here

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = searchInput.value.trim();

  if (city !== "") {
    // Call a function to get coordinates from the city (using OpenWeatherMap API)
    getCoordinates(city);
  }
});
async function getCoordinates(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${a461fc00b3322cacab6cb4a0be3c56eb}`;
  
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
      console.error("Error getting coordinates:", error);
    }
  }
  async function getWeatherData(coordinates) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${a461fc00b3322cacab6cb4a0be3c56eb}`;
  
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
    todaySection.innerHTML = `
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
  