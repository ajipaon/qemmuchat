import {ColorSchemeScript, localStorageColorSchemeManager, MantineProvider} from '@mantine/core';
import RouterComponent from '@/routes';
import Dashboard from '@/component/dasbobard'
import { theme } from "@/theme.ts";
interface LayoutProps {
    session?: string | null;
}
// const HEADER_HEIGHT = 20;


export default function Layout({ session = "null" }: LayoutProps) {

    return (
        <>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" localStorageKey="mantine-ui-color-scheme"/>
            </head>
            <body>
            <MantineProvider theme={theme} defaultColorScheme="auto"
                             colorSchemeManager={localStorageColorSchemeManager({key: 'mantine-ui-color-scheme'})}>
                {!session && <RouterComponent/>}
                {session && <Dashboard/>}
            </MantineProvider>
            </body>
            </>
    );
    }