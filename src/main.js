import './css/style.css';

import { EventEmitter } from '@/core/EventEmitter.js';
import { Router } from '@/router/router.js';
import { renderApp, createApp } from '@/ui/layout.js';

import { WeatherService } from '@/services/WeatherService.js';
import { MapService } from '@/services/MapService.js';
import { HistoryService } from '@/services/HistoryService.js';
import { GeolocationService } from '@/services/GeolocationService.js';

import { weatherHandler } from '@/handlers/weatherHandler.js';
import { mapHandler } from '@/handlers/mapHandler.js';
import { historyHandler } from '@/handlers/historyHandler.js';
import { navigationHandler } from '@/handlers/navigationHandler.js';
import { routeHandler } from '@/handlers/routeHandler.js';
import { urlSyncHandler } from '@/handlers/urlSyncHandler.js';

export function main() {
    const eventBus = new EventEmitter();
    const root = document.getElementById('app');

    const app = createApp(eventBus);
    renderApp(app, root);

    const router = new Router(eventBus);

    weatherHandler(eventBus, {
        weatherService: new WeatherService(),
        geolocationService: new GeolocationService(),
    });
    mapHandler(eventBus, {
        mapService: new MapService(import.meta.env.VITE_YANDEX_MAPS_KEY),
    });
    historyHandler(eventBus, { historyService: new HistoryService() });
    navigationHandler(eventBus, { router });
    routeHandler(eventBus);
    urlSyncHandler(eventBus, { router });

    router.start();
}
