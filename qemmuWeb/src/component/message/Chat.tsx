import { Card, Text, TextInput, Button, Group, Avatar, rem, Space, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react';
import { IoMdPaperPlane } from "react-icons/io";
import { useGetRoom } from './query';
import CustomWebSocket from '../../config/customWebSocket';
import { deCodeJwt } from '../../config/jwtClient';
import { decodeMessage } from '../../module/decodeMessage';


export default function Chat() {

    const mutate = useGetRoom()
    const [value] = useLocalStorage<string>({
        key: "token",

    });
    // const [messages, setMessages] = useState([
    //     {
    //         role: "agent",
    //         content: "Hi, how can I help you today?",
    //     },
    // ]);

    const [input, setInput] = useState("");
    const inputLength = input.trim().length;
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [webSocketClient, setWebSocketClient] = useState<CustomWebSocket | null>(null);
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("")
    const [joinRoom, setJoinRoom] = useState<boolean>(false)

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (value) {
            const user = deCodeJwt(value)
            if (user.id && joinRoom == false) {
                handleChat()
                setTimeout(() => {
                    console.log("memuat koneksi baru");
                    requestWebsocket()
                }, 2000);

            }


        }

    }, [value, joinRoom]);

    const requestWebsocket = () => {
        const user = deCodeJwt(value)
        const client = new CustomWebSocket(`/chats/joinRoom/1?userId=${user?.id}`, {
            Authorization: `Bearer ${value}`,
        });
        client.connect(
            (data: any) => {
                const returnData = decodeMessage(data)
                console.log(returnData)
                setMessages((prevMessages: any) => [...prevMessages, returnData]);
            },
            (error: any) => {
                console.error("WebSocket error:", error);
            },
        );

        setWebSocketClient(client);
        setJoinRoom(true)
        return () => {
            client.close();
        };
    }

    const handleChat = async () => {
        const data = await mutate.mutateAsync().then((data) => data)
        console.log(data)
    }
    const sendMessage = (message: any) => {
        if (webSocketClient) {
            const s = { "role": "agent", "content": "ssdfsdfsdf" }
            webSocketClient.send(JSON.stringify(s));
            setInputMessage("");
        }
    };



    return (
        <Card style={{ height: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Group align="center" justify="space-between">
                <Group>
                    <Avatar src="https://ui.shadcn.com/avatars/02.png" alt="Sofia Davis" radius="xl" />
                    <div>
                        <Text fw={500} size="sm">
                            Sofia Davis
                        </Text>
                        <Text size="xs" color="dimmed">
                            m@example.com
                        </Text>
                    </div>
                </Group>
            </Group>

            <Space my="sm" />

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", maxHeight: "60vh" }}>
                <Stack gap="md">
                    {messages.map((message: { role: string; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                        <Card
                            p="xs"
                            key={index}
                            style={{
                                alignSelf: message?.role === "user" ? "flex-end" : "flex-start",
                                maxWidth: "70%",
                            }}
                            c={message?.role === "user" ? "var(--mantine-primary-color-contrast)" : "var(--mantine-color-text)"}
                            withBorder={false}
                            shadow="none"
                        >
                            <Text size="sm">{message?.content}</Text>
                        </Card>
                    ))}
                </Stack>
                <div ref={messagesEndRef} />
            </div>

            <Space my="sm" />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (inputLength === 0) return;
                    // setMessages([
                    //     ...messages,
                    //     {
                    //         role: "user",
                    //         content: input,
                    //     },
                    // ]);
                    sendMessage([
                        ...messages,
                        {
                            role: "user",
                            content: input,
                        },
                    ])
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