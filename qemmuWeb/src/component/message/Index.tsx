import { Container, RemoveScroll } from '@mantine/core';
import Chat from './Chat';

export default function MainChat() {

    return (
        <Container style={{ maxHeight: '100%', padding: '0px', width: '100%', margin: 0 }}>
            <RemoveScroll>
                <Chat />
            </RemoveScroll>
        </Container>
    );
};