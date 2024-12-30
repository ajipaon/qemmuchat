"use client";


import classes from "./Header.module.css";
// import { FaRegWindowClose } from "react-icons/fa";
import { FaReact } from "react-icons/fa6";
interface Props {
    burger?: React.ReactNode;
}

export default function Header({ burger }: Props) {
    // const [opened, { close, open }] = useDisclosure(false);

    return (
        <header className={classes.header}>
            {burger && burger}
            <FaReact size={30} />
            {/*<Box style={{ flex: 1 }} />*/}
            {/*<TextInput*/}
            {/*    placeholder="Search"*/}
            {/*    variant="filled"*/}
            {/*    leftSection={<IconSearch size="0.8rem" />}*/}
            {/*    style={{}}*/}
            {/*/>*/}
            {/*<ActionIcon onClick={open} variant="subtle">*/}
            {/*    <FaRegWindowClose size="1.25rem" />*/}
            {/*</ActionIcon>*/}

            {/*<Drawer*/}
            {/*    opened={opened}*/}
            {/*    onClose={close}*/}
            {/*    title="Settings"*/}
            {/*    position="right"*/}
            {/*    transitionProps={{ duration: 0 }}*/}
            {/*>*/}
            {/*    <Stack gap="lg">*/}
            {/*        <ThemeSwitcher />*/}
            {/*        <DirectionSwitcher />*/}
            {/*    </Stack>*/}
            {/*</Drawer>*/}
        </header>
    );
}
