import '@mantine/core/styles.css';

import NewOrganization from "@/component/init/NewOrganizaton.tsx";
import Register from "@/component/init/Register.tsx";
import Login from "@/component/init/Login.tsx";
import {newSection} from "@/component/init/store/data.ts";
export default function Index() {

    const {section} =  newSection();

    if (!section) {
        return null;
    }

    return (
        <>
           <NewOrganization/>
            <Register/>
            <Login/>
        </>

    );
}
