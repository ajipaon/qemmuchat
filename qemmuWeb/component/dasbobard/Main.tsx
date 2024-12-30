import { Container, Grid, SimpleGrid, Card, Text, Title } from '@mantine/core';

// Define a constant for the primary column height
const PRIMARY_COL_HEIGHT = '300px';

export default function MainDashboard() {
    // Calculate the height for the secondary columns
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 4)`;

    // Example statistics data
    const statistics = [
        { title: 'Total Users', value: 1200 },
        { title: 'New Users Today', value: 50 },
        { title: 'Total Sales', value: '$24,000' },
        { title: 'Active Subscriptions', value: 300 },
    ];

    return (
        <Container my="lg">
            <SimpleGrid cols={2} spacing="md" >
                {/* Primary column */}
                <Card shadow="sm" padding="lg" radius="md" style={{ height: PRIMARY_COL_HEIGHT }}>
                    <Title order={2}>{statistics[0].title}</Title>
                    <Text size="xl">{statistics[0].value}</Text>
                </Card>

                {/* Secondary columns */}
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
    );
}