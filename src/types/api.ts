export interface GeocodeResultDto {
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
}

export interface OpenMeteoGeocodingResponse {
    results?: GeocodeResultDto[];
}

export interface OpenMeteoCurrentDto {
    temperature_2m: number | null;
    weathercode: number | null;
    windspeed_10m: number | null;
    relative_humidity_2m: number | null;
    surface_pressure: number | null;
}

export interface OpenMeteoForecastResponse {
    current: OpenMeteoCurrentDto;
}

export interface NominatimAddressDto {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
}

export interface NominatimReverseResponse {
    address?: NominatimAddressDto;
}
