import { createElement } from '@/utils/createElement.js';

export function createSearchForm({ onSearch, onGeolocate }) {
    const input = createElement('input', {
        type: 'text',
        id: 'cityInput',
        placeholder: 'Введите название города',
        autocomplete: 'off',
    });
    input.setAttribute('aria-label', 'Название города');

    const clearButton = createElement(
        'button',
        { type: 'button', className: 'clear-button' },
        createElement('i', { className: 'fas fa-times-circle' })
    );
    clearButton.setAttribute('aria-label', 'Очистить поле');
    clearButton.addEventListener('click', () => {
        input.value = '';
        input.focus();
    });

    const inputWrapper = createElement(
        'div',
        { className: 'input-wrapper' },
        input,
        clearButton
    );
    const geolocationButton = createElement(
        'button',
        { type: 'button', id: 'geolocationButton', className: 'btn-secondary' },
        createElement('i', { className: 'fas fa-location-arrow' })
    );
    geolocationButton.setAttribute('aria-label', 'Определить местоположение');
    geolocationButton.addEventListener('click', () => onGeolocate());

    const searchRow = createElement(
        'div',
        { className: 'search-row' },
        inputWrapper,
        geolocationButton
    );
    const searchButton = createElement(
        'button',
        { type: 'submit', id: 'searchButton', className: 'btn-primary' },
        'Search'
    );

    const form = createElement(
        'form',
        { id: 'cityForm' },
        searchRow,
        searchButton
    );

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = input.value.trim();
        if (city) onSearch(city);
    });

    return {
        element: form,
        setValue: (value) => {
            input.value = value;
        },
        setSearchDisabled: (disabled) => {
            searchButton.disabled = disabled;
        },
        setGeolocationDisabled: (disabled) => {
            geolocationButton.disabled = disabled;
        },
    };
}
