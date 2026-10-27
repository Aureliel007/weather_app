import { describe, it, expect } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter';
import { urlSyncHandler } from '@/handlers/urlSyncHandler';
import { createWeatherData } from '../helpers/factories';
import { createFakeRouter } from '../helpers/fakes';

describe('urlSyncHandler', () => {
    it('на weather:loaded вызывает router.navigate с закодированным именем города', () => {
        const bus = new EventEmitter();
        const router = createFakeRouter();

        urlSyncHandler(bus, { router });
        bus.trigger('weather:loaded', {
            data: createWeatherData({ name: 'Рим' }),
        });

        expect(router.navigate).toHaveBeenCalledWith(
            `/weather/${encodeURIComponent('Рим')}`
        );
    });
});
