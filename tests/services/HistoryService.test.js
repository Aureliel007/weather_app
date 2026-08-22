import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryService } from '@/services/HistoryService.js';

describe('historyService', () => {
    let service;

    beforeEach(() => {
        localStorage.clear();
        service = new HistoryService();
    });

    it('возвращает пустой массив, если истории ещё нет', () => {
        expect(service.getHistory()).toEqual([]);
    });

    it('добавляет город в историю', () => {
        const entry = {
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 'today',
        };
        const result = service.addToHistory(entry);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Moscow');
    });

    it('не дублирует город, поднимает его наверх', () => {
        service.addToHistory({
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 't1',
        });
        service.addToHistory({
            name: 'Paris',
            country: 'France',
            temperature: 17,
            weatherCode: 1,
            timestamp: 't2',
        });
        const result = service.addToHistory({
            name: 'moscow',
            country: 'Russia',
            temperature: 16,
            weatherCode: 0,
            timestamp: 't3',
        });
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('moscow');
        expect(result[0].timestamp).toBe('t3');
    });

    it('хранит не больше 10 записей', () => {
        for (let i = 0; i < 12; i++) {
            service.addToHistory({
                name: `City${i}`,
                country: 'X',
                temperature: i,
                weatherCode: 0,
                timestamp: `t${i}`,
            });
        }
        const result = service.getHistory();
        expect(result).toHaveLength(10);
        expect(result[0].name).toBe('City11');
    });

    it('очищает историю', () => {
        service.addToHistory({
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 't1',
        });
        service.clearHistory();
        expect(service.getHistory()).toEqual([]);
    });
});
