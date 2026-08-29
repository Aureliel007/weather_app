import { createStateContainer } from './stateContainer.js';
import { createWeatherDisplay } from './weatherDisplay.js';

export function createWeatherPanel(eventBus) {
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

    return { element: stateContainer.element };
}
