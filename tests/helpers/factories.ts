import type { HistoryItem } from '@/types/history';
import type { WeatherData } from '@/types/weather';

export function createWeatherData(
    overrides: Partial<WeatherData> = {}
): WeatherData {
    return {
        name: 'Duckburg',
        country: 'Калифорния',
        latitude: 55.75,
        longitude: 37.61,
        temperature: 15,
        weatherCode: 0,
        windSpeed: 3,
        humidity: 50,
        pressure: 1010,
        ...overrides,
    };
}

export function createHistoryEntry(
    overrides: Partial<HistoryItem> = {}
): HistoryItem {
    return {
        name: 'Duckburg',
        country: 'Калифорния',
        temperature: 15,
        weatherCode: 0,
        timestamp: 'today',
        ...overrides,
    };
}
