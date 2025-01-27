import { Button, Group, Modal, Select, useModalsStack } from "@mantine/core";
import React, { useState } from "react";
import { useUpdateRoleUserOrganization } from "./query";

interface modalChangeRoleProps {
    openModalChangeRoleOrg: any;
    setOpenModalChangeRoleOrg: any;
    dataUpdateRole: any;
}

export default function MOdalChangeRoleOrganization({ openModalChangeRoleOrg, setOpenModalChangeRoleOrg, dataUpdateRole }: modalChangeRoleProps) {


    const stack = useModalsStack(['select-role', 'confirm-action']);
    const [valueRole, setValueRole] = useState<any>("")
    const mutateChageRoleOrg = useUpdateRoleUserOrganization()

    React.useEffect(() => {
        if (openModalChangeRoleOrg) {
            stack.open('select-role');
            setValueRole("")
        }
    }, [openModalChangeRoleOrg]);

    const handleCloseAction = () => {
        setOpenModalChangeRoleOrg(false)
        stack.closeAll()
    }

    const handleConfirmAction = () => {
        const data = {
            orgId: dataUpdateRole.orgId,
            data: {
                role: valueRole,
                userId: dataUpdateRole.userId
            }
        }
        if (!valueRole || !dataUpdateRole.userId || !dataUpdateRole.orgId) return
        mutateChageRoleOrg.mutateAsync(data).then(() => {

            handleCloseAction()
        })

    }

    return (
        <>
            <Modal.Stack>
                <Modal {...stack.register('select-role')} title="add to Organization?">
                    <Select
                        value={valueRole}
                        onChange={setValueRole}
                        placeholder="Select Role"
                        data={['ADMIN', 'MODERATOR', 'USER', 'SPECTATOR']}
                    />
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