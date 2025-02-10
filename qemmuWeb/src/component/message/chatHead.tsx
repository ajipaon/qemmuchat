import { Avatar, ActionIcon, Text, Group } from "@mantine/core";
import { Phone, Video } from "lucide-react";

interface ChatheadProps {

    data: any;
    userStream: any;
    userVideo: any;
    setOnCall: any;
    style?: React.CSSProperties;
}

// interface ChatheadProps {
//     data: any;
//     userStream: React.MutableRefObject<MediaStream | null>;
//     userVideo: React.MutableRefObject<HTMLVideoElement | null>;
//     setOnCall: any;
//     style?: React.CSSProperties;
// }

export default function Chathead({ data, userStream, userVideo, setOnCall, style }: ChatheadProps) {

    const onCall = (video: boolean, audio: boolean) => {
        navigator.mediaDevices.getUserMedia({
            video: video,
            audio: audio,

        }).then((stream) => {
            if (userVideo?.current) {

                userVideo.current.srcObject = stream
                setOnCall(true)
            }
            if (userStream?.current) {
                userStream.current = stream
                setOnCall(true)
            }

        }).catch((e) => {
            console.log(e)
        })
    };

    return (
        <Group align="center" justify="space-between" p="md" style={{ ...style, border: 'white 1px solid' }}>
            <Group>
                <Avatar src="https://ui.shadcn.com/avatars/02.png" alt="Sofia Davis" radius="xl" />
                <div>
                    <Text fw={500} size="sm">{data?.name || ''}</Text>
                    <Text size="xs">{data?.email || ''}</Text>
                </div>
            </Group>
            <Group>
                <ActionIcon variant="light" color="blue" onClick={() => onCall(false, true)}>
                    <Phone size={18} />
                </ActionIcon>
                <ActionIcon variant="light" color="green" onClick={() => onCall(true, true)}>
                    <Video size={18} />
                </ActionIcon>
            </Group>
        </Group>
    )
}