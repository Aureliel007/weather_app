import './css/style.css';

import { getWeatherByCity } from '@/services/weatherService.js';
import {
    getHistory,
    addToHistory,
    clearHistory,
} from '@/services/weatherHistory.js';
import { formatDate, formatTime } from '@/utils/formatDateTime.js';

import { renderWeather } from '@/render/renderWeather.js';
import { renderMap } from '@/render/renderMap.js';
import { renderHistory } from '@/render/renderHistory.js';
import { showState } from '@/render/showState.js';

const form = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const clearButton = document.getElementById('clearButton');
const searchButton = document.getElementById('searchButton');
const errorMessageEl = document.getElementById('errorMessage');
const clearHistoryButton = document.getElementById('clearHistoryButton');

function refreshHistory() {
    renderHistory(getHistory(), (cityName) => handleSearch(cityName));
}

async function handleSearch(cityName) {
    searchButton.disabled = true;
    showState('loading');

    try {
        const data = await getWeatherByCity(cityName);
        renderWeather(data);
        renderMap(data.latitude, data.longitude, data.name);

        addToHistory({
            name: data.name,
            country: data.country,
            temperature: data.temperature,
            weatherCode: data.weatherCode,
            timestamp: `${formatDate()}, ${formatTime()}`,
        });
        refreshHistory();
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
    cityInput.value = '';
});

clearButton.addEventListener('click', () => {
    cityInput.value = '';
    cityInput.focus();
});

clearHistoryButton.addEventListener('click', () => {
    clearHistory();
    refreshHistory();
});

document.addEventListener('DOMContentLoaded', () => {
    refreshHistory();
    showState('empty');
});
