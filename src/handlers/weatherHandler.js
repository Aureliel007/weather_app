export function weatherHandler(
    eventBus,
    { weatherService, geolocationService }
) {
    eventBus.on('search:city', async ({ cityName }) => {
        eventBus.trigger('weather:loading');
        try {
            const data = await weatherService.getWeatherByCity(cityName);
            eventBus.trigger('weather:loaded', { data });
        } catch (err) {
            eventBus.trigger('weather:error', { message: err.message });
        }
    });

    eventBus.on('search:geolocation', async () => {
        eventBus.trigger('weather:loading');
        try {
            const { latitude, longitude } =
                await geolocationService.getCurrentPosition();
            const data = await weatherService.getWeatherByCoordinates(
                latitude,
                longitude
            );
            eventBus.trigger('weather:loaded', { data });
        } catch (err) {
            eventBus.trigger('weather:error', { message: err.message });
        }
    });
}
