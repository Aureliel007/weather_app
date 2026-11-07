import { vi } from 'vitest';
import type { Mock } from 'vitest';
import type { GeolocationService } from '@/services/GeolocationService';
import type { HistoryService } from '@/services/HistoryService';
import type { MapService } from '@/services/MapService';
import type { Router } from '@/router/router';
import type { WeatherService } from '@/services/WeatherService';
import type { HistoryItem } from '@/types/history';

export interface WeatherServiceFake {
    getWeatherByCity: Mock<WeatherService['getWeatherByCity']>;
    getWeatherByCoordinates: Mock<WeatherService['getWeatherByCoordinates']>;
}

export interface GeolocationServiceFake {
    getCurrentPosition: Mock<GeolocationService['getCurrentPosition']>;
}

export interface MapServiceFake {
    getStaticMapUrl: Mock<MapService['getStaticMapUrl']>;
}

export interface RouterFake {
    navigate: Mock<Router['navigate']>;
}

export interface HistoryServiceFake {
    getHistory: Mock<HistoryService['getHistory']>;
    addToHistory: Mock<HistoryService['addToHistory']>;
    clearHistory: Mock<HistoryService['clearHistory']>;
}

export function createFakeWeatherService(): WeatherServiceFake {
    return {
        getWeatherByCity: vi.fn(),
        getWeatherByCoordinates: vi.fn(),
    };
}

export function createFakeGeolocationService(): GeolocationServiceFake {
    return { getCurrentPosition: vi.fn() };
}

export function createFakeMapService(): MapServiceFake {
    return { getStaticMapUrl: vi.fn() };
}

export function createFakeRouter(): RouterFake {
    return { navigate: vi.fn() };
}

export function createFakeHistoryService(
    initial: HistoryItem[] = []
): HistoryServiceFake {
    let store = [...initial];

    return {
        getHistory: vi.fn(() => store),
        addToHistory: vi.fn((entry) => {
            store = [
                entry,
                ...store.filter((e) => e.name !== entry.name),
            ].slice(0, 10);
            return store;
        }),
        clearHistory: vi.fn(() => {
            store = [];
        }),
    };
}
