import { main } from '@/main';

function onLoad(fn: () => void): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

onLoad(main);
