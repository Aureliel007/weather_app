import { createElement } from '@/utils/createElement.js';

export function createAboutPage() {
    const element = createElement(
        'section',
        { className: 'about-section' },
        createElement(
            'div',
            { className: 'card' },
            createElement('h2', {}, 'О приложении'),
            createElement(
                'p',
                {},
                'Weather Forecast - приложение для просмотра текущей погоды по названию города или по вашей геолокации.'
            ),
            createElement(
                'p',
                {},
                'Получение погоды осуществляется через Open-Meteo, карта - Яндекс.Карты Static API, история поиска хранится локально в браузере.'
            )
        )
    );

    return { element };
}
