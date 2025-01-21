import { Modal } from "@mantine/core";


interface Props {
    opened?: any;
    close?: any;
}


export default function ModalNotification({ opened, close }: Props) {

    return (
        <Modal opened={opened} onClose={close} title="Notification"
            xOffset="20vw"
            yOffset="2vh"
            transitionProps={{ transition: 'rotate-left', enterDelay: 20 }}
        >
            dsdf
        </Modal>

    )
}
