import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/EventEmitter.js';
import { historyHandler } from '@/handlers/historyHandler.js';

function createFakeHistoryService(initial = []) {
    let store = [...initial];
    return {
        getHistory: vi.fn(() => store),
        addToHistory: vi.fn((entry) => {
            store = [
                entry,
                ...store.filter((e) => e.name !== entry.name),
            ].slice(0, 10);
            return store;
        }),
        clearHistory: vi.fn(() => {
            store = [];
        }),
    };
}

describe('historyHandler', () => {
    let bus;
    let spy;

    beforeEach(() => {
        bus = new EventEmitter();
        spy = vi.fn();
    });

    it('публикует history:updated сразу при инициализации', () => {
        bus.on('history:updated', spy);
        historyHandler(bus, {
            historyService: createFakeHistoryService([{ name: 'Duckburg' }]),
        });
        expect(spy).toHaveBeenCalledWith({ history: [{ name: 'Duckburg' }] });
    });

    it('на history:clear очищает историю и публикует history:updated', () => {
        const historyService = createFakeHistoryService([{ name: '' }]);
        historyHandler(bus, { historyService });
        bus.on('history:updated', spy);
        bus.trigger('history:clear');
        expect(historyService.clearHistory).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith({ history: [] });
    });

    it('на history:select публикует search:city', () => {
        bus.on('search:city', spy);
        historyHandler(bus, { historyService: createFakeHistoryService() });
        bus.trigger('history:select', { cityName: 'Duckburg' });
        expect(spy).toHaveBeenCalledWith({ cityName: 'Duckburg' });
    });
});
