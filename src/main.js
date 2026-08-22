import './css/style.css';

import { WeatherService } from '@/services/WeatherService.js';
import { MapService } from '@/services/MapService.js';
import { HistoryService } from '@/services/HistoryService.js';
import { GeolocationService } from '@/services/GeolocationService.js';
import { renderApp, createApp } from '@/ui/layout.js';

const onLoad = (fn) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
};

onLoad(() => {
    const root = document.getElementById('app');
    const services = {
        weatherService: new WeatherService(),
        mapService: new MapService(import.meta.env.VITE_YANDEX_MAPS_API_KEY),
        historyService: new HistoryService(),
        geolocationService: new GeolocationService(),
    };

    const app = createApp(services);
    renderApp(app, root);
});
