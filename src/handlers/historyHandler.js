import { formatDate, formatTime } from '@/utils/formatDateTime.js';

export function historyHandler(eventBus, { historyService }) {
    const publishHistory = () => {
        eventBus.trigger('history:updated', {
            history: historyService.getHistory(),
        });
    };

    eventBus.on('weather:loaded', ({ data }) => {
        historyService.addToHistory({
            name: data.name,
            country: data.country,
            temperature: data.temperature,
            weatherCode: data.weatherCode,
            timestamp: `${formatDate()}, ${formatTime()}`,
        });
        publishHistory();
    });

    eventBus.on('history:clear', () => {
        historyService.clearHistory();
        publishHistory();
    });

    eventBus.on('history:select', ({ cityName }) => {
        eventBus.trigger('search:city', { cityName });
    });

    publishHistory();
}
