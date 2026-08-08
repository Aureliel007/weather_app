export function getStaticMapUrl(latitude, longitude, width, height, zoom = 12) {
    const params = new URLSearchParams({
        ll: `${longitude},${latitude}`,
        z: zoom.toString(),
        size: `${width},${height}`,
        l: 'map',
        pt: `${longitude},${latitude},pm2dgm`,
    });

    return `https://static-maps.yandex.ru/1.x/?${params}`;
}
