import type { EventEmitter } from '@/core/EventEmitter';
import type { Router } from '@/router/router';

interface UrlSyncHandlerDeps {
    router: Pick<Router, 'navigate'>;
}

export function urlSyncHandler(
    eventBus: EventEmitter,
    { router }: UrlSyncHandlerDeps
): void {
    eventBus.on('weather:loaded', ({ data }) => {
        router.navigate(`/weather/${encodeURIComponent(data.name)}`);
    });
}
