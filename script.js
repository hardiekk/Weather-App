const apiKey = '30463d2ed0770cfd3ad23f1a5801d1db'; // अपनी API key यहाँ डालें
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const temp = document.getElementById('temperature');
const desc = document.getElementById('description');
const wind = document.getElementById('wind-speed');
const icon = document.getElementById('weather-icon');
const errorMessage = document.getElementById('error-message');

const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading';

getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city.length === 0) {
    showError('Please enter a city name.');
    return;
  }
  fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getWeatherBtn.click();
  }
});

function fetchWeather(city) {
  errorMessage.textContent = '';
  weatherInfo.style.display = 'block';
  weatherInfo.innerHTML = '';
  weatherInfo.appendChild(loadingSpinner);

  fetch(`${apiEndpoint}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      weatherInfo.removeChild(loadingSpinner);
      if (data.cod === 200) {
        showWeather(data);
      } else {
        showError('City not found. Try another name.');
      }
    })
    .catch(() => {
      weatherInfo.removeChild(loadingSpinner);
      showError('Network error. Please check your connection.');
    });
}

function showWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  date.textContent = new Date().toLocaleString();
  temp.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
  desc.textContent = `Condition: ${data.weather[0].description}`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.style.display = 'block';

  weatherInfo.innerHTML = `
    <h3 id="city-name">${cityName.textContent}</h3>
    <p id="date">${date.textContent}</p>
    <img id="weather-icon" src="${icon.src}" alt="Weather Icon" />
    <p id="temperature">${temp.textContent}</p>
    <p id="description">${desc.textContent}</p>
    <p id="wind-speed">${wind.textContent}</p>
  `;
  errorMessage.textContent = '';
}

function showError(msg) {
  weatherInfo.innerHTML = '';
  icon.style.display = 'none';
  errorMessage.textContent = msg;
  weatherInfo.style.display = 'block';
}
