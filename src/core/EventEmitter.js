export class EventEmitter {
    #events = new Map();

    on(eventName, cb) {
        console.info('@@on', { eventName, cb });
        if (!this.#events.has(eventName)) {
            this.#events.set(eventName, []);
        }
        this.#events.get(eventName).push(cb);
    }

    off(eventName, cb) {
        console.info('@@off', { eventName, cb });
        this.#events.set(
            eventName,
            this.#events.get(eventName)?.filter((el) => el !== cb)
        );
    }

    trigger(eventName, data) {
        console.info('@@trigger', { eventName, data });
        this.#events.get(eventName)?.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error(
                    `Error on triggering ${eventName} with `,
                    data,
                    e
                );
            }
        });
    }
}
