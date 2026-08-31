import './css/style.css';

import { EventEmitter } from '@/EventEmitter';
import { renderApp, createApp } from '@/ui/layout.js';

import { WeatherService } from '@/services/WeatherService.js';
import { MapService } from '@/services/MapService.js';
import { HistoryService } from '@/services/HistoryService.js';
import { GeolocationService } from '@/services/GeolocationService.js';

import { weatherHandler } from '@/handlers/weatherHandler.js';
import { mapHandler } from '@/handlers/mapHandler.js';
import { historyHandler } from '@/handlers/historyHandler.js';

export function main() {
    const eventBus = new EventEmitter();
    const root = document.getElementById('app');

    const app = createApp(eventBus);
    renderApp(app, root);

    weatherHandler(eventBus, {
        weatherService: new WeatherService(),
        geolocationService: new GeolocationService(),
    });
    mapHandler(eventBus, {
        mapService: new MapService(import.meta.env.VITE_YANDEX_MAPS_KEY),
    });
    historyHandler(eventBus, { historyService: new HistoryService() });
}
