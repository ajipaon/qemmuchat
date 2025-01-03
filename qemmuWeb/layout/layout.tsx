import {
    ColorSchemeScript,
    localStorageColorSchemeManager,
    MantineProvider
} from '@mantine/core';
import RouterComponent from '@/routes';
import Dashboard from '@/component/dasbobard';
import { theme } from "@/theme";
import { useLocalStorage } from '@mantine/hooks';


export default function Layout() {

    const [sessionToken] = useLocalStorage<string>({
        key: "token",
    });

    return (
        <>
            <MantineProvider
                theme={theme}
                defaultColorScheme="dark"
                colorSchemeManager={localStorageColorSchemeManager({ key: 'mantine-ui-color-scheme' })}
            >
                <ColorSchemeScript
                    defaultColorScheme="auto"
                    localStorageKey="mantine-ui-color-scheme"
                />
                {!sessionToken ? <RouterComponent /> : <Dashboard />}
            </MantineProvider>
        </>
    );
}
