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
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#1A1B1E',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    display: 'grid',
                    gap: '15px',
                    gridTemplateColumns: `repeat(auto-fit, minmax(${screenSharing ? '200px' : '300px'}, 1fr))`,
                    gridAutoRows: 'minmax(200px, auto)',
                    overflowY: 'auto',
                    alignItems: 'start'
                }}
            >
                {screenSharing && (
                    <div style={{
                        gridColumn: '1 / -1',
                        height: '60vh',
                        backgroundColor: '#25262B',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <video
                            ref={screenRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                )}

                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            position: 'relative',
                            background: '#25262B',
                            borderRadius: '12px',
                            height: screenSharing ? '200px' : '300px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px',
                            transition: 'all 0.3s ease'
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
                            <Avatar
                                radius="xl"
                                size={screenSharing ? "lg" : "xl"}
                                color="blue"
                                style={{
                                    marginBottom: '10px'
                                }}
                            >
                                {user.initials}
                            </Avatar>
                        )}

                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.7)',
                            padding: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text size="sm" color="white">{user.name}</Text>
                            {!micOn && <MicOff size={16} color="red" />}
                        </div>
                    </div>
                ))}
            </div>

            <Group
                px="xl"
                py="md"
                justify="space-between"
                style={{
                    background: 'rgba(44, 46, 51, 0.95)',
                    backdropFilter: 'blur(10px)',
                    position: 'sticky',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Group>
                    <Button
                        variant={micOn ? 'filled' : 'outline'}
                        color={micOn ? 'blue' : 'red'}
                        onClick={() => setMicOn(!micOn)}
                        radius="xl"
                        size="md"
                    >
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </Button>
                    <Button
                        variant={camOn ? 'filled' : 'outline'}
                        color={camOn ? 'blue' : 'red'}
                        onClick={() => setCamOn(!camOn)}
                        radius="xl"
                        size="md"
                    >
                        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </Button>
                    <Button variant="subtle" color="gray" radius="xl" size="md">
                        <Hand size={20} />
                    </Button>
                    <Button
                        variant={screenSharing ? 'filled' : 'outline'}
                        color={screenSharing ? 'blue' : 'gray'}
                        onClick={handleScreenShare}
                        radius="xl"
                        size="md"
                    >
                        <Monitor size={20} />
                    </Button>
                    <Button variant="subtle" color="gray" radius="xl" size="md">
                        <MoreVertical size={20} />
                    </Button>
                </Group>

                <Group>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => alert('Meeting ended')}
                        radius="xl"
                        size="md"
                    >
                        <Phone size={20} />
                    </Button>
                </Group>

                <Group>
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => setParticipantsOpen(true)}
                        radius="xl"
                        size="md"
                    >
                        <Users size={20} />
                    </Button>
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => setChatOpen(true)}
                        radius="xl"
                        size="md"
                    >
                        <MessageSquare size={20} />
                    </Button>
                </Group>
            </Group>

            <Modal
                opened={chatOpen}
                onClose={() => setChatOpen(false)}
                title="Meeting Chat"
                centered
                size="lg"
            >
                <Text size="sm" color="gray">Chat messages will appear here...</Text>
            </Modal>

            <Modal
                opened={participantsOpen}
                onClose={() => setParticipantsOpen(false)}
                title={`Participants (${users.length})`}
                centered
                size="md"
            >
                {users.map((user) => (
                    <Group key={user.id} mt="sm" p="sm" style={{ borderRadius: '8px', background: '#f1f3f5' }}>
                        <Avatar radius="xl" color="blue">{user.initials}</Avatar>
                        <div style={{ flex: 1 }}>
                            <Text size="sm" >{user.name}</Text>
                            <Badge color="gray" variant="light">Participant</Badge>
                        </div>
                        <Group>
                            <Button variant="subtle" size="xs"><MicOff size={16} /></Button>
                            <Button variant="subtle" size="xs"><VideoOff size={16} /></Button>
                        </Group>
                    </Group>
                ))}
            </Modal>
        </div>
    );
};

export default MeetingRoom;
