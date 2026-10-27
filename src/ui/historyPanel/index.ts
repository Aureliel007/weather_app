import type { EventEmitter } from '@/core/EventEmitter';
import { createElement } from '@/utils/createElement';
import { createHistoryItem } from './historyItem';

export function createHistoryPanel(eventBus: EventEmitter): {
    element: HTMLElement;
} {
    const historyList = createElement('div', { className: 'history-list' });

    const clearButton = createElement(
        'button',
        { className: 'btn-secondary' },
        createElement('i', { className: 'fas fa-trash-alt' }),
        ' Очистить историю'
    );
    clearButton.addEventListener('click', () => {
        eventBus.trigger('history:clear');
    });

    const element = createElement(
        'div',
        { className: 'card' },
        createElement(
            'div',
            { className: 'section-header' },
            createElement(
                'h2',
                {},
                createElement('i', { className: 'fas fa-history' }),
                ' История поиска'
            )
        ),
        createElement(
            'div',
            { className: 'history-container' },
            historyList,
            createElement('div', { className: 'history-actions' }, clearButton)
        )
    );

    eventBus.on('history:updated', ({ history }) => {
        historyList.innerHTML = '';
        history.forEach((entry) => {
            historyList.append(createHistoryItem(entry));
        });
    });

    return { element };
}
