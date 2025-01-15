self.addEventListener('push', async (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: data.badge || '/badge-icon.png',
        data: {
            url: data.url || "/notf"
        }
    };

    event.waitUntil(
        (async () => {
            const allClients = await self.clients.matchAll({
                includeUncontrolled: true,
                type: 'window',
            });

            let isPageOpen = false;

            allClients.forEach((client) => {
                if (client.url.includes(data.url)) {
                    isPageOpen = true;
                    client.focus();
                }
            });

            if (!isPageOpen) {
                self.registration.showNotification(data.title || 'Notification', options);
            }
        })()
    );

    // event.waitUntil(
    //     self.registration.showNotification(data.title || 'Notification', options)
    // );
});

self.addEventListener('notificationclick', (event) => {

    console.log(event)

    event.notification.close();

    const targetUrl = event.notification.data.url || '/';
    event.waitUntil(
        clients.openWindow(targetUrl)
    );
});