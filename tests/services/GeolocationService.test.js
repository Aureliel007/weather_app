import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeolocationService } from '@/services/GeolocationService.js';

describe('GeolocationService', () => {
    let service;

    beforeEach(() => {
        service = new GeolocationService();
        global.navigator.geolocation = { getCurrentPosition: vi.fn() };
    });

    it('возвращает координаты при успешном запросе', async () => {
        global.navigator.geolocation.getCurrentPosition.mockImplementation(
            (success) => {
                success({ coords: { latitude: 55.75, longitude: 37.61 } });
            }
        );

        const result = await service.getCurrentPosition();
        expect(result).toEqual({ latitude: 55.75, longitude: 37.61 });
    });

    it('выбрасывает ошибку при отказе в доступе', async () => {
        global.navigator.geolocation.getCurrentPosition.mockImplementation(
            (_, error) => {
                error({ code: 1, PERMISSION_DENIED: 1 });
            }
        );

        await expect(service.getCurrentPosition()).rejects.toThrow('запрещён');
    });

    it('выбрасывает ошибку, если геолокация не поддерживается', async () => {
        global.navigator.geolocation = undefined;
        await expect(service.getCurrentPosition()).rejects.toThrow(
            'не поддерживается'
        );
    });
});
