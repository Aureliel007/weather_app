const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY;

export function getStaticMapUrl(latitude, longitude, width, height, zoom = 12) {
    const params = new URLSearchParams({
        ll: `${longitude},${latitude}`,
        z: zoom.toString(),
        size: `${width},${height}`,
        l: 'map',
        pt: `${longitude},${latitude},pm2dgm`,
        apikey: API_KEY,
    });

    return `https://static-maps.yandex.ru/1.x/?${params}`;
}
