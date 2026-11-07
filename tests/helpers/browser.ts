import { vi } from 'vitest';
import type { Mock } from 'vitest';

export type FetchMock = Mock<
    (input: string | URL, init?: RequestInit) => Promise<Response>
>;

export type GetCurrentPositionMock = Mock<Geolocation['getCurrentPosition']>;

export function createFetchMock(): FetchMock {
    return vi.fn();
}

export function jsonResponse(
    body: unknown,
    init: { ok?: boolean; status?: number } = {}
): Response {
    return {
        ok: init.ok ?? true,
        status: init.status ?? 200,
        json: () => Promise.resolve(body),
    } as unknown as Response;
}

export function stubGlobalFetch(fetchMock: FetchMock): void {
    vi.stubGlobal('fetch', fetchMock);
}

export function createGeolocationMock(): GetCurrentPositionMock {
    return vi.fn();
}

export function stubGeolocation(
    geolocation: Partial<Geolocation> | null
): void {
    Object.defineProperty(navigator, 'geolocation', {
        value: geolocation,
        configurable: true,
        writable: true,
    });
}

export function createPosition(
    latitude: number,
    longitude: number
): GeolocationPosition {
    return {
        coords: { latitude, longitude },
        timestamp: Date.now(),
    } as unknown as GeolocationPosition;
}

export function createPositionError(code: number): GeolocationPositionError {
    return {
        code,
        message: '',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
    } as unknown as GeolocationPositionError;
}
