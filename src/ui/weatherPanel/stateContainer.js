import { createElement } from '@/utils/createElement.js';

export function createStateContainer() {
    const emptyState = createElement(
        'div',
        { className: 'state-container' },
        createElement('i', { className: 'fas fa-cloud-sun state-icon' }),
        createElement('h3', {}, 'Погода ещё не найдена'),
        createElement(
            'p',
            {},
            'Введите название города, чтобы увидеть прогноз погоды'
        )
    );

    const loadingState = createElement(
        'div',
        { className: 'state-container hidden' },
        createElement('div', { className: 'spinner' }),
        createElement('h3', {}, 'Загружаем данные...')
    );

    const errorMessageEl = createElement(
        'p',
        {},
        'Попробуйте ввести другое название'
    );
    const errorState = createElement(
        'div',
        { className: 'state-container hidden' },
        createElement('i', {
            className: 'fas fa-exclamation-circle state-icon error',
        }),
        createElement('h3', {}, 'Не удалось найти город'),
        errorMessageEl
    );

    const dataSlot = createElement('div', { className: 'hidden' });
    const container = createElement(
        'div',
        {},
        emptyState,
        loadingState,
        errorState,
        dataSlot
    );

    function showState(state) {
        emptyState.classList.toggle('hidden', state !== 'empty');
        loadingState.classList.toggle('hidden', state !== 'loading');
        errorState.classList.toggle('hidden', state !== 'error');
        dataSlot.classList.toggle('hidden', state !== 'data');
    }

    function setErrorMessage(message) {
        errorMessageEl.textContent =
            message || 'Попробуйте ввести другое название';
    }

    showState('empty');

    return { element: container, dataSlot, showState, setErrorMessage };
}
