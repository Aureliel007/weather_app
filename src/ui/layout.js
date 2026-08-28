import { createElement } from '@/utils/createElement.js';
import { createSearchForm } from '@/ui/searchForm';
import { createWeatherPanel } from '@/ui/weatherPanel';
import { createMapPanel } from '@/ui/mapPanel';
import { createHistoryPanel } from '@/ui/historyPanel';
import { formatDate, formatTime } from '@/utils/formatDateTime.js';

export function renderApp(app, root) {
    root.append(app);
}

export function createApp({
    weatherService,
    mapService,
    geolocationService,
    historyService,
}) {
    const weatherPanel = createWeatherPanel();
    const mapPanel = createMapPanel(mapService);

    const historyPanel = createHistoryPanel({
        onSelect: (cityName) => search(cityName),
        onClear: () => {
            historyService.clearHistory();
            refreshHistory();
        },
    });

    const searchForm = createSearchForm({
        onSearch: (cityName) => search(cityName),
        onGeolocate: () => geolocate(),
    });

    function refreshHistory() {
        historyPanel.renderHistory(historyService.getHistory());
    }

    function saveToHistory(data) {
        historyService.addToHistory({
            name: data.name,
            country: data.country,
            temperature: data.temperature,
            weatherCode: data.weatherCode,
            timestamp: `${formatDate()}, ${formatTime()}`,
        });
        refreshHistory();
    }

    async function search(cityName) {
        searchForm.setSearchDisabled(true);
        weatherPanel.showState('loading');

        try {
            const data = await weatherService.getWeatherByCity(cityName);
            weatherPanel.renderWeather(data);
            mapPanel.renderMap(data.latitude, data.longitude, data.name);
            saveToHistory(data);
        } catch (err) {
            weatherPanel.renderError(err.message);
        } finally {
            searchForm.setSearchDisabled(false);
        }
    }

    async function geolocate() {
        searchForm.setGeolocationDisabled(true);
        weatherPanel.showState('loading');

        try {
            const { latitude, longitude } =
                await geolocationService.getCurrentPosition();
            const data = await weatherService.getWeatherByCoordinates(
                latitude,
                longitude
            );

            weatherPanel.renderWeather(data);
            mapPanel.renderMap(data.latitude, data.longitude, data.name);
            searchForm.setValue(data.name);
            saveToHistory(data);
        } catch (err) {
            weatherPanel.renderError(err.message);
        } finally {
            searchForm.setGeolocationDisabled(false);
        }
    }

    const mainContent = createElement(
        'div',
        { className: 'main-content' },
        createElement(
            'section',
            { className: 'weather-section' },
            createElement('div', { className: 'card' }, weatherPanel.element)
        ),
        createElement('section', { className: 'map-section' }, mapPanel.element)
    );

    const sidebar = createElement(
        'div',
        { className: 'sidebar' },
        createElement(
            'section',
            { className: 'history-section' },
            historyPanel.element
        )
    );

    const desktopContainer = createElement(
        'div',
        { className: 'desktop-container' },
        mainContent,
        sidebar
    );

    const searchSection = createElement(
        'section',
        { className: 'search-section' },
        createElement(
            'div',
            { className: 'card' },
            createElement('h2', {}, 'Найти город'),
            searchForm.element
        )
    );

    const app = createElement(
        'main',
        { className: 'container' },
        searchSection,
        desktopContainer
    );

    refreshHistory();

    return app;
}
