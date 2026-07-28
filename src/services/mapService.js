const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY;

export function getStaticMapUrl(latitude, longitude, zoom = 12) {
    return (
        'https://static-maps.yandex.ru/1.x/' +
        `?ll=${longitude},${latitude}` +
        `&z=${zoom}` +
        '&l=map' +
        `&pt=${longitude},${latitude},pm2rdm` +
        `&apikey=${API_KEY}`
    );
}
