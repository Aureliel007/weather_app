import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter.js';
import { routeHandler } from '@/handlers/routeHandler.js';

describe('routeHandler', () => {
    let bus;
    let spy;

    beforeEach(() => {
        bus = new EventEmitter();
        spy = vi.fn();
    });

    it('на route:weather публикует search:city с городом из параметров маршрута', () => {
        bus.on('search:city', spy);
        routeHandler(bus);
        bus.trigger('route:weather', { city: 'Moscow' });
        expect(spy).toHaveBeenCalledWith({ cityName: 'Moscow' });
    });

    it('на route:home публикует weather:reset', () => {
        bus.on('weather:reset', spy);
        routeHandler(bus);
        bus.trigger('route:home');
        expect(spy).toHaveBeenCalled();
    });
});
