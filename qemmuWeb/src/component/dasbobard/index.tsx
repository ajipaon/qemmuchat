import { AppShell, Burger, rem, } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import Header from '../header/Header';
import { activeComponent } from './store/data';
import { navLinks } from '../navigation/config';
import { Navigation } from '../navigation/Navigation';
import UserList from '../person/UserList';
import MainDashboard from './Main';
import { deCodeJwt } from '../../config/jwtClient';
import { useEffect, useState } from 'react';

export default function Index() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const { componentActive } = activeComponent()
    const [user, setUser] = useState<any>(null)
    const [value] = useLocalStorage<string>({
        key: "token",

    });


    useEffect(() => {
        if (value) {
            setUser(deCodeJwt(value))
        }
    }, [value])

    const filteredNavLinks = navLinks
        .filter((item) => item.role.length === 0 || item.role.includes(user?.role || "ROLE_USER"))
        .map((item) => {

            if (item.links) {
                return {
                    ...item,
                    links: item.links.filter((subItem: any) =>
                        subItem?.role ? subItem?.role?.includes(user?.role || "ROLE_USER") : true
                    ),
                };
            }
            return item;
        });


    return (
        <AppShell
            header={{ height: 50 }}
            footer={{ height: 60 }}
            offsetScrollbars={false}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            aside={{ width: componentActive == "CHAT" ? 200 : 110, breakpoint: 'sm', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            <AppShell.Header>
                <Header
                    mobileBurger={
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="sm"
                            size="md"
                            mr="xl"
                        />
                    }
                    desktopBurger={
                        <Burger
                            opened={desktopOpened}
                            onClick={toggleDesktop}
                            visibleFrom="sm"
                            size="md"
                            mr="xl"
                        />
                    }
                />
            </AppShell.Header>
            <AppShell.Navbar>
                <Navigation data={filteredNavLinks} hidden={!mobileOpened || !desktopOpened} />
            </AppShell.Navbar>
            <AppShell.Main >
                <MainDashboard />
            </AppShell.Main >
            <AppShell.Aside p="md">
                <UserList user={user || null} />
            </AppShell.Aside>
            <AppShell.Footer p="md">Footer</AppShell.Footer>
        </AppShell>
    );
}