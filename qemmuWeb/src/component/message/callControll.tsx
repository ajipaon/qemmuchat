import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Repeat } from "lucide-react";
import { useState } from "react";

// interface CallControlsProps {
//     userStream: React.MutableRefObject<MediaStream | null>;
//     onEndCall: () => void;
// }

export default function CallControls() {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const toggleMute = () => {
        // if (userStream?.current) {
        //     userStream.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
        //     setIsMuted(!isMuted);
        // }
    };
    const onEndCall = () => {
        // if (userStream?.current) {
        //     userStream.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
        //     setIsVideoOff(!isVideoOff);
        // }
    };

    const toggleVideo = () => {
        // if (userStream?.current) {
        //     userStream.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
        //     setIsVideoOff(!isVideoOff);
        // }
    };

    return (
        <Group
            style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(133, 133, 133, 0)",
                padding: "10px 15px",
                borderRadius: "30px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
            }}
        >
            {/* Mute / Unmute */}
            <Tooltip label={isMuted ? "Unmute" : "Mute"} position="top">
                <ActionIcon size="xl" color={isMuted ? "red" : "blue"} variant="light" onClick={toggleMute}>
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </ActionIcon>
            </Tooltip>

            {/* Video On / Off */}
            <Tooltip label={isVideoOff ? "Turn On Camera" : "Turn Off Camera"} position="top">
                <ActionIcon size="xl" color={isVideoOff ? "red" : "green"} variant="light" onClick={toggleVideo}>
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </ActionIcon>
            </Tooltip>

            {/* Switch Camera (Opsional, jika di mobile) */}
            <Tooltip label="Switch Camera" position="top">
                <ActionIcon size="xl" color="yellow" variant="light" onClick={() => alert("Switch Camera")}>
                    <Repeat size={20} />
                </ActionIcon>
            </Tooltip>

            {/* End Call */}
            <Tooltip label="End Call" position="top">
                <ActionIcon size="xl" color="red" variant="filled" onClick={onEndCall}>
                    <PhoneOff size={20} />
                </ActionIcon>
            </Tooltip>
        </Group>
    );
}
