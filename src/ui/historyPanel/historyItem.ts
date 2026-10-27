import type { HistoryItem } from '@/types/history';
import { createElement } from '@/utils/createElement';
import { getWeatherInfo } from '@/utils/weatherCodesMapping';

export function createHistoryItem(entry: HistoryItem): HTMLAnchorElement {
    const { description } = getWeatherInfo(entry.weatherCode);
    const item = createElement('a', {
        className: 'history-item',
        href: `#!/weather/${encodeURIComponent(entry.name)}`,
    });
    item.innerHTML = `
    <div class="history-item-city">
      <div class="city-icon"><i class="fas fa-map-marker-alt"></i></div>
      <div class="city-info">
        <h3>${entry.name}, ${entry.country}</h3>
        <p>${entry.timestamp}</p>
      </div>
    </div>
    <div class="history-item-weather">
      <p>${Math.round(entry.temperature)}°C</p>
      <p>${description}</p>
    </div>
  `;
    return item;
}
