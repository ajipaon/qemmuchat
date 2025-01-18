/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Group, Modal, TextInput, } from '@mantine/core';
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { newOrganizationModal } from './type';
import { useNewOrganization } from './query';

export default function ModalNewOrganization() {
    const { isOpen, onClose } = newOrganizationModal()
    const [name, setName] = useState<string>("")
    const mutateNewOrganization = useNewOrganization()

    const handleCreateOrganization = () => {

        if (name) {
            mutateNewOrganization.mutateAsync({ name }).then((data: any) => {
                notifications.show({
                    color: 'teal',
                    message: data?.message || "success create Organization",
                    autoClose: 3000,
                });
                onClose()
            })
        }
    }


    return (
        <>
            <Modal
                opened={isOpen}
                onClose={onClose}
                title="Create organzation"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <TextInput
                    data-autofocus
                    label="Input name Organization"
                    placeholder="Qemmu chat"
                    value={name}
                    mt="md"
                    onChange={(e: any) => setName(e.target.value)}
                />
                <Group mt="lg" justify="flex-end">
                    <Button onClick={onClose} variant="default">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateOrganization} color="cyan">
                        Create
                    </Button>
                </Group>
            </Modal>
        </>
    );
}