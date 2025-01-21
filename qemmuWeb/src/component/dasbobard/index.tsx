import { AppShell, Burger, } from '@mantine/core';
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
    const [opened, { toggle }] = useDisclosure();
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
            header={{ height: 60 }}
            footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            aside={{ width: componentActive == "CHAT" ? 400 : 110, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            <AppShell.Header>
                <Header
                    burger={
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="md"
                            mr="xl"
                        />
                    }
                />
            </AppShell.Header>
            <AppShell.Navbar>
                <Navigation data={filteredNavLinks} hidden={!opened} />
            </AppShell.Navbar>
            <AppShell.Main >
                <MainDashboard />
            </AppShell.Main >
            <AppShell.Aside p="md">
                <UserList />
            </AppShell.Aside>
        </AppShell>
    );
}