import { Container } from '@mantine/core';
import { ActiveComponentType } from '../../types/mainType';
import Chat from './Chat';

interface IndexChatPrps {
    activeComponent: ActiveComponentType;
}

export default function MainChat({ activeComponent }: IndexChatPrps) {

    return activeComponent == "CHAT" && (
        <Container style={{ height: '80vh', padding: '0px', width: '100%', margin: 0 }}>
            <Chat selectedUserId={1} />
        </Container>
    );
};