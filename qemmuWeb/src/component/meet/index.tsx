import { Grid, Card, Text, Title, Container } from '@mantine/core';
import { Link } from 'react-router-dom';

const meetings = [
    { id: 1, title: 'Meeting Project A', time: '10:00 AM', participants: 5 },
    { id: 2, title: 'Brainstorming Session', time: '11:30 AM', participants: 8 },
    { id: 3, title: 'Client Review', time: '02:00 PM', participants: 3 },
    { id: 4, title: 'Team Sync', time: '04:00 PM', participants: 10 },
    { id: 5, title: 'Daily Standup', time: '09:00 AM', participants: 12 },
    { id: 6, title: 'Product Demo', time: '03:00 PM', participants: 7 },
];

export default function Index() {
    return (
        <Container>
            <Title mb="lg">Jadwal Meeting</Title>
            <Grid gutter="md" justify="center">
                {meetings.map((meeting, index) => (
                    <Grid.Col
                        key={meeting.id}
                        span={{ xs: 12, sm: 6, md: 3 }}
                        style={{ display: index >= 4 ? 'flex' : 'block' }}
                    >
                        <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <div>
                                <Title order={3} mb="sm">{meeting.title}</Title>
                                <Text size="sm" mb="xs">
                                    <strong>Waktu:</strong> {meeting.time}
                                </Text>
                                <Text size="sm" mb="md">
                                    <strong>Peserta:</strong> {meeting.participants} orang
                                </Text>
                            </div>
                            <Link
                                to={`/meet/${meeting.id}`}
                                target='_blank'
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '10px',
                                    backgroundColor: '#007bff',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                }}
                            // onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            // onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                            >
                                Join Meeting
                            </Link>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
}
