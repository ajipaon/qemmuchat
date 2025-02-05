import { Card, Text, TextInput, Button, Group, Avatar, rem, Space, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { IoMdPaperPlane } from "react-icons/io";
// import { useGetRoom } from './query';
import CustomWebSocket from '../../config/customWebSocket';
import { decodeMessage } from '../../module/decodeMessage';
import { useSelectUserChatStore } from '../../config/globalStore/selectuser';


export default function Chat() {

    // const mutate = useGetRoom()
    // const [value] = useLocalStorage<string>({
    //     key: "token",

    // });
    // const [messages, setMessages] = useState([
    //     {
    //         role: "agent",
    //         content: "Hi, how can I help you today?",
    //     },
    // ]);
    const [userJson] = useLocalStorage<string>({
        key: "user",

    }) as any
    const [input, setInput] = useState("");
    const inputLength = input.trim().length;
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [webSocketClient, setWebSocketClient] = useState<CustomWebSocket | null>(null);
    const [messages, setMessages] = useState<any>([]);
    const [user, setUser] = useState<any>(undefined)

    const { data } = useSelectUserChatStore()


    useEffect(() => {
        if (data && userJson != null) {
            if (userJson?.id) {
                // setTimeout(() => {
                requestWebsocket()
                // }, 2000);

            }
        }

    }, [data, userJson])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const requestWebsocket = () => {
        if (!userJson.id) return
        const client = new CustomWebSocket(`/chats/joinRoom/${userJson?.id}?targetId=${userJson?.id}&type=PRIVATE`);
        client.connect(
            (data: any) => {

                try {

                    setMessages((prevMessages: any) => [
                        ...prevMessages,
                        data,
                    ]);
                } catch (e: any) {
                    console.log(e.message)
                }
            },
            (error: any) => {
                console.error("WebSocket error:", error);
            }
        );
        setWebSocketClient(client);
        return () => {
            client.close();
        };
    }

    const sendMessage = (message: any) => {
        if (webSocketClient) {
            const sas: any = {
                roomId: data?.id,
                content: "Hi, how can I help you today?",
            }
            webSocketClient.send(JSON.stringify(sas));
            sas.role = userJson?.id
            setMessages((prevMessages: any) => [
                ...prevMessages,
                sas,
            ]);

        }
    };

    return (
        <Card style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
            <Group align="center" justify="space-between">
                <Group>
                    <Avatar src="https://ui.shadcn.com/avatars/02.png" alt="Sofia Davis" radius="xl" />
                    <div>
                        <Text fw={500} size="sm">Sofia Davis</Text>
                        <Text size="xs" color="dimmed">m@example.com</Text>
                    </div>
                </Group>
            </Group>

            <Space my="sm" />

            <div style={{ flex: 1, overflowX: "auto", display: "flex", flexDirection: "column-reverse" }}>
                <Stack gap="md">
                    {messages.map((message: any, index: number) => (
                        <Card
                            p="xs"
                            key={index}
                            style={{
                                alignSelf: message?.role === userJson?.id ? "flex-end" : "flex-start",
                                maxWidth: "70%",
                            }}
                            c={message?.role === userJson?.id ? "var(--mantine-primary-color-contrast)" : "var(--mantine-color-text)"}
                            withBorder={false}
                            shadow="none"
                        >
                            <Text size="sm">{message?.content}</Text>
                        </Card>
                    ))}
                </Stack>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (inputLength === 0) return;
                    sendMessage([
                        ...messages,
                        {
                            role: user?.id,
                            content: input,
                        },
                    ]);
                    setInput("");
                }}
            // style={{ padding: "16px", backgroundColor: "white", borderTop: "1px solid #e0e0e0" }}
            >
                <Group>
                    <TextInput
                        value={input}
                        onChange={(event) => setInput(event.currentTarget.value)}
                        placeholder="Type your message..."
                        style={{ flex: 1 }}
                    />
                    <Button type="submit" variant="primary" disabled={inputLength === 0} p={"xs"}>
                        <IoMdPaperPlane width={rem(16)} />
                    </Button>
                </Group>
            </form>
        </Card>
    );
}