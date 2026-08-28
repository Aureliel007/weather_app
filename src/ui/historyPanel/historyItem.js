import { createElement } from '@/utils/createElement.js';
import { getWeatherInfo } from '@/utils/weatherCodesMapping.js';

export function createHistoryItem(entry, onSelect) {
    const { description } = getWeatherInfo(entry.weatherCode);
    const item = createElement('div', { className: 'history-item' });
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
    item.addEventListener('click', () => onSelect(entry.name));
    return item;
}
