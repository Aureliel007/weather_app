import type { WeatherInfo } from '@/types/weather';

interface WeatherGroup {
    codes: number[];
    description: string;
    icon: string;
}

const WEATHER_GROUPS: WeatherGroup[] = [
    { codes: [0], description: 'Ясно', icon: 'fa-sun' },
    {
        codes: [1, 2],
        description: 'Переменная облачность',
        icon: 'fa-cloud-sun',
    },
    { codes: [3], description: 'Пасмурно', icon: 'fa-cloud' },
    { codes: [45, 48], description: 'Туман', icon: 'fa-smog' },
    {
        codes: [51, 53, 55, 61, 63, 65, 80, 81, 82],
        description: 'Дождь',
        icon: 'fa-cloud-showers-heavy',
    },
    {
        codes: [71, 73, 75, 77, 85, 86],
        description: 'Снег',
        icon: 'fa-snowflake',
    },
    { codes: [95, 96, 99], description: 'Гроза', icon: 'fa-bolt' },
];

const CODE_TO_GROUP = new Map<number, WeatherGroup>(
    WEATHER_GROUPS.flatMap((group) =>
        group.codes.map((code): [number, WeatherGroup] => [code, group])
    )
);

export function getWeatherInfo(code: number): WeatherInfo {
    const group = CODE_TO_GROUP.get(code);
    return group
        ? { description: group.description, icon: group.icon }
        : { description: 'Неизвестно', icon: 'fa-question' };
}
