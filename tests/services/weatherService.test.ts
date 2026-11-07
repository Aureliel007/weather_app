import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WeatherService } from '@/services/WeatherService';
import {
    createFetchMock,
    jsonResponse,
    stubGlobalFetch,
} from '../helpers/browser';
import type { FetchMock } from '../helpers/browser';

describe('WeatherService', () => {
    let service: WeatherService;
    let fetchMock: FetchMock;

    beforeEach(() => {
        service = new WeatherService();
        fetchMock = createFetchMock();
        stubGlobalFetch(fetchMock);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    describe('geocodeCity', () => {
        it('возвращает координаты при успешном поиске', async () => {
            fetchMock.mockResolvedValueOnce(
                jsonResponse({
                    results: [
                        {
                            name: 'Moscow',
                            country: 'Russia',
                            latitude: 55.75,
                            longitude: 37.61,
                        },
                    ],
                })
            );
            const result = await service.geocodeCity('Москва');
            expect(result).toEqual({
                name: 'Moscow',
                country: 'Russia',
                latitude: 55.75,
                longitude: 37.61,
            });
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        it('выбрасывает ошибку, если город не найден', async () => {
            fetchMock.mockResolvedValue(jsonResponse({ results: [] }));
            await expect(service.geocodeCity('Абракадабра')).rejects.toThrow(
                'не найден'
            );
        });

        it('выбрасывает ошибку при неуспешном ответе', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({}, { ok: false, status: 500 })
            );
            await expect(service.geocodeCity('Москва')).rejects.toThrow(
                'Ошибка геокодинга'
            );
        });
    });

    describe('fetchWeather', () => {
        it('возвращает данные о погоде по координатам', async () => {
            fetchMock.mockResolvedValueOnce(
                jsonResponse({
                    current: {
                        temperature_2m: 15,
                        weathercode: 3,
                        windspeed_10m: 4.1,
                        relative_humidity_2m: 76,
                        surface_pressure: 1015,
                    },
                })
            );
            const result = await service.fetchWeather(55.75, 37.61);
            expect(result).toEqual({
                temperature: 15,
                weatherCode: 3,
                windSpeed: 4.1,
                humidity: 76,
                pressure: 1015,
            });
        });

        it('выбрасывает ошибку при неуспешном ответе', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({}, { ok: false, status: 404 })
            );
            await expect(service.fetchWeather(0, 0)).rejects.toThrow(
                'Ошибка получения погоды'
            );
        });
    });

    describe('getWeatherByCity', () => {
        it('объединяет данные геокодинга и погоды', async () => {
            fetchMock
                .mockResolvedValueOnce(
                    jsonResponse({
                        results: [
                            {
                                name: 'Moscow',
                                country: 'Russia',
                                latitude: 55.75,
                                longitude: 37.61,
                            },
                        ],
                    })
                )
                .mockResolvedValueOnce(
                    jsonResponse({
                        current: {
                            temperature_2m: 15,
                            weathercode: 0,
                            windspeed_10m: 3,
                            relative_humidity_2m: 50,
                            surface_pressure: 1010,
                        },
                    })
                );
            const result = await service.getWeatherByCity('Москва');
            expect(result.name).toBe('Moscow');
            expect(result.temperature).toBe(15);
            expect(result.weatherCode).toBe(0);
        });
    });
});
