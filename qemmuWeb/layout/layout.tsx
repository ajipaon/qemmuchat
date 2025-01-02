import {
    ColorSchemeScript,
    localStorageColorSchemeManager,
    MantineProvider
} from '@mantine/core';
import RouterComponent from '@/routes';
import Dashboard from '@/component/dasbobard';
import { theme } from "@/theme";

interface LayoutProps {
    session?: string | null;
}

export default function Layout({ session = null }: LayoutProps) {

    // const [sessionToken] = useLocalStorage<string | null>({
    //     key: "token",
    //     defaultValue: null,
    //   });

    return (
        <>
            <MantineProvider
                theme={theme}
                defaultColorScheme="auto"
                colorSchemeManager={localStorageColorSchemeManager({ key: 'mantine-ui-color-scheme' })}
            >
                <ColorSchemeScript
                    defaultColorScheme="auto"
                    localStorageKey="mantine-ui-color-scheme"
                />
                {!session ? <RouterComponent /> : <Dashboard />}
            </MantineProvider>
        </>
    );
}
