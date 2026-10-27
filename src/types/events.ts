import type { HistoryItem } from '@/types/history';
import type { WeatherData } from '@/types/weather';

export interface RouteParams {
    city?: string;
}

export type AppEventMap = {
    'route:home': RouteParams;
    'route:weather': { city: string };
    'route:about': RouteParams;

    'navigate:to': { pathname: string };

    'search:city': { cityName: string };
    'search:geolocation': void;

    'weather:loading': void;
    'weather:loaded': { data: WeatherData };
    'weather:error': { message: string };
    'weather:reset': void;

    'map:request': {
        latitude: number;
        longitude: number;
        width: number;
        height: number;
        cityName: string;
    };
    'map:url-ready': { url: string; alt: string };

    'history:updated': { history: HistoryItem[] };
    'history:clear': void;
    'history:select': { cityName: string };
};

export type AppEventName = keyof AppEventMap;

export type AppEventPayload<T extends AppEventName> = AppEventMap[T];

export type AppRouteEvent = Extract<AppEventName, `route:${string}`>;
