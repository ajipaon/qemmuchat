import { Container } from '@mantine/core';
import Chat from './Chat';

export default function MainChat() {

    return (
        <Container style={{ maxHeightt: "100vh", padding: '0px', width: '100%', margin: 0 }}>
            <Chat />
        </Container>
    );
};