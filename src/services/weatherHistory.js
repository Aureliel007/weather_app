const STORAGE_KEY = 'weather-search-history';
const MAX_HISTORY = 10;

export function getHistory() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function addToHistory(entry) {
    const history = getHistory().filter(
        (item) => item.name.toLowerCase() !== entry.name.toLowerCase()
    );
    history.unshift(entry);
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
}
