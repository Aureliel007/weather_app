export class HistoryService {
    #storageKey = 'weather-search-history';
    #maxHistory = 10;

    getHistory() {
        const raw = localStorage.getItem(this.#storageKey);
        return raw ? JSON.parse(raw) : [];
    }

    addToHistory(entry) {
        const history = this.getHistory().filter(
            (item) => item.name.toLowerCase() !== entry.name.toLowerCase()
        );
        history.unshift(entry);
        const trimmed = history.slice(0, this.#maxHistory);
        localStorage.setItem(this.#storageKey, JSON.stringify(trimmed));
        return trimmed;
    }

    clearHistory() {
        localStorage.removeItem(this.#storageKey);
    }
}
