import { Avatar, Group, ScrollArea, Text } from "@mantine/core";
import { useGetUserByOrganization } from "./query";
import { useSelectUserChatStore } from "../../config/globalStore/selectuser";
import { useLocalStorage } from "@mantine/hooks";

// const users = Array.from({ length: 50 }, (_, index) => ({
//     id: index + 1,
//     name: `User ${index + 1}`,
//     avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
// }));

interface userListPorps {
    user?: any
}

export default function UserList({ user }: userListPorps) {

    const [userJson] = useLocalStorage<string>({
        key: "user",

    }) as any
    const { data, isLoading } = useGetUserByOrganization(user?.last_organization || null) as any
    const { setData } = useSelectUserChatStore()

    if (isLoading == true) {
        return <></>
    }

    return (
        <ScrollArea style={{ height: '100vh' }}>
            {data?.pages?.flatMap((page: any) => page.data).map((user: any) => (
                <Group key={user?.id} align="start" mb="sm" style={{ backgroundColor: "transparent" }}>
                    <Avatar component="button" src={user?.image} size={30} onClick={() => {
                        setData(user)
                    }} />
                    <Text size="sm">{user?.name}</Text>
                </Group>
            ))}
        </ScrollArea>
    )
}