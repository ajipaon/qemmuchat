import { DataTable } from 'mantine-datatable';
import { useGetAllUserSperAdmin } from './query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { ActionIcon, Badge, Box, Group, Input } from '@mantine/core';
import { MdOutlineRemoveRedEye, MdEdit, MdDeleteForever } from "react-icons/md";

dayjs.extend(relativeTime);

export default function Admin() {

    const [page, setPage] = useState(1);
    const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useGetAllUserSperAdmin() as any

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

    if (isLoading) {
        return <></>
    }

    return (
        <>
            <Input placeholder="Input component" />
            <Input placeholder="Input component" />
            <Input placeholder="Input component" />
            <DataTable
                height={500}
                withTableBorder
                withColumnBorders
                striped
                records={data?.pages[page - 1]?.data || []}
                rowColor={({ status }) => {
                    if (status != 'ACTIVE') return 'violet';
                }}
                totalRecords={data.pages[0].pages.total || 0}
                recordsPerPage={data.pages[0].pages.limit || 5}
                page={page}
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
                                    < Badge color={data.role == "ROLE_USER" ? "orange" : "cyan"} variant="filled" >
                                        {data.role == "ROLE_USER" ? "USER" : "ADMIN"}
                                    </Badge>

                                ),
                            },
                            {
                                accessor: 'actions',
                                title: <Box mr={6}>Action</Box>,
                                textAlign: 'right',
                                render: (company) => (
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="green"
                                            onClick={() => console.log({ company, action: 'view' })}
                                        >
                                            <MdOutlineRemoveRedEye />
                                        </ActionIcon>
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="blue"
                                            onClick={() => console.log({ company, action: 'edit' })}
                                        >
                                            <MdEdit />
                                        </ActionIcon>
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="red"
                                            onClick={() => console.log({ company, action: 'delete' })}
                                        >
                                            <MdDeleteForever />
                                        </ActionIcon>
                                    </Group>
                                ),
                            },
                        ],
                    },

                    {
                        id: 'activity-info',
                        title: 'Last activity',
                        textAlign: 'center',
                        style: (theme) => ({ color: theme.colors.blue[6] }),
                        columns: [
                            { accessor: 'created_at', title: 'register', render: ({ created_at }: any) => dayjs(created_at).fromNow() },
                            {
                                accessor: 'activity.last_activity_app', title: 'APP', render: ({ activity }: any) =>
                                    dayjs(activity.last_activity_app).fromNow()
                            },
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