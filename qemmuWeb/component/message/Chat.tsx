import { Card, Text, TextInput, Button, Group } from '@mantine/core';

const messages = [
    { id: 1, userId: 1, text: 'Hello there!' },
    { id: 2, userId: 2, text: 'Hi, how are you?' },
];

interface ChatPros {
    selectedUserId: any;
}


export default function Chat({ selectedUserId }: ChatPros) {
    const userMessages = messages.filter((message) => message.userId === selectedUserId);

    return (
        <Card withBorder shadow="sm" radius="md" style={{ height: '100%', width:'100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {userMessages.map((message) => (
                    <Text key={message.id} style={{ marginBottom: '5px' }}>
                        {message.text}
                    </Text>
                ))}
            </div>
            <Group>
                <TextInput placeholder="Type your message" style={{ flex: 1 }} />
                <Button>Send</Button>
            </Group>
        </Card>
    );
};