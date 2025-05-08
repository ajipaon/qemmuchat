import { ScrollArea } from "@mantine/core";
import classes from "./Navigaiton.module.css";
import NavigationLinksGroup from "./NavigationLinkGroup.tsx";
import { NavItem } from "../../types/navtype.ts";

interface Props {
    data: NavItem[];
    hidden?: boolean;
}

export function Navigation({ data, hidden }: Props) {
    const links = data.map((item) => (
        <NavigationLinksGroup key={item.label} {...item} />
    ));

    return (
        <nav style={{
            display: hidden ? 'none' : 'block',
            height: '100%',
            overflowY: 'auto'
        }}>
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>
        </nav>
    );
}
