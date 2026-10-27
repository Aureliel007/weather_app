export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Place {
    name: string;
    country: string;
}

export type Location = Place & Coordinates;

export interface CurrentWeather {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
    pressure: number;
}

export type WeatherData = Place & Coordinates & CurrentWeather;

export interface WeatherInfo {
    description: string;
    icon: string;
}

export type PanelState = 'empty' | 'loading' | 'error' | 'data';
