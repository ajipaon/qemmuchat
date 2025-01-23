import React, { useState } from 'react';
import { Button, Group, Modal, MultiSelect, useModalsStack } from '@mantine/core';
import { useOrganizationsStore } from '../../config/globalStore/organizatonsData';
import { useAddUserOrganization } from './query';

interface modalAddprops {
    openModalOrg: any;
    setOpenModalOrg: any;
    userId: string | null;
}

export default function ModalAddOrganization({ openModalOrg, setOpenModalOrg, userId }: modalAddprops) {

    const stack = useModalsStack(['select-org', 'confirm-action']);
    const [value, setValue] = useState<any>([]);
    const [selectValue, setSelectValue] = useState<any>([]);
    const { data } = useOrganizationsStore()
    const mutate = useAddUserOrganization()


    React.useEffect(() => {
        if (openModalOrg) {
            stack.open('select-org');
            const newData = data.map(item => ({ value: item.ID, label: item.name }));
            setValue(newData)
        }
    }, [openModalOrg]);

    const handleCloseAction = () => {
        setOpenModalOrg(false)
        stack.closeAll()
    }
    const handleConfirmAction = () => {
        if (selectValue.length == 0) return
        selectValue.forEach(async (id: string) => {
            await mutate.mutateAsync(userId + "@" + id);

        });

        setOpenModalOrg(false)
        stack.closeAll()
    }

    return (
        <>
            <Modal.Stack>
                <Modal {...stack.register('select-org')} title="add to Organization?">
                    <MultiSelect searchable data={value || []} value={selectValue} onChange={setSelectValue} />
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={handleCloseAction} variant="default">
                            Cancel
                        </Button>
                        <Button onClick={() => stack.open('confirm-action')} color="cyan">
                            Add
                        </Button>
                    </Group>
                </Modal>

                <Modal {...stack.register('confirm-action')} title="Confirm action">
                    Are you sure want to add this user to selected organization?
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={handleCloseAction} variant="default">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            handleConfirmAction()
                        }} color="orange">
                            Confirm
                        </Button>
                    </Group>
                </Modal>
            </Modal.Stack >

        </>
    );
}