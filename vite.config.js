import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    base: '/weather_app/',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
