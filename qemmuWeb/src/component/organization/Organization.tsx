import { useEffect, useState } from "react";
import { Badge, Button, Flex, Select, TextInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useOrganizationsStore } from "../../config/globalStore/organizatonsData";
import { useGetUserByOrganizationSuerAdmin } from "./query";
import MOdalChangeRoleOrganization from "./modalChangeRoleOrganizaton";

export default function Organization() {
    const { data: records } = useOrganizationsStore();
    const [search, setSearch] = useState({ id: "", name: "", email: "" })
    const [readySearch, setReadySearch] = useState<any>({ id: "", name: "", email: "" })
    const [selectValue, setSelectValue] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [dataUpdateRole, setDataUpdateRole] = useState({ userId: "", orgId: "" })
    const [openModalChangeRoleOrg, setOpenModalChangeRoleOrg] = useState<boolean>(false)
    const { data, hasNextPage, fetchNextPage } = useGetUserByOrganizationSuerAdmin(readySearch) as any

    useEffect(() => {
        if (selectValue && typeof (selectValue) == "string") {
            setReadySearch((prevSearch) => ({
                ...prevSearch,
                ["id"]: selectValue,
            }));
        }

    }, [selectValue])

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
        setSearch({ id: "", name: "", email: "" })
        setReadySearch((prevSearch) => ({
            ...prevSearch,
            ["name"]: "",
            ["email"]: ""
        }));
    }

    const handleUpdateSearch = (key: string, value: any) => {
        setSearch((prevSearch) => ({
            ...prevSearch,
            [key]: value,
        }));
    };

    const handleSearch = () => {
        setReadySearch((prevSearch) => ({
            ...prevSearch,
            ["name"]: search.name,
            ["email"]: search.email
        }));

    }

    const handleModalChangeRole = (id) => {
        setDataUpdateRole((prevSearch) => ({
            ...prevSearch,
            ["userId"]: id,
            ["orgId"]: selectValue
        }));
        setOpenModalChangeRoleOrg(true)

    }

    return (
        <>
            <Flex justify="end" align="ceter" gap="md" mb="10px">
                <Select
                    placeholder="select Team"
                    defaultChecked={false}
                    value={selectValue}
                    onChange={setSelectValue}
                    data={records.map(item => ({ value: item.ID, label: item.name })) || []}
                />
            </Flex>
            <Flex justify="start" align="ceter" gap="md" mb="10px">
                <TextInput value={search?.name || ""} placeholder="Search Name" type='text' onChange={(e) => handleUpdateSearch("name", e.target.value)} />
                <TextInput value={search?.email || ""} placeholder="Search Email" type='email' onChange={(e) => handleUpdateSearch("email", e.target.value)} />
                <Button variant="filled" onClick={handleSearch}>Search</Button>
                <Button variant="filled" color='orange' onClick={handleResetSearch}>Reset</Button>
            </Flex>
            <DataTable
                height={500}
                withTableBorder
                withColumnBorders
                striped
                records={data?.pages[page - 1]?.data || []}
                totalRecords={data?.pages[0].pages.total || 0}
                recordsPerPage={data?.pages[0].pages.limit || 5}
                page={page || 1}
                onPageChange={(p) => handleChengePage(p)}
                rowColor={({ status }: { status: string }) => {
                    if (status != 'ACTIVE') return 'red';
                }}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        textAlign: 'right',
                        width: 30,
                        render: (record) => records.indexOf(record) + 1,
                    },
                    { accessor: 'name', textAlign: 'center' },
                    { accessor: 'email', textAlign: 'center' },
                    {
                        accessor: 'role team', textAlign: 'center',
                        render: (data: any) => (
                            < Badge component="button" color="cyan" variant="filled" onClick={() => handleModalChangeRole(data.id)}>
                                {data?.role || ""}
                            </Badge>

                        ),
                    },
                ]}
            />
            <MOdalChangeRoleOrganization openModalChangeRoleOrg={openModalChangeRoleOrg} setOpenModalChangeRoleOrg={setOpenModalChangeRoleOrg} dataUpdateRole={dataUpdateRole} />
        </>
    );
}