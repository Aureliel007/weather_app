export class GeolocationService {
    getCurrentPosition(options = {}) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error('Геолокация не поддерживается вашим браузером')
                );
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => reject(this.#mapError(error)),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5 * 60 * 1000,
                    ...options,
                }
            );
        });
    }

    #mapError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return new Error(
                    'Доступ к геолокации запрещён. Разрешите в настройках браузера'
                );
            case error.POSITION_UNAVAILABLE:
                return new Error('Не удалось определить местоположение');
            case error.TIMEOUT:
                return new Error('Превышено время ожидания геолокации');
            default:
                return new Error('Ошибка при определении местоположения');
        }
    }
}
