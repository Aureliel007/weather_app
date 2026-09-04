import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter.js';
import { mapHandler } from '@/handlers/mapHandler.js';

describe('mapHandler', () => {
    it('на map:request публикует map:url-ready', () => {
        const bus = new EventEmitter();
        const spy = vi.fn();
        bus.on('map:url-ready', spy);
        const mapService = {
            getStaticMapUrl: vi
                .fn()
                .mockReturnValue('https://map-url.com/map.png'),
        };
        mapHandler(bus, { mapService });
        bus.trigger('map:request', {
            latitude: 55.75,
            longitude: 37.61,
            width: 600,
            height: 450,
            cityName: 'Duckburg',
        });
        expect(mapService.getStaticMapUrl).toHaveBeenCalledWith(
            55.75,
            37.61,
            600,
            450
        );
        expect(spy).toHaveBeenCalledWith({
            url: 'https://map-url.com/map.png',
            alt: 'Карта города Duckburg',
        });
    });
});
