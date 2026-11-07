export type ElementChild = Node | string;

export type ElementAttributes<K extends keyof HTMLElementTagNameMap> = Partial<
    HTMLElementTagNameMap[K]
>;

export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes: ElementAttributes<K> = {},
    ...children: ElementChild[]
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    element.append(...children);
    return element;
}
