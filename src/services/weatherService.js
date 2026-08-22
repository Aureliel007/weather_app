export class WeatherService {
    #geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    #weatherUrl = 'https://api.open-meteo.com/v1/forecast';
    #reverseGeocodingUrl = 'https://nominatim.openstreetmap.org/reverse';

    async geocodeCity(cityName) {
        const params = new URLSearchParams({
            name: cityName,
            count: '1',
            language: 'ru',
            format: 'json',
        });

        let response = await fetch(`${this.#geocodingUrl}?${params}`);
        if (!response.ok)
            throw new Error(`Ошибка геокодинга: ${response.status}`);
        let data = await response.json();
        if (!data.results?.length) {
            params.delete('language');
            response = await fetch(`${this.#geocodingUrl}?${params}`);
            data = await response.json();
        }
        if (!data.results?.length) {
            throw new Error(`Город "${cityName}" не найден`);
        }
        const { name, country, latitude, longitude } = data.results[0];
        return { name, country, latitude, longitude };
    }

    async fetchWeather(latitude, longitude) {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            current:
                'temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,surface_pressure',
            timezone: 'auto',
        });

        const response = await fetch(`${this.#weatherUrl}?${params}`);
        if (!response.ok)
            throw new Error(`Ошибка получения погоды: ${response.status}`);
        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weathercode,
            windSpeed: data.current.windspeed_10m,
            humidity: data.current.relative_humidity_2m,
            pressure: data.current.surface_pressure,
        };
    }

    async reverseGeocode(latitude, longitude) {
        const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            format: 'json',
            'accept-language': 'ru',
        });

        const response = await fetch(`${this.#reverseGeocodingUrl}?${params}`);
        if (!response.ok)
            throw new Error(`Ошибка обратного геокодинга: ${response.status}`);
        const data = await response.json();
        const address = data.address ?? {};

        return {
            name:
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                'Неизвестное место',
            country: address.country || '',
        };
    }

    async getWeatherByCity(cityName) {
        const location = await this.geocodeCity(cityName);
        const weather = await this.fetchWeather(
            location.latitude,
            location.longitude
        );
        return { ...location, ...weather };
    }

    async getWeatherByCoordinates(latitude, longitude) {
        const [location, weather] = await Promise.all([
            this.reverseGeocode(latitude, longitude),
            this.fetchWeather(latitude, longitude),
        ]);
        return { ...location, latitude, longitude, ...weather };
    }
}
