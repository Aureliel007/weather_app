import type { EventEmitter } from '@/core/EventEmitter';

export function routeHandler(eventBus: EventEmitter): void {
    eventBus.on('route:weather', ({ city }) => {
        eventBus.trigger('search:city', { cityName: city });
    });

    eventBus.on('route:home', () => {
        eventBus.trigger('weather:reset');
    });
}
