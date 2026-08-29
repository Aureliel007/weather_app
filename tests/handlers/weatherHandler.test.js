import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/EventEmitter.js';
import { weatherHandler } from '@/handlers/weatherHandler.js';

describe('weatherHandler', () => {
    const cityData = { name: 'Duckburg' };
    let bus;

    beforeEach(() => {
        bus = new EventEmitter();
    });

    it('на search:city публикует weather:loading затем weather:loaded', async () => {
        const loadingSpy = vi.fn();
        const loadedSpy = vi.fn();
        bus.on('weather:loading', loadingSpy);
        bus.on('weather:loaded', loadedSpy);
        const weatherService = {
            getWeatherByCity: vi.fn().mockResolvedValue(cityData),
        };
        weatherHandler(bus, { weatherService, geolocationService: {} });
        bus.trigger('search:city', cityData);
        await vi.waitFor(() => expect(loadedSpy).toHaveBeenCalled());
        expect(loadingSpy).toHaveBeenCalled();
        expect(loadedSpy).toHaveBeenCalledWith({ data: cityData });
    });

    it('на ошибку публикует weather:error', async () => {
        const errorSpy = vi.fn();
        bus.on('weather:error', errorSpy);
        const weatherService = {
            getWeatherByCity: vi
                .fn()
                .mockRejectedValue(new Error('Город не найден')),
        };
        weatherHandler(bus, { weatherService, geolocationService: {} });
        bus.trigger('search:city', cityData);
        await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith({ message: 'Город не найден' });
    });

    it('на search:geolocation использует GeolocationService и getWeatherByCoordinates', async () => {
        const loadedSpy = vi.fn();
        bus.on('weather:loaded', loadedSpy);
        const geolocationService = {
            getCurrentPosition: vi
                .fn()
                .mockResolvedValue({ latitude: 1, longitude: 2 }),
        };
        const weatherService = {
            getWeatherByCoordinates: vi.fn().mockResolvedValue(cityData),
        };
        weatherHandler(bus, { weatherService, geolocationService });
        bus.trigger('search:geolocation');
        await vi.waitFor(() => expect(loadedSpy).toHaveBeenCalled());
        expect(weatherService.getWeatherByCoordinates).toHaveBeenCalledWith(
            1,
            2
        );
    });
});
