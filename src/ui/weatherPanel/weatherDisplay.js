import { createElement } from '@/utils/createElement.js';
import { getWeatherInfo } from '@/utils/weatherCodesMapping.js';
import { formatDate, formatTime } from '@/utils/formatDateTime.js';

export function createWeatherDisplay() {
    const cityNameEl = createElement('h2', {}, '');
    const currentDateTimeEl = createElement('p', {}, '');
    const lastUpdatedEl = createElement('span', {}, '');

    const weatherHeader = createElement(
        'div',
        { className: 'weather-header' },
        createElement('div', {}, cityNameEl, currentDateTimeEl),
        createElement(
            'div',
            { className: 'last-updated' },
            createElement('i', { className: 'fas fa-history' }),
            lastUpdatedEl
        )
    );

    const weatherIconContainer = createElement('div', {
        className: 'weather-icon',
    });
    const temperatureEl = createElement(
        'div',
        { className: 'temperature' },
        ''
    );
    const weatherDescriptionEl = createElement(
        'div',
        { className: 'weather-description' },
        ''
    );
    const windValueEl = createElement('p', {}, '');
    const humidityValueEl = createElement('p', {}, '');
    const pressureValueEl = createElement('p', {}, '');
    const weatherDetails = createElement(
        'div',
        { className: 'weather-details' },
        createElement(
            'div',
            { className: 'weather-detail' },
            createElement('i', { className: 'fas fa-wind' }),
            createElement(
                'div',
                {},
                createElement('p', {}, 'Ветер'),
                windValueEl
            )
        ),
        createElement(
            'div',
            { className: 'weather-detail' },
            createElement('i', { className: 'fas fa-tint' }),
            createElement(
                'div',
                {},
                createElement('p', {}, 'Влажность'),
                humidityValueEl
            )
        ),
        createElement(
            'div',
            { className: 'weather-detail' },
            createElement('i', { className: 'fas fa-compress-alt' }),
            createElement(
                'div',
                {},
                createElement('p', {}, 'Давление'),
                pressureValueEl
            )
        )
    );

    const element = createElement(
        'div',
        {},
        weatherHeader,
        createElement(
            'div',
            { className: 'weather-content' },
            createElement(
                'div',
                { className: 'current-weather' },
                createElement(
                    'div',
                    { className: 'weather-primary' },
                    weatherIconContainer,
                    createElement(
                        'div',
                        {},
                        temperatureEl,
                        weatherDescriptionEl
                    )
                ),
                weatherDetails
            )
        )
    );

    function render(data) {
        const { description, icon } = getWeatherInfo(data.weatherCode);

        cityNameEl.textContent = `${data.name}, ${data.country}`;
        currentDateTimeEl.textContent = formatDate();
        lastUpdatedEl.textContent = `Обновлено в ${formatTime()}`;
        weatherIconContainer.innerHTML = `<i class="fas ${icon}"></i>`;
        temperatureEl.textContent = `${Math.round(data.temperature)}°C`;
        weatherDescriptionEl.textContent = description;
        windValueEl.textContent = `${data.windSpeed} м/с`;
        humidityValueEl.textContent = `${data.humidity}%`;
        pressureValueEl.textContent = `${Math.round(data.pressure)} гПа`;
    }

    return { element, render };
}
