import { createElement } from '@/utils/createElement.js';

export function createMapPanel(mapService) {
    const mapImage = createElement('img', { src: '', alt: '' });
    const mapContainer = createElement(
        'div',
        { className: 'map-container' },
        mapImage
    );

    const element = createElement(
        'div',
        { className: 'card' },
        createElement(
            'div',
            { className: 'section-header' },
            createElement(
                'h2',
                {},
                createElement('i', { className: 'fas fa-map-marker-alt' }),
                ' Карта'
            )
        ),
        mapContainer
    );

    function renderMap(latitude, longitude, cityName) {
        const width = Math.round(mapContainer.clientWidth);
        const height = Math.round(width * (450 / 600));

        mapImage.src = mapService.getStaticMapUrl(
            latitude,
            longitude,
            width,
            height
        );
        mapImage.alt = `Карта города ${cityName}`;
    }

    return { element, renderMap };
}
