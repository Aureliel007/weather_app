import { createElement } from '@/utils/createElement.js';
import { createSearchForm } from '@/ui/searchForm';
import { createWeatherPanel } from '@/ui/weatherPanel';
import { createMapPanel } from '@/ui/mapPanel';
import { createHistoryPanel } from '@/ui/historyPanel';

export function createWeatherView(eventBus) {
    const weatherPanel = createWeatherPanel(eventBus);
    const mapPanel = createMapPanel(eventBus);
    const historyPanel = createHistoryPanel(eventBus);
    const searchForm = createSearchForm(eventBus);

    const mainContent = createElement(
        'div',
        { className: 'main-content' },
        createElement(
            'section',
            { className: 'weather-section' },
            createElement('div', { className: 'card' }, weatherPanel.element)
        ),
        createElement('section', { className: 'map-section' }, mapPanel.element)
    );

    const sidebar = createElement(
        'div',
        { className: 'sidebar' },
        createElement(
            'section',
            { className: 'history-section' },
            historyPanel.element
        )
    );

    const desktopContainer = createElement(
        'div',
        { className: 'desktop-container' },
        mainContent,
        sidebar
    );

    const searchSection = createElement(
        'section',
        { className: 'search-section' },
        createElement(
            'div',
            { className: 'card' },
            createElement('h2', {}, 'Найти город'),
            searchForm.element
        )
    );

    const element = createElement('div', {}, searchSection, desktopContainer);

    return { element };
}
