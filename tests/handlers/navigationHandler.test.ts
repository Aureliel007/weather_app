import { describe, it, expect } from 'vitest';
import { EventEmitter } from '@/core/EventEmitter';
import { navigationHandler } from '@/handlers/navigationHandler';
import { createFakeRouter } from '../helpers/fakes';

describe('navigationHandler', () => {
    it('на navigate:to вызывает router.navigate с переданным путём', () => {
        const bus = new EventEmitter();
        const router = createFakeRouter();

        navigationHandler(bus, { router });
        bus.trigger('navigate:to', { pathname: '/weather/Duckburg' });

        expect(router.navigate).toHaveBeenCalledWith('/weather/Duckburg');
    });
});
