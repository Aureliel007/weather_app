import { describe, it, expect, beforeEach } from 'vitest';
import {
    getHistory,
    addToHistory,
    clearHistory,
} from '@/scripts/weatherHistory.js';

describe('historyService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('возвращает пустой массив, если истории ещё нет', () => {
        expect(getHistory()).toEqual([]);
    });

    it('добавляет город в историю', () => {
        const entry = {
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 'today',
        };
        const result = addToHistory(entry);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Moscow');
    });

    it('не дублирует город, поднимает его наверх', () => {
        addToHistory({
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 't1',
        });
        addToHistory({
            name: 'Paris',
            country: 'France',
            temperature: 17,
            weatherCode: 1,
            timestamp: 't2',
        });
        const result = addToHistory({
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
            addToHistory({
                name: `City${i}`,
                country: 'X',
                temperature: i,
                weatherCode: 0,
                timestamp: `t${i}`,
            });
        }
        const result = getHistory();
        expect(result).toHaveLength(10);
        expect(result[0].name).toBe('City11');
    });

    it('очищает историю', () => {
        addToHistory({
            name: 'Moscow',
            country: 'Russia',
            temperature: 15,
            weatherCode: 0,
            timestamp: 't1',
        });
        clearHistory();
        expect(getHistory()).toEqual([]);
    });
});
