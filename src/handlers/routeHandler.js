export function routeHandler(eventBus) {
    eventBus.on('route:weather', ({ city }) => {
        eventBus.trigger('search:city', { cityName: city });
    });

    eventBus.on('route:home', () => {
        eventBus.trigger('weather:reset');
    });
}
