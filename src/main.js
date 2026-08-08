import './css/style.css';

import { getWeatherByCity } from './services/weatherService.js';
import {
    getHistory,
    addToHistory,
    clearHistory,
} from './scripts/weatherHistory.js';
import { getWeatherInfo } from './utils/weatherCodesMapping.js';
import { formatDate, formatTime } from './utils/formatDateTime.js';
import { renderMap } from './scripts/renderMap.js';

const form = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const clearButton = document.getElementById('clearButton');
const searchButton = document.getElementById('searchButton');

const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessageEl = document.getElementById('errorMessage');
const weatherData = document.getElementById('weatherData');

const cityNameEl = document.getElementById('cityName');
const currentDateTimeEl = document.getElementById('currentDateTime');
const lastUpdatedEl = document.getElementById('lastUpdated');
const weatherIconContainer = document.querySelector('.weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weatherDescription');
const windValueEl = document.getElementById('windValue');
const humidityValueEl = document.getElementById('humidityValue');
const pressureValueEl = document.getElementById('pressureValue');

const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');

function showState(state) {
    emptyState.classList.toggle('hidden', state !== 'empty');
    loadingState.classList.toggle('hidden', state !== 'loading');
    errorState.classList.toggle('hidden', state !== 'error');
    weatherData.classList.toggle('hidden', state !== 'data');
}

function renderWeather(data) {
    const { description, icon } = getWeatherInfo(data.weatherCode);

    cityNameEl.textContent = `${data.name}, ${data.country}`;
    currentDateTimeEl.textContent = formatDate();
    lastUpdatedEl.textContent = `Обновлено в ${formatTime()}`;

    weatherIconContainer.innerHTML = `<i class="weather-icon i fas ${icon}"></i>`;
    temperatureEl.textContent = `${Math.round(data.temperature)}°C`;
    weatherDescriptionEl.textContent = description;

    windValueEl.textContent = `${data.windSpeed} м/с`;
    humidityValueEl.textContent = `${data.humidity}%`;
    pressureValueEl.textContent = `${Math.round(data.pressure)} гПа`;

    showState('data');
}

function renderHistory(history) {
    historyList.innerHTML = '';
    history.forEach((entry) => {
        const { description } = getWeatherInfo(entry.weatherCode);
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
      <div class="history-item-city">
        <div class="city-icon"><i class="fas fa-map-marker-alt"></i></div>
        <div class="city-info">
          <h3>${entry.name}, ${entry.country}</h3>
          <p>${entry.timestamp}</p>
        </div>
      </div>
      <div class="history-item-weather">
        <p>${Math.round(entry.temperature)}°C</p>
        <p>${description}</p>
      </div>
    `;

        item.addEventListener('click', () => {
            cityInput.value = entry.name;
            handleSearch(entry.name);
        });
        historyList.appendChild(item);
    });
}

async function handleSearch(cityName) {
    searchButton.disabled = true;
    showState('loading');

    try {
        const data = await getWeatherByCity(cityName);
        renderWeather(data);
        renderMap(data.latitude, data.longitude, data.name);

        const updated = addToHistory({
            name: data.name,
            country: data.country,
            temperature: data.temperature,
            weatherCode: data.weatherCode,
            timestamp: `${formatDate()}, ${formatTime()}`,
        });
        renderHistory(updated);
    } catch (err) {
        errorMessageEl.textContent =
            err.message || 'Попробуйте ввести другое название';
        showState('error');
    } finally {
        searchButton.disabled = false;
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) handleSearch(city);
});

clearButton.addEventListener('click', () => {
    cityInput.value = '';
    cityInput.focus();
});

clearHistoryButton.addEventListener('click', () => {
    clearHistory();
    renderHistory([]);
});

document.addEventListener('DOMContentLoaded', () => {
    renderHistory(getHistory());
    showState('empty');
});
