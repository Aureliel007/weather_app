import { describe, it, expect } from 'vitest';
import { getWeatherInfo } from '@/utils/weatherCodesMapping.js';

describe('getWeatherInfo', () => {
    it('возвращает "Ясно" для кода 0', () => {
        expect(getWeatherInfo(0)).toEqual({
            description: 'Ясно',
            icon: 'fa-sun',
        });
    });

    it('группирует все виды дождя под одной подписью', () => {
        const rainCodes = [51, 55, 61, 65, 80, 82];
        rainCodes.forEach((code) => {
            expect(getWeatherInfo(code).description).toBe('Дождь');
        });
    });

    it('группирует все виды снега под одной подписью', () => {
        [71, 75, 85, 86].forEach((code) => {
            expect(getWeatherInfo(code).description).toBe('Снег');
        });
    });

    it('возвращает "Неизвестно" для несуществующего кода', () => {
        expect(getWeatherInfo(9999)).toEqual({
            description: 'Неизвестно',
            icon: 'fa-question',
        });
    });
});
