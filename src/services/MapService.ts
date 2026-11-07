export class MapService {
    #baseUrl = 'https://static-maps.yandex.ru/v1';
    #apiKey: string | undefined;
    #maxWidth = 600;
    #maxHeight = 450;

    constructor(apiKey?: string) {
        this.#apiKey = apiKey;
    }

    getStaticMapUrl(
        latitude: number,
        longitude: number,
        width: number = this.#maxWidth,
        height: number = this.#maxHeight,
        zoom: number = 12
    ): string {
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
            pt: `${longitude},${latitude},pm2vvm`,
            apikey: this.#apiKey ?? '',
        });

        return `${this.#baseUrl}?${params}`;
    }
}
