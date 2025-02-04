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
    const [user, setUser] = useState<any>(undefined)
    const [joinRoom, setJoinRoom] = useState<boolean>(false)

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (value) {
            const userDecode = deCodeJwt(value)
            if (userDecode.id && joinRoom == false) {
                setUser(userDecode)
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
        const client = new CustomWebSocket(`/chats/joinRoom/1?userId=${user?.id}`);
        client.connect(
            (data: any) => {
                try {
                    const returnData = decodeMessage(data);
                    console.log(returnData)
                    setMessages((prevMessages: any) => [
                        ...prevMessages,
                        returnData[returnData.length - 1],
                    ]);
                } catch (e: any) {
                    console.log(e.message)
                }
                // const returnData = decodeMessage(data);

                // setMessages((prevMessages: any) => [
                //     ...prevMessages,
                //     returnData[returnData.length - 1],
                // ]);
            },
            (error: any) => {
                console.error("WebSocket error:", error);
            }
        );
        // client.close((data) =>{
        //     console.log(data)
        // })

        setWebSocketClient(client);
        setJoinRoom(true)
        return () => {
            client.close();
        };
    }

    const handleChat = async () => {
        const data = await mutate.mutateAsync().then((data) => data)
    }
    const sendMessage = (message: any) => {
        if (webSocketClient) {
            webSocketClient.send(JSON.stringify(message));
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
                                alignSelf: message?.role === user?.id ? "flex-end" : "flex-start",
                                maxWidth: "70%",
                            }}
                            c={message?.role === user?.id ? "var(--mantine-primary-color-contrast)" : "var(--mantine-color-text)"}
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