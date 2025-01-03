import { Avatar, Menu, ScrollArea } from "@mantine/core";
import classes from "@/component/navigation/Navigaiton.module.css";
import NavigationLinksGroup from "@/component/navigation/NavigationLinkGroup.tsx";
import { NavItem } from "@/types/navtype.ts";

interface Props {
    data: NavItem[];
    hidden?: boolean;
}

export function Navigation({ data }: Props) {
    const links = data.map((item) => (
        <NavigationLinksGroup key={item.label} {...item} />
    ));


    return (
        <>
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

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
                            <span style={{
                                fontSize: "1rem",
                                fontWeight: "bold"
                            }}>{"user name"}</span>
                        </div>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item>Logout</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </>
    );
}
