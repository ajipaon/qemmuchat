import {
    ColorSchemeScript,
    localStorageColorSchemeManager,
    MantineProvider
} from '@mantine/core';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './layout.css';
// import '@mantine/core/styles.css';
// import '@mantine/carousel/styles.css';
// import '@mantine/dropzone/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import RouterComponent from '../routes';
import { ModalsProvider } from '@mantine/modals';

export default function Layout() {

    return (
        <>
            <MantineProvider
                theme={theme}
                defaultColorScheme="dark"
                colorSchemeManager={localStorageColorSchemeManager({ key: 'mantine-ui-color-scheme' })}
            >
                <Notifications position="top-right" zIndex={1000} />
                <ModalsProvider>
                    <ColorSchemeScript
                        defaultColorScheme="auto"
                        localStorageKey="mantine-ui-color-scheme"
                    />
                    <RouterComponent />
                </ModalsProvider>
            </MantineProvider>
        </>
    );
}
