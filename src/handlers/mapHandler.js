export function mapHandler(eventBus, { mapService }) {
    eventBus.on(
        'map:request',
        ({ latitude, longitude, width, height, cityName }) => {
            const url = mapService.getStaticMapUrl(
                latitude,
                longitude,
                width,
                height
            );
            eventBus.trigger('map:url-ready', {
                url,
                alt: `Карта города ${cityName}`,
            });
        }
    );
}
