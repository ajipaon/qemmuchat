import { Avatar, Group, ScrollArea, Text } from "@mantine/core";

const users = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
}));


export default function UserList() {

    return (
        <ScrollArea style={{ height: '80vh' }}>
            {users.map((user) => (
                <Group key={user.id} align="center" mb="sm">
                    <Avatar src={user.avatar} size={40} radius="xl" />
                    <Text size="sm">{user.name}</Text>
                </Group>
            ))}
        </ScrollArea>
    )
}