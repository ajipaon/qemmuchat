import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    Box,
    Collapse,
    Group,
    ThemeIcon,
    UnstyledButton,
} from "@mantine/core";
import classes from "./NavigationLinksGroup.module.css";
import { IconType } from "react-icons";
import {activeComponent} from "@/component/dasbobard/store/data.ts";
import {ActiveComponentType} from "@/types/mainType.ts";

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
}: LinksGroupProps) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const dir = "ltr";
    const ChevronIcon = dir === "ltr" ? FaChevronRight : FaChevronLeft;
    const {setComponentActive} = activeComponent()

    const handleUpdateComponent = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        e.preventDefault(); // Mencegah reload halaman
        setComponentActive(link as ActiveComponentType); // Mengubah komponen aktif
    };


    const items = (hasLinks ? links : []).map((link) => (
        <a
            href={link.link}
            key={link.label}
            className={`${classes.link} ${window.location.pathname === link.link && classes.activeLink}`}
            onClick={(e) => handleUpdateComponent(e, link.link)}

        >
            {link.label}
        </a>
    ));

    // @ts-ignore
    return (
        <>
            {link ? (
                <a
                    href={link}
                    className={`${classes.control} ${window.location.pathname === link && classes.activeControl}`}
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
                </a>
            ) : (
                <UnstyledButton
                    style={{ backgroundColor: "#393939" }}
                    onClick={() => {
                        if (hasLinks) {
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
                        {hasLinks && (
                            <ChevronIcon
                                className={classes.chevron}
                                size={16}
                                style={{
                                    transform: opened
                                        ? `rotate(${dir === "rtl" ? -90 : 90}deg)`
                                        : "none",
                                }}
                            />
                        )}
                    </Group>
                </UnstyledButton>
            )}
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
