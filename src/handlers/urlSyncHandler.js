export function urlSyncHandler(eventBus, { router }) {
    eventBus.on('weather:loaded', ({ data }) => {
        router.navigate(`/weather/${encodeURIComponent(data.name)}`);
    });
}
