import { getStaticMapUrl } from '@/services/mapService.js';

const mapImageEl = document.getElementById('mapImage');

export function renderMap(latitude, longitude, cityName) {
    const container = mapImageEl.parentElement;
    const width = Math.round(container.clientWidth);
    const height = Math.round(width * (450 / 600));

    mapImageEl.src = getStaticMapUrl(latitude, longitude, width, height);
    mapImageEl.alt = `Карта города ${cityName}`;
}
