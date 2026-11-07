export function getRequiredElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Не найден элемент #${id}`);
    }
    return element;
}
