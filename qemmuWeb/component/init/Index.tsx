/* eslint-disable @typescript-eslint/no-explicit-any */
import '@mantine/core/styles.css';

import NewOrganization from "@/component/init/NewOrganizaton";
import Register from "@/component/init/Register";
import Login from "@/component/init/Login";
import { sectionStatus } from "@/component/init/store/data";
import { useGetConfig } from './query';
import { useState, useEffect } from 'react';

export default function Index() {
    const [currentSection, setCurrentSection] = useState<sectionStatus>(sectionStatus.LOGIN);
    const { data, isLoading }: { data: any, isLoading: boolean } = useGetConfig(sectionStatus.NEW_ORGANIZATION);

    useEffect(() => {
        if (!isLoading) {
            setCurrentSection(data?.ID ? sectionStatus.LOGIN : sectionStatus.NEW_ORGANIZATION);
        }
    }, [data, isLoading]);

    if (isLoading) {
        return
    }

    switch (currentSection) {
        case sectionStatus.NEW_ORGANIZATION:
            return <NewOrganization section={currentSection} />;
        case sectionStatus.LOGIN:
            return <Login sectionCurrent={currentSection} setCurrentSection={setCurrentSection} />;
        case sectionStatus.REGISTER:
            return <Register sectionCurrent={currentSection} setCurrentSection={setCurrentSection} />;
        default:
            return <p>Unknown section</p>;
    }
}
