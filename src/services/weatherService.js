const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

export async function geocodeCity(cityName) {
    const params = new URLSearchParams({
        name: cityName,
        count: '1',
        language: 'ru',
        format: 'json',
    });

    let response = await fetch(`${GEOCODING_URL}?${params}`);
    if (!response.ok) throw new Error(`Ошибка геокодинга: ${response.status}`);
    let data = await response.json();

    if (!data.results?.length) {
        throw new Error(`Город "${cityName}" не найден`);
    }

    const { name, country, latitude, longitude } = data.results[0];
    return { name, country, latitude, longitude };
}

export async function reverseGeocode(latitude, longitude) {
    const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: 'json',
        'accept-language': 'ru',
    });

    const response = await fetch(`${REVERSE_GEOCODING_URL}?${params}`, {
        headers: {
            'Accept-Language': 'ru',
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка обратного геокодинга: ${response.status}`);
    }

    const data = await response.json();
    const address = data.address ?? {};
    const name =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        data.name ||
        'Неизвестное место';
    const country = address.country || '';

    return { name, country };
}

export async function fetchWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current:
            'temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,surface_pressure',
        timezone: 'auto',
    });

    const response = await fetch(`${WEATHER_URL}?${params}`);
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

export async function getWeatherByCity(cityName) {
    const location = await geocodeCity(cityName);
    const weather = await fetchWeather(location.latitude, location.longitude);
    return { ...location, ...weather };
}

export async function getWeatherByCoordinates(latitude, longitude) {
    const [location, weather] = await Promise.all([
        reverseGeocode(latitude, longitude),
        fetchWeather(latitude, longitude),
    ]);

    return { ...location, latitude, longitude, ...weather };
}
