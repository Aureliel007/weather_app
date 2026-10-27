import type { AppEventMap } from '@/types/events';

export type EventHandler<P> = (payload: P) => void | Promise<void>;

type StoredHandler = (payload: never) => void | Promise<void>;

type TriggerArgs<M extends object, K extends keyof M> = M[K] extends void
    ? [eventName: K]
    : [eventName: K, payload: M[K]];

export class EventEmitter<M extends object = AppEventMap> {
    #events = new Map<keyof M, StoredHandler[]>();

    on<K extends keyof M>(eventName: K, cb: EventHandler<M[K]>): void {
        const handlers = this.#events.get(eventName) ?? [];
        handlers.push(cb);
        this.#events.set(eventName, handlers);
    }

    off<K extends keyof M>(eventName: K, cb: EventHandler<M[K]>): void {
        const handlers = this.#events.get(eventName);
        if (!handlers) return;
        this.#events.set(
            eventName,
            handlers.filter((el) => el !== cb)
        );
    }

    trigger<K extends keyof M>(...args: TriggerArgs<M, K>): void {
        const [eventName, payload] = args as [K, M[K] | undefined];
        this.#events.get(eventName)?.forEach((cb) => {
            try {
                void cb(payload as never);
            } catch (e) {
                console.error(
                    `Error on triggering ${String(eventName)} with `,
                    payload,
                    e
                );
            }
        });
    }
}
