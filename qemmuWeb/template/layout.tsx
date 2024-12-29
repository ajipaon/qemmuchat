import {ColorSchemeScript, localStorageColorSchemeManager, MantineProvider} from '@mantine/core';
import RouterComponent from '@/routes';
import Header from './header/Header';
import Footer from './footer/Footer';
import { theme } from "@/theme.ts";
interface LayoutProps {
    noHeader?: boolean;
}
// const HEADER_HEIGHT = 20;


export default function Layout({ noHeader = true }: LayoutProps) {

    return (
        <>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" localStorageKey="mantine-ui-color-scheme"/>
            </head>
            <body>
            <MantineProvider theme={theme} defaultColorScheme="auto"
                             colorSchemeManager={localStorageColorSchemeManager({key: 'mantine-ui-color-scheme'})}>
                {!noHeader && <Header/>}
                <RouterComponent/>
                {!noHeader && <Footer/>}
            </MantineProvider>
            </body>
            </>
    );
    }