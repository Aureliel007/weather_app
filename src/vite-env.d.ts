/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_YANDEX_MAPS_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
