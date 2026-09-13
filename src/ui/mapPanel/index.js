import { createElement } from '@/utils/createElement.js';

export function createMapPanel(eventBus) {
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

    eventBus.on('weather:loaded', ({ data }) => {
        const width = Math.round(mapContainer.clientWidth);
        const height = Math.round(width * (450 / 600));

        eventBus.trigger('map:request', {
            latitude: data.latitude,
            longitude: data.longitude,
            width,
            height,
            cityName: data.name,
        });
    });

    eventBus.on('map:url-ready', ({ url, alt }) => {
        mapImage.src = url;
        mapImage.alt = alt;
    });

    eventBus.on('weather:reset', () => {
        mapImage.src = '';
        mapImage.alt = '';
    });

    return { element };
}
