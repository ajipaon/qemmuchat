import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Collapse,
    Group,
    ThemeIcon,
    UnstyledButton,
} from "@mantine/core";
import classes from "./NavigationLinksGroup.module.css";
import { IconType } from "react-icons";
import { activeComponent } from "../dasbobard/store/data";
import { ActiveComponentType } from "../../types/mainType";
import { useSelectUserChatStore } from "../../config/globalStore/selectuser";

interface LinksGroupProps {
    icon: IconType;
    label: string;
    link?: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

export default function NavigationLinksGroup({
    icon: Icon,
    label,
    link,
    initiallyOpened,
    links,
    isActive,
}: LinksGroupProps & { isActive?: boolean }) {
    const [opened, setOpened] = useState(initiallyOpened || false);
    const { pathname } = useLocation();
    const dir = "ltr";
    const ChevronIcon = dir === "ltr" ? FaChevronRight : FaChevronLeft;
    const { setComponentActive } = activeComponent()
    const { data: userProfileSelected } = useSelectUserChatStore()


    const handleUpdateComponent = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        // e.preventDefault();
        setComponentActive(link as ActiveComponentType);
    };

    useEffect(() => {
        if (userProfileSelected) {
            setComponentActive("CHAT")
        }
    }, [userProfileSelected])


    const items = (links || []).map((link) => (
        <Link
            to={link.link}
            key={link.label}
            className={`${classes.link} ${pathname === link.link ? 'active' : ''}`}
            onClick={(e) => handleUpdateComponent(e, link.link)}
        >
            {link.label}
        </Link>
    ));

    return (
        <>
            {link ? (
                <Link
                    to={link}
                    className={`${classes.control} ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleUpdateComponent(e, "DASHBOARD")}
                >
                    <Group gap={0} justify="space-between">
                        <Box style={{ display: "flex", alignItems: "center" }}>
                            <ThemeIcon variant="light" size={30}>
                                <Icon size={20} />
                            </ThemeIcon>
                            <Box ml="md">{label}</Box>
                        </Box>
                    </Group>
                </Link>
            ) : (
                <UnstyledButton
                    style={{ backgroundColor: "#393939" }}
                    onClick={() => {
                        if (Array.isArray(links)) {
                            setOpened((o) => !o);
                            return;
                        }
                    }}
                    className={classes.control}
                >
                    <Group gap={0} justify="space-between" p="xs">
                        <Box style={{ display: "flex", alignItems: "center" }}>
                            <ThemeIcon variant="light" size={30}>
                                <Icon size={20} />
                            </ThemeIcon>
                            <Box ml="md">{label}</Box>
                        </Box>
                        {Array.isArray(links) && (
                            <ChevronIcon
                                className={classes.chevron}
                                size={16}
                            />
                        )}
                    </Group>
                </UnstyledButton>
            )}
            {Array.isArray(links) ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
