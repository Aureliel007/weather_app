import { describe, it, expect, beforeEach } from 'vitest';
import { GeolocationService } from '@/services/GeolocationService';
import {
    createGeolocationMock,
    createPosition,
    createPositionError,
    stubGeolocation,
} from '../helpers/browser';
import type { GetCurrentPositionMock } from '../helpers/browser';

describe('GeolocationService', () => {
    let service: GeolocationService;
    let getCurrentPosition: GetCurrentPositionMock;

    beforeEach(() => {
        service = new GeolocationService();
        getCurrentPosition = createGeolocationMock();
        stubGeolocation({ getCurrentPosition });
    });

    it('возвращает координаты при успешном запросе', async () => {
        getCurrentPosition.mockImplementation((success) => {
            success(createPosition(55.75, 37.61));
        });

        const result = await service.getCurrentPosition();
        expect(result).toEqual({ latitude: 55.75, longitude: 37.61 });
    });

    it('выбрасывает ошибку при отказе в доступе', async () => {
        getCurrentPosition.mockImplementation((_success, error) => {
            error?.(createPositionError(1));
        });

        await expect(service.getCurrentPosition()).rejects.toThrow('запрещён');
    });

    it('выбрасывает ошибку, если геолокация не поддерживается', async () => {
        stubGeolocation(null);

        await expect(service.getCurrentPosition()).rejects.toThrow(
            'не поддерживается'
        );
    });
});
