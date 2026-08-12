import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    geocodeCity,
    fetchWeather,
    getWeatherByCity,
} from '@/services/weatherService.js';

describe('geocodeCity', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('возвращает координаты при успешном поиске', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                results: [
                    {
                        name: 'Moscow',
                        country: 'Russia',
                        latitude: 55.75,
                        longitude: 37.61,
                    },
                ],
            }),
        });
        const result = await geocodeCity('Москва');
        expect(result).toEqual({
            name: 'Moscow',
            country: 'Russia',
            latitude: 55.75,
            longitude: 37.61,
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('выбрасывает ошибку, если город не найден', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] }),
        });
        await expect(geocodeCity('Абракадабра')).rejects.toThrow('не найден');
    });

    it('выбрасывает ошибку при неуспешном ответе', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500 });
        await expect(geocodeCity('Москва')).rejects.toThrow(
            'Ошибка геокодинга'
        );
    });
});

describe('fetchWeather', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('возвращает данные о погоде по координатам', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                current: {
                    temperature_2m: 15,
                    weathercode: 3,
                    windspeed_10m: 4.1,
                    relative_humidity_2m: 76,
                    surface_pressure: 1015,
                },
            }),
        });
        const result = await fetchWeather(55.75, 37.61);
        expect(result).toEqual({
            temperature: 15,
            weatherCode: 3,
            windSpeed: 4.1,
            humidity: 76,
            pressure: 1015,
        });
    });

    it('выбрасывает ошибку при неуспешном ответе', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 404 });
        await expect(fetchWeather(0, 0)).rejects.toThrow(
            'Ошибка получения погоды'
        );
    });
});

describe('getWeatherByCity', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('объединяет данные геокодинга и погоды', async () => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: 'Moscow',
                            country: 'Russia',
                            latitude: 55.75,
                            longitude: 37.61,
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    current: {
                        temperature_2m: 15,
                        weathercode: 0,
                        windspeed_10m: 3,
                        relative_humidity_2m: 50,
                        surface_pressure: 1010,
                    },
                }),
            });
        const result = await getWeatherByCity('Москва');
        expect(result.name).toBe('Moscow');
        expect(result.temperature).toBe(15);
        expect(result.weatherCode).toBe(0);
    });
});
