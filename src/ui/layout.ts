import type { EventEmitter } from '@/core/EventEmitter';
import { createElement } from '@/utils/createElement';
import { createWeatherView } from '@/ui/weatherView';
import { createAboutPage } from '@/ui/aboutPage';

export function renderApp(app: HTMLElement, root: HTMLElement): void {
    root.append(app);
}

export function createApp(eventBus: EventEmitter): HTMLElement {
    const weatherView = createWeatherView(eventBus);
    const aboutPage = createAboutPage();

    const aboutViewElement = createElement(
        'div',
        { className: 'hidden' },
        aboutPage.element
    );

    function showWeatherView() {
        weatherView.element.classList.remove('hidden');
        aboutViewElement.classList.add('hidden');
    }

    function showAboutView() {
        weatherView.element.classList.add('hidden');
        aboutViewElement.classList.remove('hidden');
    }

    eventBus.on('route:home', showWeatherView);
    eventBus.on('route:weather', showWeatherView);
    eventBus.on('route:about', showAboutView);

    return createElement(
        'main',
        { className: 'container' },
        weatherView.element,
        aboutViewElement
    );
}
