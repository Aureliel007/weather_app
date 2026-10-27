import type { EventEmitter } from '@/core/EventEmitter';
import type { HistoryService } from '@/services/HistoryService';
import { formatDate, formatTime } from '@/utils/formatDateTime';

interface HistoryHandlerDeps {
    historyService: Pick<
        HistoryService,
        'getHistory' | 'addToHistory' | 'clearHistory'
    >;
}

export function historyHandler(
    eventBus: EventEmitter,
    { historyService }: HistoryHandlerDeps
): void {
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
