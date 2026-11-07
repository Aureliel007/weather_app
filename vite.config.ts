import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    base: '/weather_app/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
