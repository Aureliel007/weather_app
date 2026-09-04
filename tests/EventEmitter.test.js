import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter.js';

describe('EventEmitter', () => {
    const eventName = 'someEvent';
    const eventPayload = { name: 'Alisa' };
    let bus;

    beforeEach(() => {
        bus = new EventEmitter();
    });

    it('вызывает подписанный колбэк при событии', () => {
        const cb = vi.fn();
        bus.on(eventName, cb);
        bus.trigger(eventName, eventPayload);
        expect(cb).toHaveBeenCalledWith(eventPayload);
    });

    it('вызывает несколько подписчиков на одно событие', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        bus.on(eventName, cb1);
        bus.on(eventName, cb2);
        bus.trigger(eventName);
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('не вызывает колбэк после off', () => {
        const cb = vi.fn();
        bus.on(eventName, cb);
        bus.off(eventName, cb);
        bus.trigger(eventName);
        expect(cb).not.toHaveBeenCalled();
    });

    it('не падает, если триггерится событие без подписчиков', () => {
        const bus = new EventEmitter();
        expect(() => bus.trigger('unknown')).not.toThrow();
    });

    it('ошибка в одном колбэке не останавливает остальные', () => {
        const failing = vi.fn(() => {
            throw new Error('boom');
        });
        const ok = vi.fn();
        bus.on(eventName, failing);
        bus.on(eventName, ok);
        bus.trigger(eventName);
        expect(ok).toHaveBeenCalled();
    });
});
