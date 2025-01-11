import { AppShell, Burger, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { navLinks } from "@/component/navigation/config";
// import { Navigation } from "@/component/navigation/Navigation.tsx";
// import MainDashboard from "@/component/dasbobard/Main.tsx";
import Header from '../header/Header';
import { activeComponent } from './store/data';
import { navLinks } from '../navigation/config';
import { Navigation } from '../navigation/Navigation';
import UserList from '../person/UserList';
import MainDashboard from './Main';
// import UserList from "@/component/person/UserList.tsx";
// import {activeComponent} from "@/component/dasbobard/store/data.ts";

export default function Index() {
    const [opened, { toggle }] = useDisclosure();
    const { componentActive } = activeComponent()
    return (
        <AppShell
            layout="alt"
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
            <AppShell.Navbar mt="80px" pl="md" pr="md" pb="xl">
                <Navigation data={navLinks} hidden={!opened} />
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