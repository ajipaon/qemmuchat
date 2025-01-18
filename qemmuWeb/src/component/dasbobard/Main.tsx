import { Container, Grid, SimpleGrid, Card, Text, Title } from '@mantine/core';
import { activeComponent } from './store/data';
import Organization from '../organization/Organization';
import Admin from '../person/Admin';
import User from '../person/User';
import MainChat from '../message/Index';
import { useLocalStorage } from '@mantine/hooks';

const PRIMARY_COL_HEIGHT = '300px';
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / )`;

const statistics = [
    { title: 'Total Users', value: 1200 },
    { title: 'New Users Today', value: 50 },
    { title: 'Total Sales', value: '$24,000' },
    { title: 'Active Subscriptions', value: 300 },
];

export default function MainDashboard() {
    const { componentActive } = activeComponent()
    const [value] = useLocalStorage<string>({
        key: "user",

    }) as any

    if (componentActive === "DASHBOARD" && value?.role != 'ROLE_USER') {
        return (
            <Container style={{ padding: '0px', width: '100%', margin: 0 }}>
                <SimpleGrid cols={2} spacing="md">
                    {statistics.slice(0, 3).map((stat, index) => (
                        <Card key={index} shadow="sm" padding="lg" radius="lg" style={{ height: PRIMARY_COL_HEIGHT }}>
                            <Title order={2}>{stat.title}</Title>
                            <Text size="xl">{stat.value}</Text>
                        </Card>
                    ))}
                    <Grid gutter="md">
                        <Grid.Col>
                            <Card shadow="sm" padding="lg" radius="md" style={{ height: SECONDARY_COL_HEIGHT }}>
                                <Title order={2}>{statistics[1].title}</Title>
                                <Text size="xl">{statistics[1].value}</Text>
                            </Card>
                        </Grid.Col>
                        {[statistics[2], statistics[3]].map((stat, index) => (
                            <Grid.Col key={index} span={6}>
                                <Card shadow="sm" padding="lg" radius="md" style={{ height: SECONDARY_COL_HEIGHT }}>
                                    <Title order={2}>{stat.title}</Title>
                                    <Text size="xl">{stat.value}</Text>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </SimpleGrid>
            </Container>
        );
    }

    if (componentActive === "ORGANIZATION") {
        return <Organization activeComponent={componentActive} />;
    }

    if (componentActive === "ADMIN") {
        return <Admin activeComponent={componentActive} />;
    }

    if (componentActive === "USER") {
        return <User activeComponent={componentActive} />
    }

    if (componentActive === "CHAT") {
        return <MainChat activeComponent={componentActive} />
    }

}