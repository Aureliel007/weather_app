import type { EventEmitter } from '@/core/EventEmitter';
import type { MapService } from '@/services/MapService';

interface MapHandlerDeps {
    mapService: Pick<MapService, 'getStaticMapUrl'>;
}

export function mapHandler(
    eventBus: EventEmitter,
    { mapService }: MapHandlerDeps
): void {
    eventBus.on(
        'map:request',
        ({ latitude, longitude, width, height, cityName }) => {
            const url = mapService.getStaticMapUrl(
                latitude,
                longitude,
                width,
                height
            );
            eventBus.trigger('map:url-ready', {
                url,
                alt: `Карта города ${cityName}`,
            });
        }
    );
}
