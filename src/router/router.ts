import type { EventEmitter } from '@/core/EventEmitter';
import type { AppRouteEvent, RouteParams } from '@/types/events';

interface RouteDefinition {
    pattern: string;
    event: AppRouteEvent;
}

interface CompiledRoute {
    event: AppRouteEvent;
    paramNames: string[];
    regex: RegExp;
}

const ROUTES: RouteDefinition[] = [
    { pattern: '/', event: 'route:home' },
    { pattern: '/weather/:city', event: 'route:weather' },
    { pattern: '/about', event: 'route:about' },
];

function compileRoute({ pattern, event }: RouteDefinition): CompiledRoute {
    const paramNames: string[] = [];
    const regexSource = pattern.replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '([^/]+)';
    });
    return { event, paramNames, regex: new RegExp(`^${regexSource}$`) };
}

const compiledRoutes = ROUTES.map(compileRoute);

export class Router {
    #eventBus: EventEmitter;

    constructor(eventBus: EventEmitter) {
        this.#eventBus = eventBus;
    }

    #getPathname(): string {
        const { hash } = location;
        return hash.startsWith('#!/') ? hash.slice(2) : '/';
    }

    #resolve(): void {
        const pathname = this.#getPathname();

        for (const route of compiledRoutes) {
            const match = pathname.match(route.regex);
            if (!match) continue;

            const params: RouteParams = {};
            route.paramNames.forEach((name, i) => {
                params[name as keyof RouteParams] = decodeURIComponent(
                    match[i + 1] ?? ''
                );
            });

            this.#eventBus.trigger(route.event, params);
            return;
        }

        this.#eventBus.trigger('route:home', {});
    }

    navigate(pathname: string): void {
        const target = `#!${pathname}`;
        if (location.hash === target) return;
        location.hash = target;
    }

    start(): void {
        window.addEventListener('hashchange', () => this.#resolve());
        this.#resolve();
    }
}
