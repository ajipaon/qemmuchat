import { useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, Video, VideoOff, Phone, MessageSquare,
    Users, MoreVertical, Monitor, Hand
} from 'lucide-react';
import { Button, Modal, Avatar, Badge, Group, Text } from '@mantine/core';

const users = [
    { id: 1, name: 'John Smith', initials: 'JS' },
    { id: 2, name: 'Emily Brown', initials: 'EB' },
    { id: 3, name: 'Michael Davis', initials: 'MD' },
    { id: 4, name: 'Sarah Wilson', initials: 'SW' },
    { id: 5, name: 'Alex Johnson', initials: 'AJ' },
];

const MeetingRoom = () => {
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [participantsOpen, setParticipantsOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [screenSharing, setScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const screenRef = useRef<HTMLVideoElement | null>(null);


    useEffect(() => {
        if (camOn) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
                .then((newStream) => {
                    setStream(newStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = newStream;
                    }
                })
                .catch((error) => console.error("Error accessing camera:", error));
        } else {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    }, [camOn]);

    useEffect(() => {
        if (stream) {
            stream.getAudioTracks().forEach(track => (track.enabled = micOn));
        }
    }, [micOn]);

    const handleScreenShare = async () => {
        if (!screenSharing) {
            navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "browser",
                }, audio: false
            }).then((newDisplayStream) => {
                setScreenStream(newDisplayStream);
                // console.log(screenStreams.getVideoTracks()[0])
                setScreenSharing(true);
                if (screenRef.current) {
                    screenRef.current.srcObject = newDisplayStream;
                }
                newDisplayStream.getVideoTracks()[0].onended = () => {
                    setScreenSharing(false);
                    setScreenStream(null);
                };

            }).catch((error) => console.error("Error accessing camera:", error));

        } else {
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
                setScreenStream(null);
            }
            setScreenSharing(false);
        }
    };


    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1A1B1E' }}>
            <div
                style={{
                    flex: 1,
                    paddingBlockStart: '10px',
                    paddingBottom: '5px',
                    display: 'flex',
                    gap: '7px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingInline: '10px',
                }}
            >
                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            position: 'relative',
                            background: '#25262B',
                            borderRadius: '8px',
                            padding: camOn ? "1px" : "10px",
                            textAlign: 'center',
                            minWidth: '150px',
                            height: '15vh',
                            overflow: 'hidden'
                        }}
                    >
                        {user.id === 1 && camOn ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                }}
                            />
                        ) : (
                            <Avatar radius="xl" size="sm" color="blue">{user.initials}</Avatar>
                        )}
                        {user.id === 1 && camOn && (
                            <Avatar
                                radius="xl"
                                size="sm"
                                color="blue"
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    backgroundColor: "rgba(134, 144, 247, 0.5)"
                                }}
                            >
                                {user.initials}
                            </Avatar>
                        )}

                        <Text size="sm" mt={10}>{user.name}</Text>
                        {!micOn && <MicOff size={16} color="red" style={{ position: 'absolute', bottom: 10, right: 10 }} />}
                    </div>
                ))}
            </div>

            {screenSharing && (
                <div style={{ flex: 1, textAlign: 'center', marginBottom: '5px' }}>
                    <video ref={screenRef} autoPlay muted playsInline style={{ width: 'calc(100vh - 40px)', borderRadius: '8px', border: '2px solid white' }} />
                </div>
            )}

            {/* KONTROL */}
            <Group
                px="md"
                py="sm"
                justify="space-between"
                style={{
                    background: '#2C2E33',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <Group>
                    <Button variant={micOn ? 'filled' : 'outline'} color={micOn ? 'blue' : 'red'} onClick={() => setMicOn(!micOn)}>
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </Button>
                    <Button variant={camOn ? 'filled' : 'outline'} color={camOn ? 'blue' : 'red'} onClick={() => setCamOn(!camOn)}>
                        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </Button>
                    <Button variant="subtle" color="gray"><Hand size={20} /></Button>
                    {/* <Button variant="subtle" color="gray"><Monitor size={20} /></Button> */}
                    <Button variant={screenSharing ? 'filled' : 'outline'} color={screenSharing ? 'blue' : 'gray'} onClick={handleScreenShare}>
                        <Monitor size={20} />
                    </Button>
                    <Button variant="subtle" color="gray"><MoreVertical size={20} /></Button>
                    <Button variant="filled" color="red" onClick={() => alert('Meeting ended')}><Phone size={20} /></Button>
                </Group>

                <Group>
                    <Button variant="subtle" color="gray" onClick={() => setParticipantsOpen(true)}><Users size={20} /></Button>
                    <Button variant="subtle" color="gray" onClick={() => setChatOpen(true)}><MessageSquare size={20} /></Button>
                </Group>
            </Group>

            {/* Chat Modal */}
            <Modal opened={chatOpen} onClose={() => setChatOpen(false)} title="Meeting Chat" centered>
                <Text size="sm" color="gray">Chat messages will appear here...</Text>
            </Modal>

            {/* Participants Modal */}
            <Modal opened={participantsOpen} onClose={() => setParticipantsOpen(false)} title={`Participants (${users.length})`} centered>
                {users.map((user) => (
                    <Group key={user.id} mt="sm">
                        <Avatar radius="xl" color="blue">{user.initials}</Avatar>
                        <Text>{user.name}</Text>
                        <Badge color="gray">Host</Badge>
                    </Group>
                ))}
            </Modal>
        </div>
    );
};

export default MeetingRoom;
