import { Avatar, Menu } from "@mantine/core";
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
    );
}
