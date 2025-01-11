import {
    ColorSchemeScript,
    localStorageColorSchemeManager,
    MantineProvider
} from '@mantine/core';
import '@mantine/core/styles.layer.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import './layout.css';

import { useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import RouterComponent from '../routes';
import Dashboard from '../component/dasbobard';

export default function Layout() {

    const [value] = useLocalStorage<string>({
        key: "token",

    });

    return (
        <>
            <MantineProvider
                theme={theme}
                defaultColorScheme="dark"
                colorSchemeManager={localStorageColorSchemeManager({ key: 'mantine-ui-color-scheme' })}
            >
                <Notifications position="top-right" zIndex={1000} />
                <ColorSchemeScript
                    defaultColorScheme="auto"
                    localStorageKey="mantine-ui-color-scheme"
                />
                {!value ? <RouterComponent /> : <Dashboard />}
            </MantineProvider>
        </>
    );
}
