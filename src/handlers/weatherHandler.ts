import type { EventEmitter } from '@/core/EventEmitter';
import type { GeolocationService } from '@/services/GeolocationService';
import type { WeatherService } from '@/services/WeatherService';
import { toMessage } from '@/utils/errorMessage';

interface WeatherHandlerDeps {
    weatherService: Pick<
        WeatherService,
        'getWeatherByCity' | 'getWeatherByCoordinates'
    >;
    geolocationService: Pick<GeolocationService, 'getCurrentPosition'>;
}

export function weatherHandler(
    eventBus: EventEmitter,
    { weatherService, geolocationService }: WeatherHandlerDeps
): void {
    eventBus.on('search:city', async ({ cityName }) => {
        eventBus.trigger('weather:loading');
        try {
            const data = await weatherService.getWeatherByCity(cityName);
            eventBus.trigger('weather:loaded', { data });
        } catch (err) {
            eventBus.trigger('weather:error', { message: toMessage(err) });
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
            eventBus.trigger('weather:error', { message: toMessage(err) });
        }
    });
}
