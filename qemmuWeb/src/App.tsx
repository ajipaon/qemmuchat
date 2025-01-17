import { BrowserRouter } from 'react-router-dom';
import { DirectionProvider } from '@mantine/core';
import { QueryProvider } from './query';
import Layout from './layout/layout';
import { useEffect } from 'react';

function App() {
    let user: any;
    try {
        user = JSON.parse(localStorage.getItem("user") || "")
    } catch (e) { }


    useEffect(() => {
        const registerServiceWorker = async () => {
            if (user?.id) {
                if ('serviceWorker' in navigator && 'PushManager' in window) {
                    try {
                        const registration = await navigator.serviceWorker.register('/service-worker.js');

                        const response = await fetch('/notification/key');
                        const vapidPublicKey = await response.json();
                        if (!vapidPublicKey.data) return;
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey.data),
                        });
                        await fetch(`/notification/${user.id}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(subscription),
                        });
                    } catch (error: any) {
                        // console.log(error.message);
                    }
                }
            }
        };

        registerServiceWorker();
    }, []);

    return (
        <BrowserRouter>
            <DirectionProvider initialDirection="ltr" detectDirection={false}>
                <QueryProvider>
                    <Layout />
                </QueryProvider>
            </DirectionProvider>
        </BrowserRouter>
    );
}

export default App;

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}