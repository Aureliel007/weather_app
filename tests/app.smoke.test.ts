import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '@/main';
import {
    createFetchMock,
    jsonResponse,
    stubGlobalFetch,
} from './helpers/browser';
import type { FetchMock } from './helpers/browser';

const GEOCODING_RESPONSE = {
    results: [
        {
            name: 'Moscow',
            country: 'Russia',
            latitude: 55.75,
            longitude: 37.61,
        },
    ],
};

const FORECAST_RESPONSE = {
    current: {
        temperature_2m: -2.4,
        weathercode: 71,
        windspeed_10m: 5,
        relative_humidity_2m: 80,
        surface_pressure: 1005,
    },
};

function stubOpenMeteo(fetchMock: FetchMock): void {
    fetchMock.mockImplementation((input) => {
        const url = String(input);
        const body = url.includes('geocoding')
            ? GEOCODING_RESPONSE
            : FORECAST_RESPONSE;
        return Promise.resolve(jsonResponse(body));
    });
}

function submitCitySearch(cityName: string): void {
    const input = document.querySelector<HTMLInputElement>('#cityInput');
    expect(input).not.toBeNull();
    if (!input) return;
    input.value = cityName;
    document
        .querySelector('#cityForm')
        ?.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true })
        );
}

describe('smoke: сборка приложения', () => {
    let fetchMock: FetchMock;

    beforeEach(() => {
        localStorage.clear();
        location.hash = '#!/';
        document.body.innerHTML = '<div id="app"></div>';
        fetchMock = createFetchMock();
        stubGlobalFetch(fetchMock);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('рендерит форму, историю и переключает роуты', () => {
        main();

        expect(document.querySelector('#cityForm')).not.toBeNull();
        expect(document.querySelector('.history-list')).not.toBeNull();
        expect(
            document.querySelector('.about-section')?.closest('.hidden')
        ).not.toBeNull();

        location.hash = '#!/about';
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        expect(
            document.querySelector('.about-section')?.closest('.hidden')
        ).toBeNull();
    });

    it('проходит путь поиск -> роут -> поиск погоды -> отрисовка', async () => {
        stubOpenMeteo(fetchMock);
        main();
        submitCitySearch('Moscow');

        await vi.waitFor(() =>
            expect(
                document.querySelector('.temperature')?.textContent
            ).toContain('-2°C')
        );

        expect(location.hash).toBe('#!/weather/Moscow');
        expect(
            document.querySelector('.weather-description')?.textContent
        ).toBe('Снег');
        expect(document.querySelectorAll('.history-item')).toHaveLength(1);
        expect(
            document.querySelectorAll('.state-container.hidden')
        ).toHaveLength(3);
        expect(
            document.querySelector<HTMLImageElement>('.map-container img')?.src
        ).toContain('static-maps.yandex.ru');
    });

    it('показывает состояние ошибки при неизвестном городе', async () => {
        fetchMock.mockResolvedValue(jsonResponse({ results: [] }));
        main();
        submitCitySearch('Abracadabra');

        await vi.waitFor(() =>
            expect(
                document.querySelector('.fa-exclamation-circle')
            ).not.toBeNull()
        );
    });
});
