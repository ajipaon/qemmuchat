/* eslint-disable @typescript-eslint/no-explicit-any */
import '@mantine/core/styles.css';

import NewOrganization from "./NewOrganizaton";
import Register from "./Register";
import Login from "./Login";
import { useGetConfig } from './query';
import { useState, useEffect } from 'react';
import { sectionStatus } from './store/data';

export default function Index() {
    const [currentSection, setCurrentSection] = useState<sectionStatus>(sectionStatus.LOGIN);
    const { data, isLoading }: { data: any, isLoading: boolean } = useGetConfig(sectionStatus.NEW_APP);

    useEffect(() => {
        if (!isLoading) {
            setCurrentSection(data?.ID ? sectionStatus.LOGIN : sectionStatus.NEW_APP);
        }
    }, [data, isLoading]);

    if (isLoading) {
        return
    }

    switch (currentSection) {
        case sectionStatus.NEW_APP:
            return <NewOrganization section={currentSection} />;
        case sectionStatus.LOGIN:
            return <Login sectionCurrent={currentSection} setCurrentSection={setCurrentSection} />;
        case sectionStatus.REGISTER:
            return <Register sectionCurrent={currentSection} setCurrentSection={setCurrentSection} />;
        default:
            return <p>Unknown section</p>;
    }
}
