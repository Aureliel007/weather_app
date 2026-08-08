import { getWeatherInfo } from '@/utils/weatherCodesMapping.js';
import { formatDate, formatTime } from '@/utils/formatDateTime.js';
import { showState } from './showState.js';

const cityNameEl = document.getElementById('cityName');
const currentDateTimeEl = document.getElementById('currentDateTime');
const lastUpdatedEl = document.getElementById('lastUpdated');
const weatherIconContainer = document.querySelector('.weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weatherDescription');
const windValueEl = document.getElementById('windValue');
const humidityValueEl = document.getElementById('humidityValue');
const pressureValueEl = document.getElementById('pressureValue');

export function renderWeather(data) {
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
