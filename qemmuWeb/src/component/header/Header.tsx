import React from "react";
import { Avatar, Button, Menu, Select } from "@mantine/core";
import classes from "./Header.module.css";
import { useChangeOrganization, useGetUserDetail } from "./query";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { useOrganizationsStore } from "../../config/globalStore/organizatonsData";
import { newOrganizationModal } from "./type";
import { deCodeJwt } from "../../config/jwtClient";
import { notifications } from "@mantine/notifications";
import ModalNewOrganization from "./ModalNewOrganization";
import Activity from "./Activity";
import NotificationEvent from "./NotivicationEvent";
interface Props {
    burger?: React.ReactNode;
}


export default function Header({ burger }: Props) {

    const [lastOrganization, setLastOrganization] = useState<any>(null)
    const [dataOrganization, setDataOrganization] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const { data }: { data: any } = useGetUserDetail()
    const { setData } = useOrganizationsStore()
    const [value] = useLocalStorage<string>({
        key: "token",

    });
    const { onOpen } = newOrganizationModal()
    const mutateChengeOrganization = useChangeOrganization()

    useEffect(() => {
        if (data?.user_organizations) {

            const dataOrganizarion = data?.user_organizations.map((org: any) => ({
                value: org?.ID,
                label: org?.name
            }));
            setData(data?.user_organizations)
            const dataToken = deCodeJwt(value);
            if (dataToken?.last_organization) {
                const findData = dataOrganizarion.find(
                    (org: any) => org.value == dataToken.last_organization
                );
                setLastOrganization(findData || null);
            }
            setDataOrganization(dataOrganizarion)
        }

    }, [data]);

    const handleChangeValue = (value: string | null) => {
        if (value) {
            const findData = dataOrganization.find((org: any) => org.value == value)
            setLastOrganization(findData || null);
            mutateChengeOrganization.mutateAsync(value).then((data: any) => {
                notifications.show({
                    color: 'teal',
                    message: data?.message || "success Change Organization",
                    autoClose: 3000,
                });
                window.location.reload();
            })
        }
    }

    return (
        <>
            <header className={classes.header}>
                {burger && burger}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <Select
                        className={classes.nativeselect}
                        data={dataOrganization}
                        placeholder="Pick value"
                        searchable
                        value={lastOrganization?.value}
                        onChange={handleChangeValue}
                        searchValue={searchValue}
                        onSearchChange={(value) => {
                            setSearchValue(value)
                        }}

                        maxDropdownHeight={200}
                    />
                    <Button variant="filled" onClick={onOpen}>Create Org</Button>
                </div>
                <div className={classes.footer}>
                    <Menu withArrow position="top" >
                        <Menu.Target>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Avatar
                                    key={"mar"}
                                    name={"name"}
                                    color="initials"
                                    allowedInitialsColors={["blue", "red"]}
                                />

                            </div>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            </header>
            <ModalNewOrganization />
            {/* <Activity /> */}
            <NotificationEvent />
        </>
    );
}
