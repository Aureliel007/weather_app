import './css/style.css';

import { EventEmitter } from '@/core/EventEmitter';
import { Router } from '@/router/router';
import { renderApp, createApp } from '@/ui/layout';
import { getRequiredElement } from '@/utils/dom';

import { WeatherService } from '@/services/WeatherService';
import { MapService } from '@/services/MapService';
import { HistoryService } from '@/services/HistoryService';
import { GeolocationService } from '@/services/GeolocationService';

import { weatherHandler } from '@/handlers/weatherHandler';
import { mapHandler } from '@/handlers/mapHandler';
import { historyHandler } from '@/handlers/historyHandler';
import { navigationHandler } from '@/handlers/navigationHandler';
import { routeHandler } from '@/handlers/routeHandler';
import { urlSyncHandler } from '@/handlers/urlSyncHandler';

export function main(): void {
    const eventBus = new EventEmitter();
    const root = getRequiredElement('app');

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
