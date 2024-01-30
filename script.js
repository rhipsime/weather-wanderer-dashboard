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
    // Save the city to search history
    saveToLocalStorage(city);
    // Update the display of search history
    updateSearchHistory();
  }
});

function updateSearchHistory() {
  const historyDiv = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  historyDiv.innerHTML = history.map((city) => `<div>${city}</div>`).join("");
}


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
  const cityName = data.city.name;
  const date = data.list[0].dt_txt;
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  const todaySection = document.getElementById("today");
  todaySection.innerHTML = `
    <div class="card">
      <h2>${cityName}</h2>
      <p>Date: ${date}</p>
      <p>Temperature: ${temperature} K</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;
}

function display5DayForecast(data) {
  const forecastSection = document.getElementById("forecast");
  forecastSection.innerHTML = ""; // Clear previous content

  // Iterate over the 5-day forecast data
  for (let i = 0; i < data.list.length; i += 8) {
    const date = data.list[i].dt_txt;
    const temperature = data.list[i].main.temp;
    const humidity = data.list[i].main.humidity;

    forecastSection.innerHTML += `
      <div class="card">
        <p>Date: ${date}</p>
        <p>Temperature: ${temperature} K</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  }
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
