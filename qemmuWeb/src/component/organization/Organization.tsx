import React from "react";
import classes from "./Organization.module.css";
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { useOrganizationsStore } from "../../config/globalStore/organizatonsData";


export default function Organization() {
    const { data: records } = useOrganizationsStore();

    return (
        <DataTable
            striped
            withTableBorder
            withColumnBorders
            records={records}
            idAccessor="ID"
            columns={[
                { accessor: 'ID', title: "ID", render: (_, index) => (<span>{index + 1}</span>) },
                { accessor: 'name', title: "name" },
                { accessor: 'CreatedAt', title: 'Created At' },
                {
                    accessor: 'actions',
                    width: '0%',
                    title: <Box mx={6}>Actions</Box>,
                    textAlign: 'right',
                    render: (record) => (
                        <Group gap={4} justify="right" wrap="nowrap">
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    console.log('Edit action triggered:', record);
                                }}
                            >
                                <FaRegEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    console.log('Delete action triggered:', record);
                                }}
                            >
                                <FaTrashAlt size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                },
            ]}
            rowExpansion={{
                content: ({ record }: { record: any }) => (
                    <Stack className={classes.details} p="xs" gap={6}>
                        <Group gap={6}>
                            <div className={classes.label}>Postal address:</div>
                            <div>
                                {record.ID}, {record.name}, {record.state}
                            </div>
                        </Group>
                        <Group gap={6}>
                            <div className={classes.label}>Mission statement:</div>
                            <Box fs="italic">“{record.ID}”</Box>
                        </Group>
                    </Stack>
                ),
            }}
        />
    );
}