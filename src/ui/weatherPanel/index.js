import { createStateContainer } from './stateContainer.js';
import { createWeatherDisplay } from './weatherDisplay.js';

export function createWeatherPanel() {
    const stateContainer = createStateContainer();
    const weatherDisplay = createWeatherDisplay();

    stateContainer.dataSlot.append(weatherDisplay.element);

    function renderWeather(data) {
        weatherDisplay.render(data);
        stateContainer.showState('data');
    }

    function renderError(message) {
        stateContainer.setErrorMessage(message);
        stateContainer.showState('error');
    }

    return {
        element: stateContainer.element,
        renderWeather,
        renderError,
        showState: stateContainer.showState,
    };
}
