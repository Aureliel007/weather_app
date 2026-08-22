export class MapService {
    #baseUrl = 'https://static-maps.yandex.ru/v1';
    #apiKey;
    #maxWidth = 600;
    #maxHeight = 450;

    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    getStaticMapUrl(
        latitude,
        longitude,
        width = this.#maxWidth,
        height = this.#maxHeight,
        zoom = 12
    ) {
        const safeWidth = Math.min(
            Math.round(width) || this.#maxWidth,
            this.#maxWidth
        );
        const safeHeight = Math.min(
            Math.round(height) || this.#maxHeight,
            this.#maxHeight
        );

        const params = new URLSearchParams({
            ll: `${longitude},${latitude}`,
            z: zoom.toString(),
            size: `${safeWidth},${safeHeight}`,
            l: 'map',
            pt: `${longitude},${latitude},pm2dgm`,
            apikey: this.#apiKey ?? '',
        });

        return `${this.#baseUrl}?${params}`;
    }
}
