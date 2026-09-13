export function navigationHandler(eventBus, { router }) {
    eventBus.on('navigate:to', ({ pathname }) => {
        router.navigate(pathname);
    });
}
