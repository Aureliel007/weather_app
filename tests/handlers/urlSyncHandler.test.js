import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter.js';
import { urlSyncHandler } from '@/handlers/urlSyncHandler.js';

describe('urlSyncHandler', () => {
    it('на weather:loaded вызывает router.navigate с закодированным именем города', () => {
        const bus = new EventEmitter();
        const router = { navigate: vi.fn() };

        urlSyncHandler(bus, { router });
        bus.trigger('weather:loaded', { data: { name: 'Рим' } });

        expect(router.navigate).toHaveBeenCalledWith(
            `/weather/${encodeURIComponent('Рим')}`
        );
    });
});
