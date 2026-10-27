import type { EventEmitter } from '@/core/EventEmitter';
import type { Router } from '@/router/router';

interface NavigationHandlerDeps {
    router: Pick<Router, 'navigate'>;
}

export function navigationHandler(
    eventBus: EventEmitter,
    { router }: NavigationHandlerDeps
): void {
    eventBus.on('navigate:to', ({ pathname }) => {
        router.navigate(pathname);
    });
}
