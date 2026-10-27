export function formatDate(date: Date = new Date()): string {
    return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatTime(date: Date = new Date()): string {
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
