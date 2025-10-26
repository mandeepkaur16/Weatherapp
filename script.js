const apiKey = "38a14992f8dd1ea8fd3c082383aa319d"; // Replace with your actual OpenWeatherMap API key

const form = document.querySelector("form");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.querySelector(".weather-info");

// Fetch weather by city name
async function getWeatherByCity(city) {
  weatherInfo.innerHTML = "Loading...";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      weatherInfo.innerHTML = `<p class="error">❌ City not found. Try again!</p>`;
      return;
    }

    showWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p class="error">⚠️ Something went wrong. Please try again.</p>`;
  }
}

// Fetch weather by coordinates (for current location)
async function getWeatherByCoords(lat, lon) {
  weatherInfo.innerHTML = "Detecting your location...";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    showWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p class="error">⚠️ Location fetch failed. Please search manually.</p>`;
  }
}

// Display weather on screen
function showWeather(data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${icon}" alt="Weather icon">
    <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
    <p>🌡️ Temp: ${data.main.temp} °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
  `;
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) getWeatherByCity(city);
});

// Auto-detect user’s location
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        weatherInfo.innerHTML = `<p class="error">⚠️ Location permission denied. Please search for a city.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p class="error">⚠️ Geolocation not supported by this browser.</p>`;
  }
});
