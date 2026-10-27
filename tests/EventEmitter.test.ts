import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter';

type TestEventMap = {
    someEvent: { name: string };
    plainEvent: void;
    unknownEvent: void;
};

describe('EventEmitter', () => {
    const eventName = 'someEvent';
    const plainEventName = 'plainEvent';
    const eventPayload = { name: 'Alisa' };
    let bus: EventEmitter<TestEventMap>;

    beforeEach(() => {
        bus = new EventEmitter<TestEventMap>();
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
        bus.on(plainEventName, cb1);
        bus.on(plainEventName, cb2);
        bus.trigger(plainEventName);
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('не вызывает колбэк после off', () => {
        const cb = vi.fn();
        bus.on(plainEventName, cb);
        bus.off(plainEventName, cb);
        bus.trigger(plainEventName);
        expect(cb).not.toHaveBeenCalled();
    });

    it('не падает, если триггерится событие без подписчиков', () => {
        expect(() => bus.trigger('unknownEvent')).not.toThrow();
    });

    it('ошибка в одном колбэке не останавливает остальные', () => {
        const failing = vi.fn(() => {
            throw new Error('boom');
        });
        const ok = vi.fn();
        bus.on(plainEventName, failing);
        bus.on(plainEventName, ok);
        bus.trigger(plainEventName);
        expect(ok).toHaveBeenCalled();
    });
});
