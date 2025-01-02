/* eslint-disable @typescript-eslint/no-explicit-any */
import '@mantine/core/styles.css';

import NewOrganization from "@/component/init/NewOrganizaton.tsx";
import Register from "@/component/init/Register.tsx";
import Login from "@/component/init/Login.tsx";
import { sectionStatus } from "@/component/init/store/data.ts";
import { useGetConfig } from './query';
export default function Index() {
    const { data, isLoading }: { data: any, isLoading: boolean }
        = useGetConfig(sectionStatus.NEW_ORGANIZATION)

    if (isLoading) return <></>

    return (
        <>

            <NewOrganization />
            <Register />
            <Login />
        </>

    );
}
