import type { EventEmitter } from '@/core/EventEmitter';
import { createStateContainer } from './stateContainer';
import { createWeatherDisplay } from './weatherDisplay';

export function createWeatherPanel(eventBus: EventEmitter): {
    element: HTMLElement;
} {
    const stateContainer = createStateContainer();
    const weatherDisplay = createWeatherDisplay();

    stateContainer.dataSlot.append(weatherDisplay.element);

    eventBus.on('weather:loading', () => stateContainer.showState('loading'));
    eventBus.on('weather:loaded', ({ data }) => {
        weatherDisplay.render(data);
        stateContainer.showState('data');
    });
    eventBus.on('weather:error', ({ message }) => {
        stateContainer.setErrorMessage(message);
        stateContainer.showState('error');
    });
    eventBus.on('weather:reset', () => stateContainer.showState('empty'));

    return { element: stateContainer.element };
}
