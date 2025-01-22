import { DataTable } from 'mantine-datatable';
import { useGetAllUserSperAdmin } from './query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Badge, Box, Button, Flex, Group, TextInput, Select } from '@mantine/core';
dayjs.extend(relativeTime);

export default function User() {

    const [search, setSearch] = useState({ name: "", email: "", role: "" })
    const [readySearch, setReadySearch] = useState({ name: "", email: "", role: "" })
    const [page, setPage] = useState(1);
    const { data, isLoading, hasNextPage, fetchNextPage } = useGetAllUserSperAdmin(readySearch) as any

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
                    if (status != 'ACTIVE') return 'violet';
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
                            { accessor: 'name' }, // <Avatar size={26} src={item.avatar} radius={26} />
                            { accessor: 'email' },
                            {
                                accessor: 'role', visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                                render: (data) => (
                                    < Badge component="button" onClick={() => console.log("dsfsf")} color={data.role == "ROLE_USER" ? "orange" : "cyan"} variant="filled" >
                                        {data.role == "ROLE_USER" ? "USER" : "ADMIN"}
                                    </Badge>

                                ),
                            },
                            {
                                accessor: 'actions',
                                title: <Box mr={6}>Action</Box>,
                                textAlign: 'right',
                                render: (user) => (
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <Button variant="filled" size="xs" onClick={() => console.table(user.role)}>{user.role == "ROLE_USER" ? "Promote" : "Demote"}</Button>
                                        <Button variant="filled" color="orange" size="xs" onClick={() => console.table(user.status)}>{user.status == "ACTIVE" ? "disable" : "enable"}</Button>
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
                            { accessor: 'created_at', title: 'register', render: ({ created_at }: any) => dayjs(created_at).fromNow() },
                            // for now last_activity_app disable
                            // {
                            //     accessor: 'activity.last_activity_app', title: 'APP', render: ({ activity }: any) =>
                            //         dayjs(activity.last_activity_app).fromNow()
                            // },
                            {
                                accessor: 'activity.last_activity_web', title: 'WEB', render: ({ activity }: any) =>
                                    dayjs(activity.last_activity_web).fromNow()
                            },
                            {
                                accessor: 'activity.last_activity_network', title: 'Last Online', render: ({ activity }: any) =>
                                    dayjs(activity.last_activity_network).fromNow()
                            },
                        ]
                    },

                ]}
            />
        </>
    );

}