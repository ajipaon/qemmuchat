import { Container, Grid, SimpleGrid, Card, Text, Title } from '@mantine/core';
import {activeComponent} from "@/component/dasbobard/store/data.ts";
import Admin from "@/component/person/Admin.tsx";
import User from "@/component/person/User.tsx";
import MainChat from "@/component/message/Index.tsx";

const PRIMARY_COL_HEIGHT = '300px';
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / )`;

const statistics = [
    { title: 'Total Users', value: 1200 },
    { title: 'New Users Today', value: 50 },
    { title: 'Total Sales', value: '$24,000' },
    { title: 'Active Subscriptions', value: 300 },
];

export default function MainDashboard() {
    const {componentActive} = activeComponent()

    return (
        componentActive == "DASHBOARD" ? (
        <Container style={{ padding: '0px', width:'100%', margin:0 }}>
            <SimpleGrid cols={2} spacing="md" >
                <Card shadow="sm" padding="lg" radius="lg" style={{ height: PRIMARY_COL_HEIGHT }}>
                    <Title order={2}>{statistics[0].title}</Title>
                    <Text size="xl">{statistics[0].value}</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="lg" style={{ height: PRIMARY_COL_HEIGHT }}>
                    <Title order={2}>{statistics[0].title}</Title>
                    <Text size="xl">{statistics[0].value}</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="lg" style={{ height: PRIMARY_COL_HEIGHT }}>
                    <Title order={2}>{statistics[0].title}</Title>
                    <Text size="xl">{statistics[0].value}</Text>
                </Card>

                <Grid gutter="md">
                    <Grid.Col>
                        <Card shadow="sm" padding="lg" radius="md" style={{ height: SECONDARY_COL_HEIGHT }}>
                            <Title order={2}>{statistics[1].title}</Title>
                            <Text size="xl">{statistics[1].value}</Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Card shadow="sm" padding="lg" radius="md" style={{ height: SECONDARY_COL_HEIGHT }}>
                            <Title order={2}>{statistics[2].title}</Title>
                            <Text size="xl">{statistics[2].value}</Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Card shadow="sm" padding="lg" radius="md" style={{ height: SECONDARY_COL_HEIGHT }}>
                            <Title order={2}>{statistics[3].title}</Title>
                            <Text size="xl">{statistics[3].value}</Text>
                        </Card>
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
        </Container>
        ):(
            <>
                <Admin activeComponent={componentActive}/>
                <User activeComponent={componentActive}/>
                <MainChat activeComponent={componentActive}/>
            </>
        )
    );
}