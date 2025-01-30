import { Avatar, Group, ScrollArea, Text } from "@mantine/core";
import { useGetUserByOrganization } from "./query";
import { useEffect } from "react";
import { deCodeJwt } from "../../config/jwtClient";
import { useLocalStorage } from "@mantine/hooks";

const users = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
}));

interface userListPorps {
    user?: any
}

export default function UserList({ user }: userListPorps) {

    const { data, isLoading, hasNextPage, fetchNextPage } = useGetUserByOrganization(user?.last_organization || null) as any

    if (isLoading == true) {
        return <></>
    }

    return (
        <ScrollArea style={{ height: '100vh' }}>
            {data?.pages?.flatMap((page: any) => page.data).map((user: any) => (
                <Group component="button" key={user?.id} align="center" mb="sm" style={{ backgroundColor: "transparent" }}>
                    <Avatar src={user?.image} size={40} radius="xl" />
                    <Text size="sm">{user?.name}</Text>
                </Group>
            ))}
        </ScrollArea>
    )
}