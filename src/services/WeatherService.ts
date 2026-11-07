import type {
    NominatimReverseResponse,
    OpenMeteoForecastResponse,
    OpenMeteoGeocodingResponse,
} from '@/types/api';
import type {
    CurrentWeather,
    Location,
    Place,
    WeatherData,
} from '@/types/weather';

export class WeatherService {
    #geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    #weatherUrl = 'https://api.open-meteo.com/v1/forecast';
    #reverseGeocodingUrl = 'https://nominatim.openstreetmap.org/reverse';

    async geocodeCity(cityName: string): Promise<Location> {
        const params = new URLSearchParams({
            name: cityName,
            count: '1',
            language: 'ru',
            format: 'json',
        });

        let response = await fetch(`${this.#geocodingUrl}?${params}`);
        if (!response.ok)
            throw new Error(`Ошибка геокодинга: ${response.status}`);
        let data = (await response.json()) as OpenMeteoGeocodingResponse;
        if (!data.results?.length) {
            params.delete('language');
            response = await fetch(`${this.#geocodingUrl}?${params}`);
            data = (await response.json()) as OpenMeteoGeocodingResponse;
        }
        if (!data.results?.length) {
            throw new Error(`Город "${cityName}" не найден`);
        }
        const found = data.results[0];
        if (!found) {
            throw new Error(`Город "${cityName}" не найден`);
        }

        return {
            name: found.name,
            country: found.country ?? '',
            latitude: found.latitude,
            longitude: found.longitude,
        };
    }

    async fetchWeather(
        latitude: number,
        longitude: number
    ): Promise<CurrentWeather> {
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
        const data = (await response.json()) as OpenMeteoForecastResponse;

        return {
            temperature: data.current.temperature_2m ?? 0,
            weatherCode: data.current.weathercode ?? -1,
            windSpeed: data.current.windspeed_10m ?? 0,
            humidity: data.current.relative_humidity_2m ?? 0,
            pressure: data.current.surface_pressure ?? 0,
        };
    }

    async reverseGeocode(latitude: number, longitude: number): Promise<Place> {
        const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            format: 'json',
            'accept-language': 'ru',
        });

        const response = await fetch(`${this.#reverseGeocodingUrl}?${params}`);
        if (!response.ok)
            throw new Error(`Ошибка обратного геокодинга: ${response.status}`);
        const data = (await response.json()) as NominatimReverseResponse;
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

    async getWeatherByCity(cityName: string): Promise<WeatherData> {
        const location = await this.geocodeCity(cityName);
        const weather = await this.fetchWeather(
            location.latitude,
            location.longitude
        );
        return { ...location, ...weather };
    }

    async getWeatherByCoordinates(
        latitude: number,
        longitude: number
    ): Promise<WeatherData> {
        const [location, weather] = await Promise.all([
            this.reverseGeocode(latitude, longitude),
            this.fetchWeather(latitude, longitude),
        ]);
        return { ...location, latitude, longitude, ...weather };
    }
}
