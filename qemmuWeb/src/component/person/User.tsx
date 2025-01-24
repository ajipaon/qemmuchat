import { DataTable } from 'mantine-datatable';
import { useGetAllUserSperAdmin, useUpdatePatchUser } from './query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Badge, Box, Button, Flex, Group, TextInput, Select, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import ModalAddOrganization from './ModalAddOrganization';
dayjs.extend(relativeTime);

export default function User() {

    const [search, setSearch] = useState({ name: "", email: "", role: "" })
    const [readySearch, setReadySearch] = useState({ name: "", email: "", role: "" })
    const [page, setPage] = useState(1);
    const { data, isLoading, hasNextPage, fetchNextPage } = useGetAllUserSperAdmin(readySearch) as any
    const mutateUpatepatch = useUpdatePatchUser()
    const [openModalOrg, setOpenModalOrg] = useState<boolean>()
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const handleChengePage = (p: any) => {

        if (p > page) {
            if (hasNextPage) {
                fetchNextPage()
                setPage(p)
            } else {
                if (data.pages[p - 1]) {
                    setPage(p)
                }

            }
        } else {
            setPage(p)
        }
    }

    const handleResetSearch = () => {
        setSearch({ name: "", email: "", role: "" })
        setReadySearch({ name: "", email: "", role: "" })
    }

    const handleUpdateSearch = (key: string, value: any) => {
        setSearch((prevSearch) => ({
            ...prevSearch,
            [key]: value,
        }));
    };

    if (isLoading) {
        return <></>
    }

    const openModalRole = (role: string, userId: string) => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                {`Are you sore want to change this user to ${role == "ROLE_USER" ? "USER" : "ADMIN"}`}
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            const data = {
                userId,
                section: "ROLE",
                data: {
                    name: "",
                    image: "",
                    status: "",
                    role: role,

                }
            }
            mutateUpatepatch.mutate(data)
        },
    });

    const openModalStatus = (status: string, userId: string) => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                {`Are you sUre want to change this user to ${status == "ACTIVE" ? "ENABLE" : "DISABLE"}`}
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            const data = {
                userId,
                section: "ROLE",
                data: {
                    name: "",
                    image: "",
                    status: status,
                    role: "",

                }
            }
            mutateUpatepatch.mutate(data)
        },
    });

    return (
        <>
            <Flex justify="end" align="ceter" gap="md" mb="10px">
                <TextInput value={search?.name || ""} placeholder="Search Name" type='text' onChange={(e) => handleUpdateSearch("name", e.target.value)} />
                <TextInput value={search?.email || ""} placeholder="Search Email" type='email' onChange={(e) => handleUpdateSearch("email", e.target.value)} />
                <Select
                    placeholder="select role"
                    defaultChecked={false}
                    value={search.role || ""}
                    onChange={(e: any) => handleUpdateSearch("role", e)}
                    data={['ROLE_USER', 'ROLE_ADMIN']}
                />
                <Button variant="filled" onClick={() => setReadySearch(search)}>Search</Button>
                <Button variant="filled" color='orange' onClick={handleResetSearch}>Reset</Button>
            </Flex>
            <DataTable
                height={500}
                withTableBorder
                withColumnBorders
                striped
                records={data?.pages[page - 1]?.data || []}
                rowColor={({ status }) => {
                    if (status != 'ACTIVE') return 'red';
                }}
                totalRecords={data?.pages[0].pages.total || 0}
                recordsPerPage={data?.pages[0].pages.limit || 5}
                page={page || 1}
                onPageChange={(p) => handleChengePage(p)}
                groups={[
                    {
                        id: 'Data',
                        style: { fontStyle: 'italic' },
                        columns: [
                            { accessor: 'name', textAlign: 'center' },
                            { accessor: 'email', textAlign: 'center' },
                            {
                                accessor: 'role', textAlign: 'center', visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                                render: (data) => (
                                    < Badge component="button" onClick={() => openModalRole(data.role != "ROLE_USER" ? "ROLE_USER" : "ROLE_ADMIN", data.id)} color={data.role == "ROLE_USER" ? "orange" : "cyan"} variant="filled" >
                                        {data.role == "ROLE_USER" ? "USER" : "ADMIN"}
                                    </Badge>

                                ),
                            },
                            {
                                accessor: 'actions',
                                title: <Box>Action</Box>,
                                textAlign: 'center',
                                render: (user) => (
                                    <Group gap={2} justify="right" wrap="nowrap">
                                        <Button variant="filled" size="xs" onClick={() => {
                                            setSelectedId(user?.id);
                                            setOpenModalOrg(true);
                                        }}>Promote team</Button>
                                        <Button variant="filled" ml="5" color="orange" size="xs" onClick={() => openModalStatus(user.status == "ACTIVE" ? "INACTIVE" : "ACTIVE", user.id)}>{user.status == "ACTIVE" ? "disable user" : "enable user"}</Button>
                                    </Group>
                                ),
                            },
                        ],
                    },

                    {
                        id: 'activity-info',
                        title: 'Activity',
                        textAlign: 'center',
                        style: (theme) => ({ color: theme.colors.blue[6] }),
                        columns: [
                            {
                                accessor: 'created_at',
                                title: 'Register',
                                render: ({ created_at }: any) => created_at ? dayjs(created_at).fromNow() : '-'
                            },
                            // for now last_activity_app disable
                            // {
                            //     accessor: 'activity.last_activity_app',
                            //     title: 'APP',
                            //     render: ({ activity }: any) =>
                            //         activity?.last_activity_app ? dayjs(activity.last_activity_app).fromNow() : '-'
                            // },
                            {
                                accessor: 'activity.last_activity_web',
                                title: 'WEB',
                                render: ({ activity }: any) =>
                                    activity?.last_activity_web ? dayjs(activity.last_activity_web).fromNow() : '-'
                            },
                            {
                                accessor: 'activity.last_activity_network',
                                title: 'Last Online',
                                render: ({ activity }: any) =>
                                    activity?.last_activity_network ? dayjs(activity.last_activity_network).fromNow() : '-'
                            },
                        ]
                    }

                ]}
            />
            <ModalAddOrganization openModalOrg={openModalOrg} setOpenModalOrg={setOpenModalOrg} userId={selectedId} />
        </>
    );

}