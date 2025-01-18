/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Avatar, Text, Group } from '@mantine/core';

const users = [
    { id: 1, name: 'Alice', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Bob', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Charlie', avatar: 'https://via.placeholder.com/40' },
    { id: 4, name: 'wawa', avatar: 'https://via.placeholder.com/40' },
    { id: 5, name: 'jaja', avatar: 'https://via.placeholder.com/40' },
];
interface ChatListProps {
    onUserSelect: any;
};

export default function ChatList({ onUserSelect }: ChatListProps) {
    return (
        <div>
            {users.map((user) => (
                <Card key={user.id} onClick={() => onUserSelect(user.id)} withBorder shadow="sm" p="lg" radius="md" style={{ marginBottom: '10px', cursor: 'pointer' }}>
                    <Group>
                        <Avatar src={user.avatar} />
                        <Text>{user.name}</Text>
                    </Group>
                </Card>
            ))}
        </div>
    );
};