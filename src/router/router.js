const ROUTES = [
    { pattern: '/', event: 'route:home' },
    { pattern: '/weather/:city', event: 'route:weather' },
    { pattern: '/about', event: 'route:about' },
];

function compileRoute({ pattern, event }) {
    const paramNames = [];
    const regexSource = pattern.replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '([^/]+)';
    });
    return { event, paramNames, regex: new RegExp(`^${regexSource}$`) };
}

const compiledRoutes = ROUTES.map(compileRoute);

export class Router {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
    }

    #getPathname() {
        const { hash } = location;
        return hash.startsWith('#!/') ? hash.slice(2) : '/';
    }

    #resolve() {
        const pathname = this.#getPathname();

        for (const route of compiledRoutes) {
            const match = pathname.match(route.regex);
            if (!match) continue;

            const params = {};
            route.paramNames.forEach((name, i) => {
                params[name] = decodeURIComponent(match[i + 1]);
            });

            this.#eventBus.trigger(route.event, params);
            return;
        }

        this.#eventBus.trigger('route:home', {});
    }

    navigate(pathname) {
        const target = `#!${pathname}`;
        if (location.hash === target) return;
        location.hash = target;
    }

    start() {
        window.addEventListener('hashchange', () => this.#resolve());
        this.#resolve();
    }
}
