import { AppShell, Burger, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { FaReact } from "react-icons/fa6";
import { navLinks } from "@/component/navigation/config";
import { Navigation } from "@/component/navigation/Navigation.tsx";
import MainDashboard from "@/component/dasbobard/Main.tsx";
import Header from '../header/Header';

export default function Index() {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            layout="alt"
            header={{ height: 60 }}
            footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            aside={{ width: 100, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
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
                {/* <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <FaReact size={30} />
                </Group> */}

            </AppShell.Header>
            <AppShell.Navbar mt="80px" pl="md" pr="md" pb="xl">
                <Navigation data={navLinks} hidden={!opened} />
            </AppShell.Navbar>
            <AppShell.Main >
                <MainDashboard />
            </AppShell.Main>
            <AppShell.Aside p="md">Users</AppShell.Aside>
        </AppShell>
    );
}