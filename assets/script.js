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
