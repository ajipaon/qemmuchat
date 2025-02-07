import { Card, Text, TextInput, Button, Group, Avatar, rem, Space, Stack, Box } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { IoMdPaperPlane } from "react-icons/io";
// import { useGetRoom } from './query';
import CustomWebSocket from '../../config/customWebSocket';
import { ulid } from "ulid";
import { useSelectUserChatStore } from '../../config/globalStore/selectuser';
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";


export default function Chat() {

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

    const { data } = useSelectUserChatStore()

    useEffect(() => {
        if (data && userJson != null) {
            if (userJson?.id) {
                requestWebsocket()
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
                    handleStatusUpdate(data)
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
            message.role = userJson?.id
            message.room_id = data?.id
            webSocketClient.send(JSON.stringify(message));
            setMessages((prevMessages: any) => [
                ...prevMessages,
                message,
            ]);

        }
    };

    const handleStatusUpdate = (newMessage: any) => {
        setMessages((prevMessages: any[]) => {
            const updatedMessages = prevMessages.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: newMessage.status } : msg
            );

            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage?.status === 'RECEIVED') {
                return updatedMessages.map((msg, index) =>
                    index < updatedMessages.length - 1 ? { ...msg, status: 'RECEIVED' } : msg
                );
            }

            return updatedMessages;
        });
    };

    return (
        <Card style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
            <Group align="center" justify="space-between">
                <Group>
                    <Avatar src="https://ui.shadcn.com/avatars/02.png" alt="Sofia Davis" radius="xl" />
                    <div>
                        <Text fw={500} size="sm">Sofia Davis</Text>
                        <Text size="xs" >m@example.com</Text>
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
                                backgroundColor: message?.status === "READ" ? "var(--mantine-color-blue-1)" : "transparent",
                            }}
                            c={message?.role === userJson?.id ? "var(--mantine-primary-color-contrast)" : "var(--mantine-color-text)"}
                            withBorder={false}
                            shadow="none"
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    {message?.status === "SENT" && (
                                        <IoCheckmark size={16} color="gray" />
                                    )}
                                    {message?.status === "RECEIVED" && (
                                        <IoCheckmarkDone size={16} color="gray" />
                                    )}
                                    {message?.status === "READ" && (
                                        <IoCheckmarkDone size={16} color="var(--mantine-color-blue-6)" />
                                    )}
                                </Box>
                                <Text size="sm">{message?.content}</Text>
                            </div>
                        </Card>
                    ))}
                    <div ref={messagesEndRef} />
                </Stack>
            </div>

            {/* Input Form */}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (inputLength === 0) return;
                    sendMessage(
                        {
                            id: ulid(),
                            role: data?.id,
                            content: input,
                            status: "SENT"
                        },
                    );
                    setInput("");
                }}
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