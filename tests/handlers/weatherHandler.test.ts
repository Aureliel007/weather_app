import { beforeEach, describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter';
import { weatherHandler } from '@/handlers/weatherHandler';
import { createWeatherData } from '../helpers/factories';
import {
    createFakeGeolocationService,
    createFakeWeatherService,
} from '../helpers/fakes';

describe('weatherHandler', () => {
    const cityData = createWeatherData();
    let bus: EventEmitter;
    let loadingSpy: Mock;
    let loadedSpy: Mock;
    let errorSpy: Mock;

    beforeEach(() => {
        bus = new EventEmitter();
        loadingSpy = vi.fn();
        loadedSpy = vi.fn();
        errorSpy = vi.fn();
    });

    it('на search:city публикует weather:loading затем weather:loaded', async () => {
        bus.on('weather:loading', loadingSpy);
        bus.on('weather:loaded', loadedSpy);
        const weatherService = createFakeWeatherService();
        weatherService.getWeatherByCity.mockResolvedValue(cityData);

        weatherHandler(bus, {
            weatherService,
            geolocationService: createFakeGeolocationService(),
        });
        bus.trigger('search:city', { cityName: cityData.name });

        await vi.waitFor(() => expect(loadedSpy).toHaveBeenCalled());
        expect(loadingSpy).toHaveBeenCalled();
        expect(loadedSpy).toHaveBeenCalledWith({ data: cityData });
    });

    it('на ошибку публикует weather:error', async () => {
        bus.on('weather:error', errorSpy);
        const weatherService = createFakeWeatherService();
        weatherService.getWeatherByCity.mockRejectedValue(
            new Error('Город не найден')
        );

        weatherHandler(bus, {
            weatherService,
            geolocationService: createFakeGeolocationService(),
        });
        bus.trigger('search:city', { cityName: cityData.name });

        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith({ message: 'Город не найден' });
    });

    it('на search:geolocation использует GeolocationService и getWeatherByCoordinates', async () => {
        bus.on('weather:loaded', loadedSpy);
        const geolocationService = createFakeGeolocationService();
        geolocationService.getCurrentPosition.mockResolvedValue({
            latitude: 1,
            longitude: 2,
        });
        const weatherService = createFakeWeatherService();
        weatherService.getWeatherByCoordinates.mockResolvedValue(cityData);

        weatherHandler(bus, { weatherService, geolocationService });
        bus.trigger('search:geolocation');

        await vi.waitFor(() => expect(loadedSpy).toHaveBeenCalled());
        expect(weatherService.getWeatherByCoordinates).toHaveBeenCalledWith(
            1,
            2
        );
    });
});
