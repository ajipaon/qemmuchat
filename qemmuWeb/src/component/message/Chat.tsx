import { Card, Text, TextInput, Button, Group, Avatar, Paper } from '@mantine/core';

const messages = [
    { id: 1, userId: 1, text: 'Hello there!' },
    { id: 2, userId: 2, text: 'Hi, how are you?' },
    { id: 3, userId: 1, text: 'Hi, how are you?' },
    { id: 4, userId: 2, text: 'Hi, how are you?' },
    { id: 5, userId: 1, text: 'Hi, how are you?' },
];

interface ChatPros {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedUserId: any;
}


export default function Chat({ selectedUserId }: ChatPros) {
    // const userMessages = messages.filter((message) => message.userId === selectedUserId);

    return (
        <Card withBorder shadow="sm" radius="md" style={{ height: '100%', width: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((message) => (
                    <Group
                        key={message.id}
                        style={{
                            marginBottom: '10px',
                            justifyContent: message.userId === selectedUserId ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {message.userId !== selectedUserId && (
                            <Avatar key={`avatar-${message.id}`} radius="xl" size="md" />
                        )}
                        <Paper
                            shadow="sm"
                            radius="md"
                            style={{
                                maxWidth: "50%",
                                backgroundColor: "#8b88882b",
                                paddingBlock: "1rem",
                                paddingInline: "2rem"
                            }}
                        >
                            <Text >{"message.name"}</Text>
                            <Text size="sm">{message.text}</Text>
                        </Paper>
                    </Group>
                ))}
            </div>
            <Group>
                <TextInput placeholder="Type your message" style={{ flex: 1 }} />
                <Button>Send</Button>
            </Group>
        </Card>
    );
};