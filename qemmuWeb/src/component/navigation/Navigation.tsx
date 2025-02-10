import { ScrollArea } from "@mantine/core";
import classes from "./Navigaiton.module.css";
import NavigationLinksGroup from "./NavigationLinkGroup.tsx";
import { NavItem } from "../../types/navtype.ts";

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

        </>
    );
}
