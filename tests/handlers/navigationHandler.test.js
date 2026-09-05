import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter.js';
import { navigationHandler } from '@/handlers/navigationHandler.js';

describe('navigationHandler', () => {
    it('на navigate:to вызывает router.navigate с переданным путём', () => {
        const bus = new EventEmitter();
        const router = { navigate: vi.fn() };

        navigationHandler(bus, { router });
        bus.trigger('navigate:to', { pathname: '/weather/Duckburg' });

        expect(router.navigate).toHaveBeenCalledWith('/weather/Duckburg');
    });
});
